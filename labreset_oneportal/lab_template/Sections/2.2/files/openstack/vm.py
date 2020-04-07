from novaclient import client
from pprint import pprint as pp
# Load the user credentials
execfile('openstack/credentials.py')

nova = client.Client(2,username, password, tenant_name, "https://salesdemo-sjc.openstack.blueboxgrid.com:5000/v2.0", region_name="RegionOne",service_type="compute")

def getServers():
  list_servers=nova.servers.list()
  servers=[]
  for server in list_servers:
    ##we create a json for the respond
    servers.append({'id':server.id,"hostname":server.name,"status":server.status})
  return servers
  
