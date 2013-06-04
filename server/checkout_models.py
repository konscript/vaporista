from google.appengine.ext import ndb
import pymill


PAYMILL_PRIVATE_KEY = "e395a0ef57ee844e99c3c57665b80e6b"


def init_pymill():
    return pymill.Pymill()


class Order(ndb.Model):
    token = ndb.StringProperty(required=True)
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    client_id = ndb.StringProperty()

    data = ndb.JsonProperty()

    payment = ndb.JsonProperty()

    def preauth(self):
        p = pymill.Pymill(PAYMILL_PRIVATE_KEY)
        p.preauth(amount=self.data.get("amount_int"), currency=self.data.get("currency"), description=None, token=self.token, client=self.client_id, payment=self.payment)

    def transaction(self):
        p = pymill.Pymill(PAYMILL_PRIVATE_KEY)

    def refund(self):
        p = pymill.Pymill(PAYMILL_PRIVATE_KEY)

    @classmethod
    def create_order(cls, order_multi_dict):
        def split_name(name):
            name_array = name.split(" ")
            first_names = " ".join(name_array[0:-1])
            last_name = name_array[-1]
            return first_names, last_name

        p = pymill.Pymill(PAYMILL_PRIVATE_KEY)

        token = order_multi_dict.get("paymillToken")

        new_order = cls()

        new_order.first_name, new_order.last_name = split_name(order_multi_dict.get("fullName"))

        new_order.token = token
        new_order.data = order_multi_dict.mixed()

        new_order.payment = p.newcard(token).get("data", {})

        if new_order.payment:
            new_order.put()
            return True

        return False
