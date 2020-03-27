#!/bin/sh
/usr/bin/protoc api.proto --go_out=. --js_out=import_style=commonjs,binary:. -I=.