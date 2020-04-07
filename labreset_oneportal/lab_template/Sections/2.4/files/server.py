## Needed Libraries
import os
from flask import Flask, session, render_template, request
from flask.ext.session import Session
import sys, json
sys.path.append ("softlayer")
sys.path.append ("openstack")
sys.path.append ("docker")
import cci, vm, containers ##import the files with the functions

## Code for the session
app = Flask(__name__)
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

## Set the root folder
@app.route('/' )
def root():
  return render_template("index.html", title = 'Dashboard')

@app.route('/list_vms', methods = ['GET'])
def list_vms():
  list_servers=[]
  
  ## get the cci from SL
  cci_softlayer=cci.getCCIs()

  ## get the VMs from BlueBox
  servers_os=vm.getServers()

  ## get the containers from Docker
  containers_bm=containers.list_containers()

  ## Create a list with all of them
  for server in servers_os:
    list_servers.append({'id':server['id'],'hostname':server['hostname'],'provider':'BlueBox',"status":server['status']})

  for container in containers_bm:
    list_servers.append({'id':container['id'],'hostname':container['name'],"status":container['status'],'provider':'Docker BM'})

  for server in cci_softlayer:
    list_servers.append({'id':server['id'],'hostname':server['fullyQualifiedDomainName'],'provider':'SoftLayer', "status": server['status']['name']})
    ## Return the list in JSON format

  return json.dumps(list_servers)

@app.route('/getServerDetails', methods = ['POST'])
def get_server_details():
	id = request.json['id']
	provider = request.json['provider']
	## based on the provider we get details from one or another
	if str(provider)=="SoftLayer":
		details = cci.getCCI(id)
	if str(provider)=="BlueBox":
		details= vm.getVM(id)
	return json.dumps(details)
  
@app.route('/pause', methods = ['POST'])
def pause():
	id = request.json['id']
	provider = request.json['provider']
	if provider == "SoftLayer":
		result=cci.pause(id)
	if provider=="BlueBox":
		result=vm.pause(id)
	return json.dumps(result)
@app.route('/play', methods = ['POST'])
def play():
	id = request.json['id']
	provider = request.json['provider']
	if provider == "SoftLayer":
		result=cci.play(id)
	if provider=="BlueBox":
		result=vm.play(id)
	return json.dumps(result)
@app.route('/delete', methods = ['POST'])
def delete():
	id = request.json['id']
	provider = request.json['provider']
	if provider == "SoftLayer":
		result=cci.delete(id)
	if provider=="BlueBox":
		result=vm.delete(id)
	return json.dumps(result)
@app.route('/reboot', methods = ['POST'])
def reboot():
	id = request.json['id']
	provider = request.json['provider']
	if provider == "SoftLayer":
		result=cci.reboot(id)
	if provider=="BlueBox":
		result=vm.reboot(id)
	return json.dumps(result)
    
## Where the server will listen, and debug options
port = os.getenv('PORT', '5000')

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=int(port), threaded=True, debug=True)
