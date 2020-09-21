document.process = {

  start : function()
  {
    var jsondata = Object.fromEntries(new FormData(document.getElementById('settings_form')));

    var xmlhttp = new XMLHttpRequest();
    var theUrl = "/json-handler";
    xmlhttp.open("POST", 'index.php?secret='+document.secret_seed+'&bot_id='+document.bot_id+'&mode=save&action=start');
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onreadystatechange = function()
    { 
      document.location.reload();
    };

    xmlhttp.send(JSON.stringify(jsondata));

  },

  stop : function() {
    
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "/json-handler";
    xmlhttp.open("POST", 'index.php?secret='+document.secret_seed+'&bot_id='+document.bot_id+'&mode=save&action=stop');
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onreadystatechange = function()
    { 
      document.location.reload();
    };

    xmlhttp.send(JSON.stringify({}));
  }

};
