#!/bin/bash 
sleep 120
/etc/init.d/rsyslog restart
/etc/init.d/haproxy restart
