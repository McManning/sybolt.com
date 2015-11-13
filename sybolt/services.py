
# Imports for MurmurServiceNotifier
import Ice 

sys.path.append("/opt/murmur") 
import Murmur 

class MurmurServiceNotifier():
    """
        Notification tie-in for the Murmur server.
        Capable of connecting to the server via ICE and notifying
        users of stream activities
    """
    
    def __init__(self, host, port, secret):
        self.meta = None
        self.comm = None
        self.host = host
        self.port = port
        self.secret = secret
        
    def connect(self):
        if not self.comm:
            prop = Ice.createProperties([])
            prop.setProperty("Ice.ImplicitContext", "Shared")
            prop.setProperty("Ice.MessageSizeMax", "65535")
            prop.setProperty("Ice.Default.EncodingVersion", "1.0")
            
            idd = Ice.InitializationData()
            idd.properties = prop
            self.comm = Ice.initialize(idd)
            
            self.comm.getImplicitContext().put("secret", self.secret)

            base = self.comm.stringToProxy(
                "Meta:tcp -h {} -p {}".format(self.host, self.port)
            )
            self.meta = Murmur.MetaPrx.checkedCast(base)
            
    def disconnect(self):
        if self.comm:
            self.comm.shutdown()
            
        self.meta = None
        self.comm = None
            
    def notify_servers(self, message):
        
        self.connect()
        
        for server in self.meta.getBootedServers():
            server.sendMessageChannel(0, 1, message)
