#!/home/pi/oprint/bin/python
import os
import sys

if os.path.isfile('/opt/ZERO/fw/lock'): sys.exit()
out=open('/opt/ZERO/fw/update','w')
out.write('<br>')
out.close()
fw=sys.argv[1]
if "MK4duo" not in fw: sys.exit()
fw=fw.split('/configurator/')[-1].split('.zip')[0] 
if not fw:sys.exit()
open('/opt/ZERO/fw/lock','w')
out=open('/opt/ZERO/fw/update','a')
out.write("<pre class='ui-pnotify ui-pnotify-shadow' aria-live='assertive'  style='width:800px;height: 400px;overflow: scroll; background-size: 46%,46%;  background-color: #083142; background-image: url(/plugin/ZERO/static/loading.gif);  color:#ffffcf; background-repeat: no-repeat; background-attachment: fixed;background-position: 52% 28%; ' >")

out.close()
out=open('/opt/ZERO/fw/update','a')
import glob

com=glob.glob("/dev/ttyUSB*") +glob.glob("/dev/ttyACM*") +glob.glob("/dev/tty.usbmodem*")
if com: out.write ("Disconnecting 3D PRINTER from port "+com[0]+", Compiling Arduino MEGA2560 & compatible Wait!!!")
else:
 out.write('WARNING!!!! Proccess faults PORT not fund')
 sys.exit()
out.close()

fw='http://178.62.202.237/0/?url=/'+fw+'.zip'
#fw='http://178.62.202.237/0/MK4duo.ino.hex.zip'


from zipfile import ZipFile
from urllib import urlretrieve
from tempfile import mktemp

zip, _ = urlretrieve(fw)
zipfile=ZipFile(zip,'r')
zipfile.extractall('/opt/ZERO/fw/')
zipfile.close()

os.popen ('(sleep 60;killall -9 avrdude) &')
os.popen ('nohup avrdude  -patmega2560 -cwiring  -P'+com[0]+'  -b115200 -D -Uflash:w:/opt/ZERO/fw/MK4duo.ino.hex:i 2>> /opt/ZERO/update')

data=open('/opt/ZERO/fw/update','r').read()
c0=data.split('MK4duo.ino.hex contains ')[-1].split(' bytes')[0]
c1=data.split('vrdude: ')[-1].split(' bytes')[0]
c2=data.split('writing flash (')[-1].split(' bytes')[0]

out=open('/opt/ZERO/fw/update','a')
if (c0==c1) and (c1==c2): out.write("Process Successful!!!!")
else: out.write('WARNING!!!! Proccess faults') 
out.close()
import time
time.sleep (2)
open('/opt/ZERO/fw/update','w').close()
os.remove ('/opt/ZERO/fw/lock')
print fw,com[0]
