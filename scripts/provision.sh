#!/bin/bash


set `uname -mrs`
os=""
[ "$1" == "Linux" ] && os="LINUX"
[ -s /System/Library/CoreServices/SystemVersion.plist ] && os="MAC"
[ "$os" == "" ] && exit

if [ "$os" == "MAC" ] 
 then 
  pk="`pip show OctoPrint-ZERO|fgrep Location|cut -f2- -d ':'|tr -d ' '`"
  brew install avrdude haproxy 
  sudo cp  octoprint_ZERO/__init__.py.mac > "$pk/octoprint_ZERO/__init__.py"
fi

if [ "$os" == "LINUX" ] 
 then 
 sudo rm .octoprint/logs/*
  pk="`find ~ -name octoprint_ZERO|sed /'octoprint_ZERO'/s///g`"
  sudo apt-get -y install avrdude haproxy 
sudo chmod a+w /etc/rsyslog.conf
  [ "`fgrep 'configurator/' /etc/rsyslog.conf|fgrep -v '#'`" == "" ] && sudo echo -e '$ModLoad imudp\n$UDPServerRun 514\n$template act,"%msg:139:500%"\n:msg, regex, "configurator/" ^/opt/ZERO/act.sh;act' >> /etc/rsyslog.conf;sudo rm /etc/rsyslog.d/*
sudo chmod a-w /etc/rsyslog.conf
  sudo cp /dev/null /dev/shm/update
fi

echo "$os $pk" 

sudo mkdir /opt/ZERO
sudo cp scripts/*.sh /opt/ZERO
sudo ln -sfdv /dev/shm/update /opt/ZERO/update
sudo ln -sfdv /opt/ZERO/update "$pk/octoprint_ZERO/static/update"
sudo ln -sfdv /dev/shm /opt/ZERO/fw


if [ "`fgrep '/marlinkimbra/' /etc/haproxy/haproxy.cfg`" == "" ]
 then
  sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bak
  [ "$os" == "MAC" ] && sudo cp scripts/haproxy.cfg.mac /etc/haproxy/haproxy.cfg 
  [ "$os" == "LINUX" ] && sudo cp scripts/haproxy.cfg.linux  /etc/haproxy/haproxy.cfg 
fi

sudo chown -R "$USER" /opt/ZERO/
echo " "
echo "Installation complete !!!!"
echo "    ======>   REBOOT THE SYSTEM MANUALLY!!!!   <======"


