from webapp2_extras.routes import RedirectRoute
from handlers import LoginHandler
from handlers import LogoutHandler
from handlers import SecureRequestHandler
from handlers import CreateUserHandler
from handlers import IndexHandler
from handlers import CheckEmailHandler

from checkout_handlers import CheckoutHandler

# Using redirect route instead of simple routes since it supports strict_slash
# Simple route: http://webapp-improved.appspot.com/guide/routing.html#simple-routes
# RedirectRoute: http://webapp-improved.appspot.com/api/webapp2_extras/routes.html#webapp2_extras.routes.RedirectRoute

_routes = [
    RedirectRoute('/login', LoginHandler, name='login', strict_slash=False),
    RedirectRoute('/logout', LogoutHandler, name='logout', strict_slash=False),
    RedirectRoute('/secure', SecureRequestHandler, name='secure', strict_slash=False),
    RedirectRoute('/create_user', CreateUserHandler, name='create-user', strict_slash=False),
    RedirectRoute('/checkout', CheckoutHandler, name='checkout', strict_slash=False),
    RedirectRoute('/check_email', CheckEmailHandler, name='checkout', strict_slash=False),
    RedirectRoute('/', IndexHandler, name='index', strict_slash=True)
]


def get_routes():
    return _routes


def add_routes(app):
    for r in _routes:
        app.router.add(r)
