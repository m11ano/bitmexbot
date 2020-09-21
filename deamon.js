var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


global.config = require('./config.js');

const dbModel = require('./includes/db.js');
const botsControllerModel = require('./includes/botsController.js');

global.botsController = new botsControllerModel();

global.db = new dbModel(global.config.db);
global.db.connect()
.then(() =>
{
    global.botsController.init();
})
.catch((e) =>
{
    //console.log(e);
});

setInterval(() => {
    if (global.botsController.is_init)
    {
        global.botsController.pingAll();
    }
}, 5000);


app.all('/set_command/', (req, res) => {

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if (ip.substr(0, 7) == "::ffff:") {
		ip = ip.substr(7)
	}
	if (ip != '127.0.0.1')
	{
		res.send('ERROR ACCESS');
		return;
	}
    res.send('OK');
    
    if (typeof req.body.action == 'string')
    {
        if (req.body.action == 'update_bot_profile' && typeof req.body.bot_id == 'string')
        {
            global.botsController.restart(req.body.bot_id);
        }
    }
});

http.listen(3010, function() {
	console.log('Открыт порт 3010 для прослушки');
});