import pymill
from handlers import BaseHandler


p = pymill.Pymill("e395a0ef57ee844e99c3c57665b80e6b")


class CheckoutHandler(BaseHandler):
    def get(self):
        token = self.request.POST.get("paymillToken")


for i in p.getcards()["data"]:
    print i["id"] #show IDs for all stored cards

card=p.newcard("token from Paymill bridge goes here")["data"] #store a credit card
print card
transaction=transact(230, payment=card["id"])["data"] #Charge card with 2 Euros and 30 Cents
print transaction
ref=refund(transaction["id"],30) #refund 30 cents
print ref