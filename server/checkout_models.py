from google.appengine.ext import ndb
from pymill import pymill_gae
import logging


PAYMILL_PRIVATE_KEY = "e395a0ef57ee844e99c3c57665b80e6b"


def init_pymill():
    return pymill.Pymill()


class Order(ndb.Model):
    token = ndb.StringProperty(required=True)
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    client_id = ndb.StringProperty()
    user_id = ndb.KeyProperty()

    data = ndb.JsonProperty(indexed=False)
    payment = ndb.JsonProperty(indexed=False)

    def preauth(self):
        p = pymill_gae.Pymill(PAYMILL_PRIVATE_KEY)
        p.preauth(amount=self.data.get("amount_int"), currency=self.data.get("currency"), description=None, token=self.token, client=self.client_id, payment=self.payment)

    def transaction(self):
        p = pymill_gae.Pymill(PAYMILL_PRIVATE_KEY)

    def refund(self):
        p = pymill_gae.Pymill(PAYMILL_PRIVATE_KEY)

    @classmethod
    def create_order(cls, order_multi_dict):
        def split_name(name):
            name_array = name.split(" ")
            first_names = " ".join(name_array[0:-1])
            last_name = name_array[-1]
            return first_names, last_name

        p = pymill_gae.Pymill(PAYMILL_PRIVATE_KEY)

        token = order_multi_dict.get("paymillToken")

        new_order = cls()

        new_order.first_name, new_order.last_name = split_name(order_multi_dict.get("fullName"))

        new_order.token = token
        new_order.data = order_multi_dict.mixed()

        new_order.payment = p.newcard(token).get("data")

        logging.info(new_order.payment)

        if new_order.payment:
            new_order.put()
            return new_order.key.id()

        return new_order.payment
