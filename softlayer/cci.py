import SoftLayer
from pprint import pprint as pp
user='xxxx';
apikey='xxxx';
client = SoftLayer.Client(username=user, api_key=apikey)

# List VMs in SL
def getCCIs():
	##Mask to get the right data that we will use
	object_mask = 'id,fullyQualifiedDomainName,powerState.name'
	result = client['Account'].getVirtualGuests(mask=object_mask)
	return result

# Get details of specific VM
def getCCI(id_cci):
	##Mask to get the right data that we will use
	object_mask = 'id,fullyQualifiedDomainName,operatingSystem.passwords,primaryBackendIpAddress, primaryIpAddress, maxCpu,maxMemory,powerState.name'
	## we specify the id of the object we want to retrieve the info
	result = client['Virtual_Guest'].getObject(id=id_cci, mask=object_mask)
	## we do some string conversion
	network_fix=str(result['primaryBackendIpAddress'])+" "+str(result['primaryIpAddress'])
	user_passwd=str(result['operatingSystem']['passwords'][0]['username'])+" / "+str(result['operatingSystem']['passwords'][0]['password'])
	flavor_name= str(result['maxCpu'])+" vCPU, "+str(result['maxMemory'])+" GB RAM"
	## we return a Json object
	server_details= {"id": result['id'], "name": result['fullyQualifiedDomainName'], "flavor": flavor_name,  "user_passwd": user_passwd, "image": result['operatingSystem']['softwareLicense']['softwareDescription']['longDescription'], "networks": network_fix,"status":result['powerState']['name']}
	return server_details

# Get options to create a VM
def createOptions():
	options = client['Virtual_Guest'].getCreateObjectOptions()
	return options

# Create server in SL
def createCCIServer(hostname, domain,processor,memory,block,os,network,location):
	## we build the order_template needed
	parameters = {
	     "hostname": hostname, 
		 "domain": domain, 
		 "startCpus": processor, 
		 "maxMemory": memory, 
		 "hourlyBillingFlag": "true", 
	    'operatingSystemReferenceCode' : os,
	    'localDiskFlag' : False,         
	    'datacenter' : {'name': location}     
	     } 
	result = client['Virtual_Guest'].createObject(parameters)
	return result

# Pause server in SL
def pause(id):
	result = client['Virtual_Guest'].pause(id=id)
	return result

# Play server in SL
def play(id):
	result = client['Virtual_Guest'].resume(id=id)
	return result

# Reboot server in SL
def reboot(id):
	result = client['Virtual_Guest'].rebootSoft(id=id)
	return result

# Delete server in SL
def delete(id):
	result = client['Virtual_Guest'].deleteObject(id=id)
	return result
