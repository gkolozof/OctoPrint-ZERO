#!/bin/bash

pk="`~/oprint/bin/pip show OctoPrint-ZERO|fgrep Location|cut -f2- -d ':'|tr -d ' '`"

set `uname -mrs`
os=""
[ "$1" == "Linux" ] && os="LINUX"
[ -s /System/Library/CoreServices/SystemVersion.plist ] && os="MAC"
[ "$os" == "" ] && exit
echo $pk
echo $os

sudo mkdir /opt/ZERO
sudo cp scripts/*.sh /opt/ZERO
sudo ln -sfdv /opt/ZERO/update "$pk/octoprint_ZERO/static/update"
sudo ln -sfdv /dev/shm /opt/ZERO/fw
sudo ln -sfdv /dev/shm/update /opt/ZERO/update

if [ "$os" == "MAC" ] 
 then 
  brew install avrdude haproxy 
  sudo cp  octoprint_ZERO/__init__.py.mac > "$pk/octoprint_ZERO/__init__.py"
fi

if [ "$os" == "LINUX" ] 
 then 
  sudo apt-get -y install avrdude haproxy 
  [ "`fgrep 'configurator/' /etc/rsyslog.conf|fgrep -v '#'`" == "" ] && echo -e '$template act,"%msg:139:500%"\n:msg, regex, "configurator/" ^/opt/ZERO/act.sh;act' >> /etc/rsyslog.conf
fi

if [ "`fgrep '/marlinkimbra/' /etc/haproxy/haproxy.cfg`" == "" ]
 then
  sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bak
  [ "$os" == "MAC" ] && sudo cp scripts/haproxy.cfg.mac /etc/haproxy/haproxy.cfg 
  [ "$os" == "LINUX" ] && sudo cat scripts/haproxy.cfg.linux > /etc/haproxy/haproxy.cfg 
fi

sudo chown -R "$USER" /opt/ZERO/
echo " "
echo "Installation complete !!!!"
echo "    ======>   REBOOT THE SYSTEM MANUALLY!!!!   <======"


