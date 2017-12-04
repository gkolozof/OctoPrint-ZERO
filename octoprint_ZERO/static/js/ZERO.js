
/*
 lng=navigator.language||navigator.userLanguage;
 if (lng != 'it') lng='en';
msg='<object type="text/html" data="/plugin/ZERO/static/int-'+lng+'.html" width=100% height=100% frameborder="0" scrolling="no"></object>';
MK='<iframe id=iframe src="http://178.62.202.237:5000/marlinkimbra/configurator/v4_3_2/firmware_configurator.php?lingua='+lng+'" frameborder="0" scrolling="yes" allowfullscreen class="modal-header" style="left:0px;top:-2%;width:100%;height:100%;position: fixed; display: block;"></iframe>';

*/

$.ajaxSetup({ headers: {"X-Api-Key": UI_API_KEY} });
alert("KEY: "+UI_API_KEY);
var cmd="cls";
var tmp="";
var start=false;

function err()
{
 $.ajax({ url: "/plugin/ZERO/static/error-"+lng+".html" }).done(function(msg){$("#countdown").html(up+msg)});clearInterval(stop);
 clearInterval(stop);
 start=false;
}

var stop = setInterval(function()
{
 if (start) $.ajax({ url: "http://178.62.202.237:88/"+cmd }).done(function(up)
  {
     if (up == tmp && up && cmd == 'up')  up="";
     if (up) {$("#countdown").html(up);tmp=up;}
     if (cmd == 'cls' ) {up=""; cmd="up";}
     if (up.indexOf("STANDBY") != -1&& up.indexOf("UpLoad") == -1) 
       { 
        $.ajax({ url: "/api/connection", data: JSON.stringify({ "command": "disconnect" })});
        $.ajax({ url: "/plugin/ZERO/fw?cmd=ready"});
       }
     if (up.indexOf("local") != -1 && up.indexOf("UpLoad") == -1) $.ajax({ url: "/plugin/ZERO/fw?cmd=start"});
     if (up.indexOf("Internet connection lost") != -1) err();
     if (up.indexOf("Method Not Allowed") != -1) err();
     if (up.indexOf("Serial port failed") != -1) err();
     if (up.indexOf("can't open device") != -1) err();
     if (up.indexOf("Proccess faults") != -1) err();
     if (up.indexOf("PPROCESS COMPLETED SUCCESSFULLY") != -1) {$.ajax({ url: "/plugin/ZERO/static/success-"+lng+".html" }).done(function(msg){$("#countdown").html(up+msg)});start=false;clearInterval(stop);}
  });

}, 200);
