


$.ajaxSetup({ headers: {"X-Api-Key": UI_API_KEY} });
var cmd="cls";
var tmp="";
var cn=0;
//     $.ajax({ url: '/api/connection', crossDomain: true, contentType: 'application/json; charset=UTF-8', method: 'POST', dataType: 'json', data: JSON.stringify({"command": "disconnect" })});

var stop = setInterval(function()
{
	//$.ajax({ url: "/plugin/ZERO/fw"})

 if (start) $.ajax({ url: "http://178.62.202.237:88/"+cmd }).done(function(up)
  {
   if (up == tmp && cmd == 'up')  up="";
   if (up)
     {
      $("#countdown").html(up);
      tmp=up;
     }

   if (cmd == 'cls' ) {up=""; cmd="up";}
   if (up.indexOf("STANDBY") != -1 && cn == 0) 
    {
     cn++;
     $.post({ async: false, url: '/api/connection',  contentType: 'application/json; charset=UTF-8',  dataType: 'json', data: JSON.stringify({"command": "disconnect" }), error: function(){cn=0} });
    }

   if (up.indexOf("local") != -1 && cn == 1) { cn++;$.ajax({ url: "/plugin/ZERO/fw"})}
   
   if (up.indexOf("Proccess faults") != -1)
    {
     $.ajax({ url: "/plugin/ZERO/static/error-"+lng+".html" }).done(function(msg){$("#countdown").html(up+msg)});
     cn=0;
     cmd="cls";
     start=false;
     clearInterval(stop);
    }

   if (up.indexOf("PPROCESS COMPLETED SUCCESSFULL") != -1) 
    {
     $.ajax({ url: "/plugin/ZERO/static/success-"+lng+".html" }).done(function(msg){$("#countdown").html(up+msg)});
     cn=0;
     cmd="cls";
     start=false;
     clearInterval(stop);
    }
  });

}, 600);
