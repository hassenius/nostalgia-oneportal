import requests
from pprint import pprint as pp

# Load the user credentials
execfile('docker/credentials.py')

def auth_token_get(user, passwd):
  ## auth urlurl = 'http://login.ng.bluemix.net/UAALoginServerWAR/oauth/token'
  ## type of auth and the credentials
  body="grant_type=password&username="+user+"&password="+passwd
  ## the post request
  auth=requests.post(url,params=body, headers={ 'authorization': 'Basic Y2Y6', 'accept': 'application/json', 'content-type' : 'application/x-www-form-urlencoded' } )
  ## we return it in JSON format
  return auth.json()['access_token']
  
def auth_token_get(user, passwd):
  ## auth urlurl = 'http://login.ng.bluemix.net/UAALoginServerWAR/oauth/token'
  ## type of auth and the credentials
  body="grant_type=password&username="+user+"&password="+passwd
  ## the post request
  auth=requests.post(url,params=body, headers={ 'authorization': 'Basic Y2Y6', 'accept':'application/json', 'content-type' : 'application/x-www-form-urlencoded' } )
  ## we return it in JSON format
  return auth.json()['access_token']
  
def list_containers():
  ## get the auth token
  auth_token=auth_token_get(user,passwd)
  ## url to get the list
  url = 'https://containers-api.ng.bluemix.net/v3/containers/json'
  ## request for the list
  containers_list=requests.get(url, headers={"Accept": "application/json","X-Auth-Token": auth_token, "X-Auth-Project-Id": guid} )
  containers=[]
  ## read the list, and create a JSON
  for container in containers_list.json():
    containers.append({'id':container['Id'],'name':container['Name'], 'status':container['Status']})

  ## Return the list in JSON format
  return containers
  
