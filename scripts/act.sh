#!/bin/bash
[ "`ps ax|fgrep '/bin/bash /opt/ZERO/act.sh'|fgrep -v grep|wc -l`" -gt "2" ] && exit
echo "<br>" > /opt/ZERO/update
fw="`echo $*|grep -oP '/configurator\K.*(?= )'`"
[ "`echo \"$fw\"|fgrep MK4duo`" ] || exit
echo "<pre class='ui-pnotify ui-pnotify-shadow' aria-live='assertive'  style='width:800px;height: 400px;overflow: scroll; background-size: 46%,46%;  background-color: #083142; background-image: url(/plugin/ZERO/static/loading.gif);  color:#ffffcf; background-repeat: no-repeat; background-attachment: fixed;background-position: 52% 29%; ' >" > /opt/ZERO/update
com="`ls /dev/ttyACM* /dev/ttyUSB*|head -n 1`"
echo "Disconnecting 3D PRINTER from port $com, Compiling Arduino MEGA2560 & compatible Wait!!!" >> /opt/ZERO/update
wget "http://178.62.202.237/0/?url=$fw" -O /opt/ZERO/fw/MK4duo.ino.hex
[ -s  /opt/ZERO/fw/MK4duo.ino.hex ] || (echo Firmware not found;echo 'WARNING!!!! Proccess faults'  >> /opt/ZERO/update;sleep 2;exit)
killall -9 avrdude
nohup avrdude  -patmega2560 -cwiring  -P$com  -b115200 -D -Uflash:w:/opt/ZERO/fw/MK4duo.ino.hex:i 2>> /opt/ZERO/update 
crc=`tail -n 11 /opt/ZERO/update|grep -o -P '(?<=MK4duo.ino.hex contains).*(?=byte)'`
chk=`tail -n 11 /opt/ZERO/update|grep -o -P '(?<=avrdude:).*(?=bytes of flash verified)'`
if [ "$crc" != "$chk" ]
	then echo 'WARNING!!!! Proccess faults'  >> /opt/ZERO/update
  	else echo -n "Process Successful!!!!" >> /opt/ZERO/update
fi
sleep 2
