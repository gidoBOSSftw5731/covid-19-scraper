#!/bin/sh

api=$@


datafile="/tmp/arcgisdata"

wget "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson" -O $datafile -q

arcgisdata=`cat ${datafile}` 

#curl -X POST -H "Content-Type:multipart/form-data" -F "data=@${datafile}" ${api}

echo "${arcgisdata}" | curl -X POST -H "Content-Type:application/octet-stream" -d @- ${api}