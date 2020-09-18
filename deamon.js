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