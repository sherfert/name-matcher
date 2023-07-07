#!/bin/bash
trap 'kill $ID1; kill $ID2; exit' INT

source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk use java 11.0.16.1-tem

neo4j/bin/neo4j console &
ID1=$!
cd api
npm start &
ID2=$!
cd ../client
npm start