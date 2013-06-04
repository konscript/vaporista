from handlers import BaseHandler
from server.checkout_models import Order


class OrdersHandler(BaseHandler):
    def get(self):
        orders = Order.query()
        self.json_response({orders: orders})


class AcceptOrderHandler(BaseHandler):
    def get(self):
        pass


class DeclineOrderHandler(BaseHandler):
    def get(self):
        pass


class CaptureOrderHandler(BaseHandler):
    def get(self):
        pass
