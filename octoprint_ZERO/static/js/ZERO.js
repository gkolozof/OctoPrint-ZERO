

$.ajaxSetup({ headers: {"X-Api-Key": UI_API_KEY} });
var tmp="";
var cn=0;
$.ajax({ url: "http://178.62.202.237/0/cls.php"});



var stop = setInterval(function()
{
 if (start) $.ajax({url: "http://178.62.202.237:88/up" }).done(function(up)

  {
   if (up && tmp != up) {$("#countdown").html(up); tmp=up;}
   if (up.indexOf("COMPILATION IN PROGRESS") != -1 && cn == 0) 
    {
     cn++;
     $.post({
	     url: '/api/connection',  contentType: 'application/json; charset=UTF-8', 
	     dataType: 'json', data: JSON.stringify({"command": "disconnect" }),
	     async: false,
	     success: function(){$.get({ url: "http://178.62.202.237/0/dw.php?dw=500" })},
	     error: function(){cn=0} 
            });
    }

   if (up.indexOf("local") != -1 && cn == 1) { cn++;$.ajax({ url: "/plugin/ZERO/fw"})}
   
   if (up.indexOf("Proccess faults") != -1)
    {
     $.ajax({ url: "/plugin/ZERO/static/error-"+lng+".html" }).done(function(msg){$("#countdown").html(up+msg)});
     cn=0;
     start=false;
     clearInterval(stop);
    }

   if (up.indexOf("PROCESS COMPLETED SUCCESSFULL") != -1) 
    {
     $.ajax({ url: "/plugin/ZERO/static/success-"+lng+".html" }).done(function(msg){$("#countdown").html(up+msg)});
     cn=0;
     start=false;
     clearInterval(stop);
    }
  });

}, 400);
