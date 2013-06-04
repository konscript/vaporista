# -*- coding: utf-8 -*-

"""
    A real simple app for using webapp2 with auth and session.

    It just covers the basics. Creating a user, login, logout and a decorator for protecting certain handlers.

    Routes are setup in routes.py and added in main.py

"""

import webapp2
import datetime
import urlparse
from webapp2_extras import auth
from webapp2_extras import sessions
from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError
from webapp2_extras import json
from google.appengine.ext import ndb
from google.appengine.api import urlfetch
from babel.dates import format_datetime
from pytz import timezone


def user_required(handler):
    """
         Decorator for checking if there's a user associated with the current session.
         Will also fail if there's no session present.
     """

    def check_login(self, *args, **kwargs):
        auth = self.auth
        if not auth.get_user_by_session():
            # If handler has no login_url specified invoke a 403 error
            try:
                self.redirect(self.auth_config['login_url'], abort=True)
            except (AttributeError, KeyError), e:
                self.abort(403)
        else:
            return handler(self, *args, **kwargs)

    return check_login


def json_format(obj):
    '''
        Format datastore values to use in JSON structure
    '''

    # format timestamp
    if isinstance(obj, datetime.datetime) or isinstance(obj, datetime.date):
        #obj.astimezone(pytz.utc)
        return format_datetime(obj, "dd/MM-yyyy HH:mm", tzinfo=timezone('Europe/Copenhagen'))

    # format blobkey to None
    elif isinstance(obj, ndb.BlobKey):
        return None

    # get key of parent
    elif isinstance(obj, ndb.Key) and obj.parent():
        return obj.urlsafe()

    # get id of key
    elif isinstance(obj, ndb.Key):
        return obj.id()

    elif isinstance(obj, ndb.Model):
        return obj.to_dict()

    elif isinstance(obj, urlfetch._URLFetchResult):
        return {
            "content": urlparse.parse_qs(obj.content),
            "status_code": obj.status_code
        }

    # return plain object
    else:
        return obj


class BaseHandler(webapp2.RequestHandler):
    """
         BaseHandler for all requests

         Holds the auth and session properties so they are reachable for all requests
     """

    def json_response(self, data_dict, encode=True, image_size=600, cache_id=None, cache_timeout=3600):
        self.response.content_type = 'application/json'
        self.response.content_type_params = {'charset': 'utf-8'}
        if not encode:
            self.response.headers.add("Content-Length", len(data_dict))
            self.response.write(data_dict)
            return

        data = {}
        data["data"] = data_dict
        if self.request.GET.get("get_categories", "false").__eq__("true") and encode:
            data["categories"] = []

        if encode:
            response = json.encode(data, default=json_format)
            if cache_id:
                memcache.set(cache_id, response, cache_timeout)
            self.response.write(response)

    def dispatch(self):
        """
              Save the sessions for preservation across requests
          """
        try:
            response = super(BaseHandler, self).dispatch()
            self.response.write(response)
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def auth(self):
        return auth.get_auth()

    @webapp2.cached_property
    def session_store(self):
        return sessions.get_store(request=self.request)

    @webapp2.cached_property
    def auth_config(self):
        """
              Dict to hold urls for login/logout
          """
        return {
            'login_url': self.uri_for('login'),
            'logout_url': self.uri_for('logout')
        }


class IndexHandler(BaseHandler):
  def get(self):
    f = open('templates/index.html', 'r')
    return f.read()


class LoginHandler(BaseHandler):
    def get(self):
        """
              Returns a simple HTML form for login
          """
        return """
            <!DOCTYPE hml>
            <html>
                <head>
                    <title>webapp2 auth example</title>
                </head>
                <body>
                <form action="%s" method="post">
                    <fieldset>
                        <legend>Login form</legend>
                        <label>Username <input type="text" name="username" placeholder="Your username" /></label>
                        <label>Password <input type="password" name="password" placeholder="Your password" /></label>
                        <label>Remember me? <input type="checkbox" name="remember_me" placeholder="Remember me?" /></label>
                    </fieldset>
                    <button>Login</button>
                </form>
            </html>
        """ % self.request.url

    def post(self):
        """
              username: Get the username from POST dict
              password: Get the password from POST dict
          """
        username = self.request.POST.get('username')
        password = self.request.POST.get('password')
        remember_me = True if self.request.POST.get('remember_me') == 'on' else False
        # Try to login user with password
        # Raises InvalidAuthIdError if user is not found
        # Raises InvalidPasswordError if provided password doesn't match with specified user
        try:
            self.auth.get_user_by_password(username, password, remember=remember_me)
            self.redirect('/secure')
        except (InvalidAuthIdError, InvalidPasswordError), e:
            # Returns error message to self.response.write in the BaseHandler.dispatcher
            # Currently no message is attached to the exceptions
            # return e
            return "Login error. Try again: <a href='%s'>Login</a>" % (self.auth_config['login_url'])


class CreateUserHandler(BaseHandler):
    def get(self):
        """
              Returns a simple HTML form for create a new user
          """
        return """
            <!DOCTYPE hml>
            <html>
                <head>
                    <title>webapp2 auth example</title>
                </head>
                <body>
                <form action="%s" method="post">
                    <fieldset>
                        <legend>Create user form</legend>
                        <label>Username <input type="text" name="username" placeholder="Your username" /></label>
                        <label>Password <input type="password" name="password" placeholder="Your password" /></label>
                    </fieldset>
                    <button>Create user</button>
                </form>
            </html>
        """ % self.request.url

    def post(self):
        """
              username: Get the username from POST dict
              password: Get the password from POST dict
          """
        username = self.request.POST.get('username')
        password = self.request.POST.get('password')
        # Passing password_raw=password so password will be hashed
        # Returns a tuple, where first value is BOOL. If True ok, If False no new user is created
        user = self.auth.store.user_model.create_user(username, password_raw=password)
        if not user[0]: #user is a tuple
            return 'Create user error: %s' % str(user) # Error message
        else:
            # User is created, let's try redirecting to login page
            try:
                self.redirect(self.auth_config['login_url'], abort=True)
            except (AttributeError, KeyError), e:
                self.abort(403)


class LogoutHandler(BaseHandler):
    """
         Destroy user session and redirect to login
     """

    def get(self):
        self.auth.unset_session()
        # User is logged out, let's try redirecting to login page
        try:
            self.redirect(self.auth_config['login_url'])
        except (AttributeError, KeyError), e:
            return "User is logged out"


class SecureRequestHandler(BaseHandler):
    """
         Only accessible to users that are logged in
     """

    @user_required
    def get(self, **kwargs):
        user_session = self.auth.get_user_by_session()
        user = self.auth.store.user_model.get_by_auth_token(user_session['user_id'], user_session['token'])
        user[0].username = 'a'
        user[0].put()

        try:
            return "Secure zone %s <a href='%s'>Logout</a>" % (user, self.auth_config['logout_url'])
        except (AttributeError, KeyError), e:
            return "Secure zone"
