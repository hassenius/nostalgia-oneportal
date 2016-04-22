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

def pause(id):
	result = client['Virtual_Guest'].pause(int(id))
	return result

pp(pause(17586715))