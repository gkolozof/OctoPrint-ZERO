#!/bin/bash

pk="`python -c 'import sys;  print \" \n\".join(sys.path)'|fgrep 'packages '|grep 'local\/lib\/'|tail -n 1|tr -d ' '`"
set `uname -mrs`
os=""
[ "$1" == "Linux" ] && os="LINUX"
[ -s /System/Library/CoreServices/SystemVersion.plist ] && os="MAC"
[ "$os" == "" ] && exit
echo $pk
echo $os
sudo mkdir /opt/ZERO
sudo cp scripts/*.sh /opt/ZERO
sudo ln -sdv /opt/ZERO/update "$pk/octoprint_ZERO/static/update"
sudo ln -sdv /dev/shm /opt/ZERO/fw
sudo ln -sdv /dev/shm/update /opt/ZERO/update
[ "$os" == "MAC" ] && brew install avrdude haproxy &
[ -s /etc/haproxy ] || sudo mkdir /etc/haproxy
if [ "$os" == "LINUX" ] 
 then 
  sudo apt-get -y install avrdude haproxy &
  [ "`fgrep 'configurator/' /etc/rsyslog.conf|fgrep -v '#'`" == "" ] && echo -e '$template act,"%msg:139:500%"\n:msg, regex, "configurator/" ^/opt/ZERO/act.sh;act' >> /etc/rsyslog.conf
  sudo fgrep -v os octoprint_ZERO/__init__.py.bak > "$pk/octoprint_ZERO/__init__.py"
fi
#[ -s /etc/haproxy/haproxy.cfg ] || sudo cp /dev/null /etc/haproxy/haproxy.cfg
#sudo chmod a+xrw /etc/haproxy/haproxy.cfg
if [ "`fgrep '/marlinkimbra/' /etc/haproxy/haproxy.cfg`" == "" ]
 then
  sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bak
  [ "$os" == "MAC" ] && sudo cp scripts/haproxy.cfg.mac /etc/haproxy/haproxy.cfg 
  [ "$os" == "LINUX" ] && sudo cat scripts/haproxy.cfg.linux > /etc/haproxy/haproxy.cfg 
fi
sudo chown -R "$USER" "$pk/octoprint_ZERO/" /opt/ZERO/
sudo chmod a+xr /opt/ZERO/*.sh
## (sleep 60;sudo /etc/init.d/haproxy restart) 
## (sleep 60;sudo /etc/init.d/rsyslog restart)

