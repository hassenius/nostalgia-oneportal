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
  
def getOptions():
	## we get the flavors, images, security groups, networks and ssh keys
	list_flavors=nova.flavors.list()
	list_images=nova.images.list()
	list_sec_groups=nova.security_groups.list()
	list_networks=nova.networks.list()
	list_key_name=nova.keypairs.list()
	options=[]
	flavors=[]
	images=[]
	networks=[]
	keypairs=[]
	sec_groups = []
	for flavor in list_flavors:
		flavors.append({"id":flavor.id,"name":flavor.name})
	for image in list_images:
		images.append({"id":image.id,"name":image.name})
	for sec_group in list_sec_groups:
		sec_groups.append({"id":sec_group.id,"name":sec_group.name})
	for network in list_networks:
		networks.append({"id":network.id,"name":network.label})
	for key_pair in list_key_name:
		keypairs.append({"id":key_pair.id,"name":key_pair.name})
		
	options={"images":images,"flavors":flavors, "sec_groups":sec_groups, "networks": networks, "keypairs": keypairs}
	return options
  
def getVM(id):
	## we get the server details 
	server=nova.servers.get(id)
	## we get the options available
	options=getOptions()
	## we match the id of the option in the server details, with a name in teh options
	sec_group_fix=""
	network_fix=""
	for option in options['flavors']:
		if option['id']==server.flavor['id']:
			flavor_name=option['name']
	for option in options['images']:
		if option['id']==server.image['id']:
			image_name=option['name']	
	
	for sec_group in server.security_groups:
		sec_group_fix= str(sec_group['name'])+" "+str(sec_group_fix)
	for network in server.networks:
		network_fix=str(network)+" :"
		for ip in server.networks[network]:
			network_fix= str(network_fix)+" "+str(ip)
	## we return a JSON with the info	
	server_details= {"id": server.id, "name": server.name, "flavor": flavor_name, "security_group": sec_group_fix,  "key_name": server.key_name, "image": image_name, "networks": network_fix, "status": server.status}
	return server_details
