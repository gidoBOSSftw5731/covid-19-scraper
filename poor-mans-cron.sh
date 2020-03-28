#!/bin/sh

api=$@

datafile="/tmp/arcgisdata"

arcgisdata=`cat ${datafile} | base64` 

curl -X POST -H "Content-Type:multipart/form-data" -F "data=@${datafile}" ${api}