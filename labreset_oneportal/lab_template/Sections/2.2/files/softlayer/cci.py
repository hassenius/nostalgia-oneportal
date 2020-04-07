import SoftLayer
from pprint import pprint as pp
# Load the user credentials
execfile('softlayer/credentials.py')
client = SoftLayer.Client(username=user, api_key=apikey)

def getCCIs():
  ##Mask to get the right data that we will use
  object_mask = 'id,fullyQualifiedDomainName,status'
  result = client['Account'].getVirtualGuests(mask=object_mask)
  return result
  
