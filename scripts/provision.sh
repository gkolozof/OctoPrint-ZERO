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
  pk="`find . -name octoprint_ZERO|sed /'octoprint_ZERO'/s///g`"
  #pk="`~/oprint/bin/pip show OctoPrint-ZERO|fgrep Location|cut -f2- -d ':'|tr -d ' '`"
  sudo apt-get -y install avrdude haproxy 
  [ "`fgrep 'configurator/' /etc/rsyslog.conf|fgrep -v '#'`" == "" ] && echo -e '$ModLoad imudp\n$UDPServerRun 514\n$template act,"%msg:139:500%"\n:msg, regex, "configurator/" ^/opt/ZERO/act.sh;act' >> /etc/rsyslog.conf
  sudo cp /dev/null /dev/shm/update
fi

echo "$os $pk" >> /tmp/pwd

sudo mkdir /opt/ZERO
sudo cp scripts/*.sh /opt/ZERO
sudo ln -sfdv /dev/shm/update /opt/ZERO/update
sudo ln -sfdv /opt/ZERO/update "$pk/octoprint_ZERO/static/update"
sudo ln -sfdv /dev/shm /opt/ZERO/fw


if [ "`fgrep '/marlinkimbra/' /etc/haproxy/haproxy.cfg`" == "" ]
 then
  sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bak
  [ "$os" == "MAC" ] && sudo cp scripts/haproxy.cfg.mac /etc/haproxy/haproxy.cfg 
  [ "$os" == "LINUX" ] && sudo cat scripts/haproxy.cfg.linux > /etc/haproxy/haproxy.cfg 
fi

usr="$USER"

sudo chown -R "$usr" /opt/ZERO/
echo " "
echo "Installation complete !!!!"
echo "    ======>   REBOOT THE SYSTEM MANUALLY!!!!   <======"


