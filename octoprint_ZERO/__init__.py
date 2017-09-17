# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me) 1.3.8
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin.
#
# Take a look at the documentation on what other plugin mixins are available.

import octoprint.plugin,socket,json,logging
from octoprint.server import user_permission



class ZEROPlugin(octoprint.plugin.SettingsPlugin,
                            octoprint.plugin.AssetPlugin,
                            octoprint.plugin.TemplatePlugin,
                            octoprint.plugin.SimpleApiPlugin,
                            octoprint.plugin.StartupPlugin):

    def __init__(self):
        self._logger = logging.getLogger("octoprint.plugins.ZERO")
        self._ZERO_logger = logging.getLogger("octoprint.plugins.ZERO.debug")

    def get_settings_defaults(self): return dict( confirmationDialog = True)

    def on_after_startup(self):
        self._logger.info("ZERO loaded!")

    def get_template_configs(self):
        return [ dict(type="settings", custom_bindings=False) ]

    def get_api_commands(self):
        return dict(clsOn=[],upOn=[],install_avr=[],avrOK=[])

    def on_api_command(self, command, data):
        if not user_permission.can(): return make_response("Insufficient rights",403)
        import re,os
        from distutils.sysconfig import get_python_lib
        if command == 'avrOK':
          os.remove(get_python_lib()+'/octoprint_ZERO/templates/ZERO_navbar.jinja2')
        if command == 'install_avr':
         from sys import platform
         if "linux" in platform.lower():
          os.remove(get_python_lib()+'/octoprint_ZERO/templates/ZERO_navbar.jinja2')
          os.system('sudo apt -y install avrdude')
         elif platform.lower() == "darwin":
          os.remove(get_python_lib()+'/octoprint_ZERO/templates/ZERO_navbar.jinja2')
          os.system("brew install avrdude")
#        elif "win" in platform.lower():       FOR FUTURE INSTALL AVRDUDE FOR WIN???
        if command == 'clsOn':
         open(get_python_lib()+'/octoprint_ZERO/static/update','w').close()
        if command == 'upOn':
         import glob,urllib2
         from zipfile import ZipFile
         from urllib import urlretrieve
         pre="<pre class='ui-pnotify ui-pnotify-shadow' aria-live='assertive'  style='width:800px;height: 400px;overflow: scroll; background-size: 46%,46%;  background-color: #083142; background-image: url(/plugin/ZERO/static/img/loading.gif);  color:#ffffcf; background-repeat: no-repeat; background-attachment: fixed;background-position: 55% 47%;' >"

         up = urllib2.urlopen('http://178.62.202.237/0/up.php').read()
         if 'PLEASE STANDBY' in up: 
           out=open(get_python_lib()+'/octoprint_ZERO/static/update','w')
           out.write (pre+up+"\n")
           out.close()

         if 'FIRMWARE SUCCESSFUL' in up:
           out=open(get_python_lib()+'/octoprint_ZERO/static/update','w')
           out.write (pre+up+"\n")
           out.close()
           if 'Sketch uses ' in up: cfw=re.findall(r'Sketch uses (.*?) bytes',up)
           out=open(get_python_lib()+'/octoprint_ZERO/static/update','a')
           com=glob.glob('/dev/ttyUSB*') +glob.glob('/dev/ttyACM*') +glob.glob('/dev/tty.usbmodem*')
           if not com: out.write('WARNING!!!! Proccess faults PORT not found\n')
           else: out.write ('Disconnecting 3D PRINTER from port '+com[0]+' Firmware loading.....\n')
           out.close()
           zip, _ = urlretrieve('http://178.62.202.237/0/fw.php')
           zipfile=ZipFile(zip,'r')
           zipfile.extractall('/tmp/')
           zipfile.close()
           if com:
            os.system ('/usr/bin/avrdude -patmega2560 -cwiring  -P'+com[0]+' -b115200 -D -Uflash:w:/tmp/MK4duo.ino.hex:i 2>> '+get_python_lib()+'/octoprint_ZERO/static/update')
            data=open(get_python_lib()+'/octoprint_ZERO/static/update','r').read()
            c0=re.findall(r'writing flash \((.*?) bytes',data)
            c1=re.findall(r'MK4duo.ino.hex contains (.*?) bytes',data)
            c2=re.findall(r'avrdude: (.*?) bytes of flash written',data)
            c3=re.findall(r'avrdude: (.*?) bytes of flash verified',data)

            out=open(get_python_lib()+'/octoprint_ZERO/static/update','a')
            if (c0==c1) and (c1==c2) and (c2==c3) and (c3==cfw): out.write("Process Successful!!!!")
            else: out.write('WARNING!!!! Proccess faults')
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

##__plugin_name__ = "OctoPrint ZERO"
__plugin_name__ = "ZERO Plugin"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = ZEROPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }

