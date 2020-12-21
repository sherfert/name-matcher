#!/bin/bash
trap 'kill $ID1; kill $ID2; exit' INT

neo4j/bin/neo4j console &
ID1=$!
cd api
npm start &
ID2=$!
cd ../client
npm start