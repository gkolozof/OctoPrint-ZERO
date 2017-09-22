# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me) 1.3.8
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin.
#
# Take a look at the documos.system ('echo '+platformentation on what other plugin mixins are available.


import octoprint.plugin,socket,json,logging,platform,os,sys
from octoprint.server import user_permission
from octoprint.settings import settings, default_settings
from distutils.sysconfig import get_python_lib

if settings().get(["serial", "port"]):com=settings().get(["serial", "port"])
else: com=""


if "Windows" == platform.system(): 
 ph=get_python_lib()+'\\octoprint_ZERO'
 nav=ph+'\\templates\\ZERO_navbar.jinja2'
 update=ph+'\\static\\update'
 lock=ph+'\\avrdude.state.lock'
 avr=ph+'\\static\\bin\\avrdude'
 avrcfg=' -patmega2560 -cwiring  -P'+com+' -b115200 -D -Uflash:w:'+ph+'\\MK4duo.ino.hex:i'
 avrexec='start /b  cmd /c "'+avr+avrcfg+' 2>> '+update+' & del '+lock+'"'

else: 
 ph=get_python_lib()+'/octoprint_ZERO'
 nav=ph+'/templates/ZERO_navbar.jinja2'
 update=ph+'/static/update'
 lock=ph+'/avrdude.state.lock'
 avr='avrdude'
 avrcfg=' -patmega2560 -cwiring  -P'+com+' -b115200 -D -Uflash:w:'+ph+'/MK4duo.ino.hex:i'
 avrexec='('+avr+avrcfg+' 2>> '+update+';rm '+lock+') &' 

if os.path.exists(lock): os.remove(lock)
open(update,'w').close()

class ZEROPlugin(octoprint.plugin.SettingsPlugin,
                            octoprint.plugin.AssetPlugin,
                            octoprint.plugin.TemplatePlugin,
                            octoprint.plugin.SimpleApiPlugin,
                            octoprint.plugin.StartupPlugin):


    def __init__(self):
        self._logger = logging.getLogger("octoprint.plugins.ZERO")
        self._ZERO_logger = logging.getLogger("octoprint.plugins.ZERO.debug")
#  prova a toglierlo ^^^^

    def get_settings_defaults(self):
        return dict( confirmationDialog = True)

    def on_after_startup(self):
        self._logger.info("ZERO loaded!")
    def get_template_configs(self):
        return [ dict(type="settings", custom_bindings=False) ]


    def get_api_commands(self):
        return dict(clsOn=[],upOn=[],install_avr=[],avrOK=[],chkOn=[])

    def on_api_command(self, command, data):
        if not user_permission.can(): return make_response("Insufficient rights",403)
        import re
        if (command == 'chkOn') and (not os.path.exists(lock)):
         data=open(update,'r').read()
         cfw=re.findall(r'Sketch uses (.*?) bytes',data)
         c0=re.findall(r'writing flash \((.*?) bytes',data)
         c1=re.findall(r'MK4duo.ino.hex contains (.*?) bytes',data)
         c2=re.findall(r'avrdude: (.*?) bytes of flash written',data)
         c3=re.findall(r'avrdude: (.*?) bytes of flash verified',data)
         out=open(update,'a')
         if (c0==c1) and (c1==c2) and (c2==c3) and (c3==cfw): out.write("Process Successful!!!!")
         else: out.write('WARNING!!!! Proccess faults')
         out.close()
        if command == 'avrOK':
         os.remove(nav)
        if command == 'install_avr':
         if "linux" in platform.lower():
          os.remove(nav)
          os.system('sudo apt -y install avrdude')
         elif platform.lower() == "darwin":
          os.remove(nav)
          os.system("brew install avrdude")
         elif "Windows" == platform.system(): os.remove(nav)
        if command == 'clsOn':
         open(update,'w').close()
        if command == 'upOn':
         if not os.path.exists(lock):
          import glob,urllib2
          from zipfile import ZipFile
          from urllib import urlretrieve
          pre="<pre class='ui-pnotify ui-pnotify-shadow' aria-live='assertive'  style='width:800px;height: 400px;overflow: scroll; background-size: 75%,75%;  background-color: #083142; background-image: url(/plugin/ZERO/static/img/loading.gif);  color:#ffffcf; background-repeat: no-repeat; background-attachment: relative;background-position: center;' >"
          try:
            up = urllib2.urlopen('http://178.62.202.237/0/up.php',timeout=2).read()
            if 'PLEASE STANDBY' in up: 
             out=open(update,'w')
             out.write (pre+up+"\n")
             out.close()
            if 'FIRMWARE SUCCESSFUL' in up:
             out=open(update,'w')
             out.write (pre+up+"\n")
             out.close()
             out=open(update,'a')
             if not com: out.write('WARNING!!!! Proccess faults PORT not found\n')
             else: out.write ('Disconnecting 3D PRINTER from port '+com+' Firmware loading.....\n')
             out.close()
             zip, _ = urlretrieve('http://178.62.202.237/0/fw.php')
             zipfile=ZipFile(zip,'r')
             zipfile.extractall(ph)
             zipfile.close()
             if com:
              out=open(update,'a')
              out.write("Upload Firmware....")
              out.close()
              open(lock,'w').close()
              os.system (avrexec)
          except:
            out=open(get_python_lib()+'/octoprint_ZERO/static/update','w')
            out.write (pre+"Internet connection lost!!!\n")
            out.close()

    def get_assets(self): return dict( js=["js/ZERO.js"])

    def get_template_configs(self):
        return [ dict(type="settings", template="ZERO_settings.jinja2", custom_bindings=True) ]

    def get_update_information(self):
        return dict(
            systemcommandeditor=dict(
                displayName="OctoPrint-ZERO",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="gkolozof",
                repo="OctoPrint-ZERO",
                current=self._plugin_version,
                # update method: pip
                pip="https://github.com/gkolozof/Octoprint-ZERO/archive/{target_version}.zip"
            )
        )

__plugin_name__ = "ZERO Plugin"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = ZEROPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }

