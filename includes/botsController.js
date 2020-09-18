/* 
    Контроллер ботов.
    Один аккаунт и ключ апи - один бот.
    Сделано с целью поддержки ботов на нескольких аккаунтах.
*/

const botControllerModel = require('./botController.js');

module.exports = class {

    is_init = false;
    bots = [];

    constructor()
    {
        
    }

    //Инициализация ботов
    init()
    {
        this.is_init = true;

        global.db.mysql().query(`SELECT * from bots_profiles`, (err, result, fields) =>
        {
            if (!err)
            {
                result.forEach((row) => {
                    this.bots.push(new botControllerModel(JSON.parse(JSON.stringify(row))));
                });
            }
        }); 
    }

    //Перезапустить бота
    restart(id)
    {
        this.bots.forEach((v, i) => {
            if (v.id() == id)
            {
                v.destroy();
                this.bots.splice(i, 1);
            }
        });

        global.db.mysql().query(`SELECT * from bots_profiles WHERE id = '${id}'`, (err, result, fields) =>
        {
            if (!err)
            {
                if (result.length > 0)
                {
                    this.bots.push(new botControllerModel(JSON.parse(JSON.stringify(result[0]))));
                }
            }
        });
    }

    //Заставить всех ботов пингануть сервер битмекса для стабильного коннекта
    pingAll()
    {
        this.bots.forEach((v, i) => {
            v.ping();
        });
    }
};