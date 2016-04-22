# So we can talk to the SoftLayer API:
import SoftLayer.API
from SoftLayer import VSManager, utils
# For nice debug output:
from pprint import pprint as pp
import sys

number_vm=2

client = SoftLayer.Client(
    username = "SL307608",
    api_key = "cced2db7761428c6080546172ccb8214ce129acf2e5e845ac7bba0c4ad4edcfa" )

def createservers(hostname, domain,processor,memory,image_id,location):
	## we build the order_template needed
	parameters = {
		"hostname": hostname, 
		"domain": domain, 
		"startCpus": processor, 
		"maxMemory": memory, 
		"hourlyBillingFlag": "true", 
	    "blockDeviceTemplateGroup": { 
								"globalIdentifier": image_id 
		},  
	    'localDiskFlag' : False,         
	    'datacenter' : {'name': location},
	    'privateNetworkOnlyFlag' : False,    
	    "networkComponents": [ 
        { 
            "maxSpeed": 1000
        } 
    ]  
	    } 
	result = client['Virtual_Guest'].createObject(parameters)
	return result

for i in range(number_vm):
	createservers("madrid_lab_"+str(i),"madridlab.com",1,1024,"1034197","ams01")