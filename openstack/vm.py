from novaclient import client
from pprint import pprint as pp
nova = client.Client(2,"xxxx", "xxxx", "x", "xxxx", region_name="RegionOne", service_type="compute")

# List OpenStack servers
def getServers():
	list_servers=nova.servers.list()
	servers=[]
	for server in list_servers:
		##we create a json for the respond
		servers.append({'id':server.id,"hostname":server.name,"status":server.status})
	return servers 

# List options to create OpenStack servers
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

# Get details for a specific VM
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

# Create a VM in OpenStack
def createVM(name, image_id, flavor_id,sec_group,  key_name,nic):
	nic = [{'net-id': nic}] ## network parameter needs to be specified in this format
	server = nova.servers.create(name, flavor_id, image_id, security_groups=[sec_group],  key_name=key_name,nics=nic)
	return server.name

# Pause OpenStack VM 
def pause(id):
	result=nova.servers.pause(id)
	return True	

# Reboot openStack VM
def reboot(id):
	result=nova.servers.reboot(id,reboot_type='SOFT')
	return True	

#Play OpenStack VM
def play(id):
	result=nova.servers.unpause(id)
	return True	

# Delete OpenStack VM
def delete(id):
	result=nova.servers.delete(id)
	return True	
