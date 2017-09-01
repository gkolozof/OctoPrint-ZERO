#!/bin/sh

sudo rm /opt/ZERO/update
sudo cp /dev/null /opt/ZERO/update

sudo /opt/ZERO/fw
sudo mkdir /opt/ZERO/fw
sudo cp /dev/null /opt/ZERO/update
sudo killall -9 sudo haproxy tail
sudo haproxy -D -f /etc/haproxy/haproxy.cfg  &
sudo tail -f "/Users/apple/Library/Application Support/OctoPrint/logs/octoprint.log"|while read ln; do echo $ln > /tmp/log;[ "`echo $ln|fgrep configurator/`" ] && /opt/ZERO/act.sh "$ln"; done &
     

