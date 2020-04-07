#!/bin/bash
code_dir=$1
lab_dir=$2
section=$3

mkdir -p ${lab_dir}/templates
cp ${code_dir}/template/index.html ${lab_dir}/templates/
cp -r ${code_dir}/template/static ${lab_dir}/
