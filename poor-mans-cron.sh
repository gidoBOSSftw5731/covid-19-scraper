#!/bin/sh

api=$@

datafile="/tmp/arcgisdata"

arcgisdata=`cat ${datafile} | base64` 

curl -X POST -H "Content-Type:text/plain" -o ${datafile} ${api}