#!/bin/bash

rm -r /home/fischly/webserver/public/*
mv /home/fischly/webserver/www.tar /home/fischly/webserver/public/www.tar

cd /home/fischly/webserver/public/

#unzip www.zip
tar -zxvf www.tar

rm www.tar
