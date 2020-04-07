#!/bin/bash
code_dir=$1
lab_dir=$2
section=$3

## SoftLayer Credentials
# Get existing usernames and passwords if they exist
if [[ -e ${lab_dir}/softlayer/credentials.py ]]
then
  # Try source, as python declare is compatible with bash declare
  source ${lab_dir}/softlayer/credentials.py
else
  # If not, prompt for them and create the file
  while [[ -z $user ]]
  do
    echo -n "Input softlayer username: "
    read -e user
  done

  while [[ -z $apikey ]]
  do
    echo -n "Input softlayer password: "
    read -e apikey
  done

  echo "user='${user}'" > ${lab_dir}/softlayer/credentials.py
  echo "apikey='${apikey}'" >> ${lab_dir}/softlayer/credentials.py
fi



## OpenStack Credentials
# Get existing usernames and passwords if they exist
if [[ -e ${lab_dir}/openstack/credentials.py ]]
then
  # Try source, as python declare is compatible with bash declare
  source ${lab_dir}/openstack/credentials.py
else
  # If not, prompt for them and create the file
  while [[ -z $username ]]
  do
    echo -n "Input openstack username: "
    read -e username
  done

  while [[ -z $password ]]
  do
    echo -n "Input openstack password: "
    read -e password
  done

  while [[ -z $tenant_name ]]
  do
    echo -n "Input openstack tenant name: "
    read -e tenant_name
  done

  echo "username='${username}'" > ${lab_dir}/openstack/credentials.py
  echo "password='${password}'" >> ${lab_dir}/openstack/credentials.py
  echo "tenant_name='${tenant_name}'" >> ${lab_dir}/openstack/credentials.py
fi

## Bluemix Credentials
# Get existing usernames and passwords if they exist
if [[ -e ${lab_dir}/docker/credentials.py ]]
then
  # Try source, as python declare is compatible with bash declare
  source ${lab_dir}/docker/credentials.py
else
  # login to bluemix, prompting the user for login details
  echo "Please log in to bluemix to get container details"
  echo ""
  echo -n "Email> "
  read bmuser
  echo -n "Password> "
  read bmpassword
  cf login -u ${bmuser} -p ${bmpassword}
  
  # Get the organisation GUID. Right now grabs first result
  #org=$(cf curl /v2/organizations | jq -r ".resources[].metadata.guid" | head -1)
  
  # Get the space GUID, right now just grab the first result
  #guid=$(cf curl /v2/organizations/$org/spaces | jq -r ".resources[].metadata.guid" | head -1)
  
  guid=$(cf space $(cf spaces | tail -n 1) --guid)
  
  echo "user='${bmuser}'" > ${lab_dir}/docker/credentials.py
  echo "passwd='${bmpassword}'" >> ${lab_dir}/docker/credentials.py
  echo "guid='${guid}'" >> ${lab_dir}/docker/credentials.py
  
fi
  

