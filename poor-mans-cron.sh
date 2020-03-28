#!/bin/sh

api=$@

datafile="/tmp/arcgisdata"

arcgisdata=`cat ${datafile} | base64` 

curl -X POST -F @${datafile} ${api}