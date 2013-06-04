from handlers import BaseHandler
from server.checkout_models import Order
#import logging


class CheckoutHandler(BaseHandler):
    def post(self):
        order = Order.create_order(self.request.POST)
        self.json_response({"success": order})
