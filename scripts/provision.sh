#!/bin/bash

pk="`python -m site --user-site`"
set `uname -mrs`
os=""
[ "$1" == "Linux" ] && os="LINUX"
[ -s /System/Library/CoreServices/SystemVersion.plist ] && os="MAC"
[ "$os" == "" ] && exit
echo $pk
echo $os

sudo mkdir /opt/ZERO
sudo cp scripts/os.sh /opt/ZERO
sudo cp scripts/act.sh /opt/ZERO

#sudo mkdir "$pk""/octoprint_ZERO/"
#sudo mkdir "$pk""/octoprint_ZERO/static/"
#sudo chown -R "$USER" "$pk""/octoprint_ZERO/"

sudo ln -sf /opt/ZERO/update "$pk/octoprint_ZERO/static/update"
sudo ln -sdv /dev/shm /opt/ZERO/fw
sudo ln -sdv /dev/shm/update /opt/ZERO/update

[ "$os" == "LINUX" ] && sudo apt-get -y install avrdude haproxy &
[ "$os" == "MAC" ] && brew install avrdude haproxy &

[ -s /etc/haproxy ] || sudo mkdir /etc/haproxy

if [ "$os" == "LINUX" ]  && [ "`fgrep 'configurator/' /etc/rsyslog.conf|fgrep -v '#'`" == "" ] 
 then
     sudo chmod a+xrw /etc/rsyslog.conf
	 sudo echo -e '$template act,"%msg:139:500%"\n:msg, regex, "configurator/" ^/opt/ZERO/act.sh;act' >> /etc/rsyslog.conf
     sudo chmod ug-xrw /etc/rsyslog.conf
	 sudo /etc/init.d/rsyslog restart
fi

[ -s /etc/haproxy/haproxy.cfg ] || sudo cp /dev/null /etc/haproxy/haproxy.cfg

sudo chmod a+xrw /etc/haproxy/haproxy.cfg
if [ "`fgrep '/marlinkimbra/' /etc/haproxy/haproxy.cfg`" == "" ]
	then
sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bak
[ "$os" == "MAC" ] && sudo cp scripts/haproxy.cfg.mac /etc/haproxy/haproxy.cfg 
[ "$os" == "LINUX" ] && sudo cp scripts/haproxy.cfg.linux /etc/haproxy/haproxy.cfg 
sudo /etc/init.d/haproxy restart
fi



sudo chown -R "$USER" "$pk""/octoprint_ZERO/" /opt/ZERO/
sudo chmod a+xr /opt/ZERO/*.sh
sudo chmod a+xrw /opt/ZERO/update


