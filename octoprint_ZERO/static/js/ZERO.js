
$.ajaxSetup({ headers: { "cache-control": "no-cache" }, cache: false });

$.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: up }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });
     up="clsOn";

$(function() {

    function ZEROViewModel(parameters) {

        var self = this;
        self.settings = undefined;
        self.allSettings = parameters[0];
        self.loginState = parameters[1];
        self.printerState = parameters[2];
        self.confirmation = undefined;

        self.onAfterBinding = function() {
            self.confirmation = $("#ZERO");
            self.settings = self.allSettings.settings.plugins.ZERO;
			self.confirmation.modal("show");
        };

        self.click = function ()
		   {
            if(self.avrOK) self.avrOK()
			if(self.install_avr) self.install_avr()
           };

        self.avrOK = function () { $.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: "avrOK" }), contentType: "application/json; charset=UTF-8", success: function (data,status) { } }); self.confirmation.modal("hide"); };


        self.install_avr = function () { $.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: "install_avr" }), contentType: "application/json; charset=UTF-8", success: function (data,status) { } }); self.confirmation.modal("hide"); };

        self.visibleTest = function () {
            return  self.loginState.isUser()
        };


    }

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        ZEROViewModel,

        ["settingsViewModel","loginStateViewModel","printerStateViewModel"],

        ["#navbar_plugin_ZERO"]
    ]);
});

var errhttp = new XMLHttpRequest();
var xmlhttp = new XMLHttpRequest();
var old = "";
var cn=" ";
var up="clsOn";

var stop = setInterval(function()
 {
  if (up)
	{ 
	 $.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: up }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });
	 up="upOn";
	}
//alert("OK");

  xmlhttp.open("GET","/plugin/ZERO/static/update",false);
  xmlhttp.setRequestHeader("Cache-Control", "max-age=0");
  xmlhttp.setRequestHeader("Cache-Control", "0");
  xmlhttp.setRequestHeader("Cache-Control", "no-cache");
  xmlhttp.send();

  if (xmlhttp.responseText.indexOf("Disconnecting 3D PRINTER") != -1 && cn) 
   {
    xmlhttp.open("POST", "api/connection", true);
    xmlhttp.setRequestHeader("Acceptr","application/json");
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.setRequestHeader("X-HTTP-Method-Override","PUT");
    xmlhttp.setRequestHeader("X-Api-Key",OctoPrint.options.apikey);
    xmlhttp.send('{"command": "disconnect"}');
    cn="";
   }

  if (xmlhttp.responseText && old != xmlhttp.responseText)
   {
    document.getElementById('countdown').innerHTML=xmlhttp.responseText;
    old = xmlhttp.responseText;

    if (xmlhttp.responseText.indexOf("COMPILATION FIRMWARE SUCCESSFUL") != -1) p="";
 
    if (xmlhttp.responseText.indexOf("port ,") != -1) 
     { 
      errhttp.open("GET","/plugin/ZERO/static/error-"+lng+".html",false);
      errhttp.setRequestHeader("Cache-Control", "max-age=0");
      errhttp.setRequestHeader("Cache-Control", "0");
      errhttp.setRequestHeader("Cache-Control", "no-cache");
      errhttp.send();
      document.getElementById('countdown').innerHTML=xmlhttp.responseText+errhttp.responseText;
      clearInterval(stop);
     }
   

    if (xmlhttp.responseText.indexOf("can't open device") != -1) 
     { 
      errhttp.open("GET","/plugin/ZERO/static/error-"+lng+".html",false);
      errhttp.setRequestHeader("Cache-Control", "max-age=0");
      errhttp.setRequestHeader("Cache-Control", "0");
      errhttp.setRequestHeader("Cache-Control", "no-cache");
      errhttp.send();
      document.getElementById('countdown').innerHTML=xmlhttp.responseText+errhttp.responseText;
      clearInterval(stop);
     }
   
    if (xmlhttp.responseText.indexOf("WARNING!!!! Proccess faults") != -1) 
     { 
      errhttp.open("GET","/plugin/ZERO/static/error-"+lng+".html",false);
      errhttp.setRequestHeader("Cache-Control", "max-age=0");
      errhttp.setRequestHeader("Cache-Control", "0");
      errhttp.setRequestHeader("Cache-Control", "no-cache");
      errhttp.send();
      document.getElementById('countdown').innerHTML=xmlhttp.responseText+errhttp.responseText;
      clearInterval(stop);
     }

    if (xmlhttp.responseText.indexOf("Process Successful") != -1)
     {
      errhttp.open("GET","/plugin/ZERO/static/success-"+lng+".html",false);
      errhttp.setRequestHeader("Cache-Control", "max-age=0");
      errhttp.setRequestHeader("Cache-Control", "0");
      errhttp.setRequestHeader("Cache-Control", "no-cache");
      errhttp.send();
      document.getElementById('countdown').innerHTML=xmlhttp.responseText+errhttp.responseText;
      //clearInterval(stop);
     }
    }
 }, 1000);

$.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: up }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });
     up="clsOn";

