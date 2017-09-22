
$.ajaxSetup({ headers: { "cache-control": "no-cache" }, cache: false });

$.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: 'clsOn' }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });

$(function() {

    function ZEROViewModel(parameters) {

        var self = this;
        self.allSettings = parameters[0];
//        self.loginState = parameters[1];
//        self.confirmation = undefined;

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

//        ["settingsViewModel","loginStateViewModel","printerStateViewModel"],
    OCTOPRINT_VIEWMODELS.push([ ZEROViewModel, ["settingsViewModel"], ["#navbar_plugin_ZERO"] ]);
});

$.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: 'clsOn' }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });

function rld()
 {
      errhttp.open("GET","/plugin/ZERO/static/error-"+lng+".html",false);
      errhttp.setRequestHeader("Cache-Control", "max-age=0");
      errhttp.setRequestHeader("Cache-Control", "0");
      errhttp.setRequestHeader("Cache-Control", "no-cache");
      errhttp.send();
      document.getElementById('countdown').innerHTML=xmlhttp.responseText+errhttp.responseText;
      $.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: 'clsOn' }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });
      clearInterval(stop);
 }

var errhttp = new XMLHttpRequest();
var xmlhttp = new XMLHttpRequest();
var old = "";
var cn=" ";
var up="clsOn";
var chk=""

var stop = setInterval(function()
 {
  if (up)
	{ 
	 $.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: up }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });
	 up="upOn";
	}

  xmlhttp.open("GET","/plugin/ZERO/static/update",false);
  xmlhttp.setRequestHeader("Cache-Control", "max-age=0");
  xmlhttp.setRequestHeader("Cache-Control", "0");
  xmlhttp.setRequestHeader("Cache-Control", "no-cache");
  xmlhttp.send();

  if (xmlhttp.responseText.indexOf("avrdude") != -1 && chk) $.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: 'chkOn' }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });
     
  if (xmlhttp.responseText.indexOf("Upload Firmware") != -1) chk="ON";

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

    if (xmlhttp.responseText.indexOf("Internet connection lost") != -1) rld(); 

    if (xmlhttp.responseText.indexOf("PORT not found") != -1) rld(); 
   
    if (xmlhttp.responseText.indexOf("can't open device") != -1) rld();
   
    if (xmlhttp.responseText.indexOf("Proccess faults") != -1) rld(); 

    if (xmlhttp.responseText.indexOf("COMPILATION FIRMWARE SUCCESSFUL") != -1) up="";

    if (xmlhttp.responseText.indexOf("Process Successful") != -1) 
	 {
	  errhttp.open("GET","/plugin/ZERO/static/success-"+lng+".html",false);
      errhttp.setRequestHeader("Cache-Control", "max-age=0");
      errhttp.setRequestHeader("Cache-Control", "0");
      errhttp.setRequestHeader("Cache-Control", "no-cache");
      errhttp.send();
      document.getElementById('countdown').innerHTML=xmlhttp.responseText+errhttp.responseText;
      clearInterval(stop);
     }
    }
 }, 1000);

$.ajax({ url: API_BASEURL+"plugin/ZERO", type: "POST", dataType: "json", data: JSON.stringify({ command: 'clsOn' }), contentType: "application/json; charset=UTF-8", success: function (data,status) {} });

