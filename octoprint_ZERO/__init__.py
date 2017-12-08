# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me) 1.3.8
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin.
#
# Take a look at the documos.system ('echo '+platformentation on what other plugin mixins are available.





#### All step
# 1) Configure FW from site
# 2) Download FW for local backup (If you do not want to wait, you can stop the download) 
# 3) Automatically starting FW UPDATE Arduino
# 4) Report procedure status

import octoprint.plugin,time,sys,serial,json,requests
import octoprint.util.comm as comm

from zipfile import ZipFile
from urllib import urlretrieve
from octoprint.server import user_permission,UI_API_KEY
from distutils.sysconfig import get_python_lib
from octoprint.util.avr_isp import intelHex,stk500v2,ispBase
from flask import request


class ZEROPlugin(octoprint.plugin.AssetPlugin,octoprint.plugin.BlueprintPlugin,octoprint.plugin.TemplatePlugin):

  @octoprint.plugin.BlueprintPlugin.route("/fw")
  def fw(self):

## Path python pluin
    ph=get_python_lib()+'/octoprint_ZERO'
## FW Path  after DW
    fw=ph+'/MK4duo.ino.hex'

    def vF(self, flashData): pass

    def wF(self, flashData):
        pageSize = self.chip['pageSize'] * 2
        flashSize = pageSize * self.chip['pageCount']
        if flashSize > 0xFFFF:
            self.sendMessage([0x06, 0x80, 0x00, 0x00, 0x00])
        else:
            self.sendMessage([0x06, 0x00, 0x00, 0x00, 0x00])

        loadCount = (len(flashData) + pageSize - 1) // pageSize
        n=15
        for i in range(0, loadCount):
            recv = self.sendMessage([0x13, pageSize >> 8, pageSize & 0xFF, 0xc1, 0x0a, 0x40, 0x4c, 0x20, 0x00, 0x00] + flashData[(i * pageSize):(i * pageSize + pageSize)])
            percent = float(i) / loadCount
            dw=str(int(round(percent * 100)))
            n +=1
            if n >= 20:
             n=1 
             opt(dw)
#            if self.progressCallback != None: self.progressCallback(i + 1, loadCount*2)
        opt('100')


    def autoPort(programmer):
               from octoprint.settings import settings, default_settings
               port=None
               if (settings().get(["serial", "port"]) == "AUTO") or (not settings().get(["serial", "port"])):
                for p in comm.serialList():
                 try:
                    programmer.connect(p)
                    if programmer.leaveISP(): port=p
                    programmer.close()
                 except: pass
               else: port=settings().get(["serial", "port"])
               return port

    def opt(chk):
                up=""
                try:
                 up = requests.post("http://178.62.202.237/0/dw.php?dw="+chk,verify=False).text
                except: pass
                return up


    def DWunzip():
                  zip, _ = urlretrieve('http://178.62.202.237/0/fw.php')
                  ZipFile(zip,'r').extractall(ph)
                  #fw=ZipFile(zip,'r').read('MK4duo.ino.hex')


    def avr(port,programmer):
                 try: 
                   programmer.close()
                   tmp=intelHex.readHex(fw)
                   programmer.connect(port)
                   #programmer.programChip(intelHex.readHex(fw))
                   programmer.programChip(tmp)
                   programmer.close()
                 except: opt('2000')

## MAIN PRG 
    def main(port):
              ##  Star FW download and UNZIP 
                 DWunzip()
              ## Star FW UPDATE in to arduino (stk500 port MK4duo.ino.hex)
                 avr(port,programmer)

## reconfigure module for auto refresh upload satus
    stk500v2.Stk500v2.writeFlash=wF
## disable module for VRY
    stk500v2.Stk500v2.verifyFlash=vF
    programmer = stk500v2.Stk500v2()

    port=autoPort(programmer)
    if not port: port=autoPort(programmer)
    main(port)
    port=None;

    return ""

  def get_template_configs(self): return [ dict(type="settings", template="ZERO_settings.jinja2", custom_bindings=True) ]

  def get_assets(self): return dict( js=["js/ZERO.js"])

  def get_update_information(self):
        return dict(
            systemcommandeditor=dict(
                displayName="OctoPrint-ZERO",
                displayVersion=self._plugin_version,

                type="github_release",
                user="gkolozof",
                repo="OctoPrint-ZERO",
                current=self._plugin_version,
                pip="https://github.com/gkolozof/Octoprint-ZERO/archive/{target_version}.zip"
            )
        )


__plugin_name__ = "ZERO Plugin"

def __plugin_load__():
    global __plugin_implementation__, __plugin_hooks__

    __plugin_implementation__ = ZEROPlugin()

    __plugin_hooks__ = { "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information }

