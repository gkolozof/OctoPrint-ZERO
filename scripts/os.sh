#!/bin/sh

pk="`python -m site --user-site`"
cd "$pk/octoprint_ZERO/static/"
sudo rm update
sudo ln -sf /opt/ZERO/update update

pk=`python -m site|fgrep 'local/lib/python'|fgrep "/site-packages'"|tr -d " ,'"`
cd "$pk/octoprint_ZERO/static/"
sudo rm update
sudo ln -sf /opt/ZERO/update update

set `uname -mrs`
if [ -s /System/Library/CoreServices/SystemVersion.plist ]
	then
	 sudo /opt/ZERO/fw
     sudo mkdir /opt/ZERO/fw
	 sudo cp /dev/null /opt/ZERO/update
	 sudo killall -9 sudo haproxy tail
	 sudo haproxy -D -f /etc/haproxy/haproxy.cfg  &
     sudo tail -f "/Users/apple/Library/Application Support/OctoPrint/logs/octoprint.log"|while read ln; do echo $ln > /tmp/log;[ "`echo $ln|fgrep configurator/`" ] && /opt/ZERO/act.sh "$ln"; done &
     
fi

