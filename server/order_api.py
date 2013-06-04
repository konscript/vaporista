from protorpc import messages
from protorpc import remote
from protorpc.wsgi import service

package = 'hello'

# Create the request string containing the user's name
class HelloRequest(messages.Message):
    my_name = messages.StringField(1, required=True)

# Create the response string
class HelloResponse(messages.Message):
    hello = messages.StringField(1, required=True)

# Create the RPC service to exchange messages
class HelloService(remote.Service):

    @remote.method(HelloRequest, HelloResponse)
    def hello(self, request):
        return HelloResponse(hello='Hello there, %s!' % request.my_name)

# Map the RPC service and path (/hello)
app = service.service_mappings([('/hello.*', HelloService)])