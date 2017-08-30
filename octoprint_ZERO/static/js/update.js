
/*
var lng = navigator.language||navigator.userLanguage;

if (lng != 'it') lng='en';
*/

 //   waitingDialog.show('Approximate time: 15 min.');

var errhttp = new XMLHttpRequest();
var xmlhttp = new XMLHttpRequest();
var old = "";
var cn="A";

var stop = setInterval(function()
 {

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
 //xmlhttp.setRequestHeader("X-Api-Key","1DA8C41E26664C0A85F7C6297C8F594C");
             //xmlhttp.setRequestHeader("X-Api-Key",self.api_key(response.apikey));
             // xmlhttp.setRequestHeader("X-Api-Key",api_key);
// OctoPrintClient.connection.connect("disconnect", opts);
   }

  if (xmlhttp.responseText && old != xmlhttp.responseText)
   {
    document.getElementById('countdown').innerHTML=xmlhttp.responseText;
    old = xmlhttp.responseText;
    window.scrollBy(0, 10000000);
   
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
      window.scrollBy(0, -10000000);
      document.getElementById('countdown').innerHTML=xmlhttp.responseText+errhttp.responseText;
      //clearInterval(stop);
     }
    }
 }, 1000);
