/* 
    Модель бота.
*/

const bitmexDataTransmitterModel = require('./bitmexDataTransmitter.js');
const botTradesControllerModel = require('./botTradesController.js');

module.exports = class {

    #_id = null;
    #_options = null;
    #_data_transmitter = null;
    #_trades_controller = null;
    #_trades_controller_is_init = false;
    #_is_init = false;

    constructor(options)
    {
        this.#_id = options.id;
        this.#_options = options;

        this.#_data_transmitter = new bitmexDataTransmitterModel(this.#_options);

        this.init();
    }

    async init()
    {
        if (this.#_is_init == false)
        {
            this.#_is_init = true;

            if (this.#_options.session_init == 0)
            {
                await new Promise((resolve, reject) =>
                {
                    //resolve();
                    //Первичная инициализация бота после создания новой сессии

                    this.#_data_transmitter.request('order/all', 'DELETE', {})
                    .then((result) =>
                    {
                        this.#_data_transmitter.request('order/closePosition', 'POST', {
                            symbol: 'XBTUSD'
                        })
                        .then((result) => {
                            global.db.mysql().query(`UPDATE bots_profiles set session_init = 1 WHERE id = ?`, [this.#_id], (error, results, fields) => {
                                if (!error)
                                {
                                    console.log(`У бота #${this.#_id} удалены все позиции`);
                                    resolve();
                                }
                            });
                        });
                    });
                });
            }

            if (this.#_options.status == 0)
            {
                console.log(`Бот #${this.#_id} создан, но он отключен`);
            }
            else
            {
                console.log(`Бот #${this.#_id} создан`);

                this.#_data_transmitter.on('message', (data) =>
                {
                    if (typeof data != 'undefined')
                    {
                        this.#engineWSMessage(data);
                    }
                });

                this.#_data_transmitter.on('close', () =>
                {
                    setTimeout(() => {
                        if (this.#_options.status == 1)
                        {
                            global.botsController.restart(this.#_id);
                        }
                    }, 1000);
                });

                this.#_data_transmitter.connect()
                .then(() =>
                {
                    console.log(`Бот #${this.#_id} подключен к сети, сессия #${this.#_options.session_id}`);
                    this.updatePingTime();
                    this.#_trades_controller = new botTradesControllerModel(this);
                    this.#_trades_controller_is_init = true;
                })
                .catch((e) =>
                {
                    console.log(`Error: ошибка при подключении бота #${this.#_id} к WS`, e);
                });
            }
        }
    }

    id()
    {
        return this.#_id;
    }

    options()
    {
        return this.#_options;
    }

    dataTransmitter()
    {
        return this.#_data_transmitter;
    }

    //Обработка сообщения от WS
    #engineWSMessage = function(message)
    {
        if (this.#_trades_controller_is_init && this.#_options.status == 1)
        {
            this.#_trades_controller.newMessage(message);
        }
    }

    //Пингануть WS
    ping()
    {
        if (this.#_options !== null && this.#_options.status == 1 && this.#_data_transmitter.isConnected())
        {
            this.#_data_transmitter.websocket().ping();
            this.updatePingTime();
        }
    }

    //Запись последнего пинга в БД
    updatePingTime()
    {
        global.db.mysql().query(`UPDATE bots_profiles set last_ping_time = `+Math.round(new Date().getTime() / 1000)+` WHERE id = ${this.#_id}`);
    }

    destroy()
    {
        this.#_options.status = 0;
        if (this.#_data_transmitter !== null)
        {
            this.#_data_transmitter.destroy();
        }

        if (this.#_trades_controller !== null)
        {
            this.#_trades_controller.destroy();
        }

        console.log(`Бот #${this.#_id}, сессия #${this.#_options.session_id}, разрушен`);
    }
};