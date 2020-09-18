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

    constructor(options)
    {
        this.#_id = options.id;
        this.#_options = options;
        this.#_data_transmitter = new bitmexDataTransmitterModel(this.#_options);

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
                global.botsController.restart(this.#_id);
            }, 1000);
        });

        this.#_data_transmitter.connect()
        .then(() =>
        {
            console.log('Бот #${this.#_id} создан и подключен');
            this.updatePingTime();
            this.#_trades_controller = new botTradesControllerModel(this);
            this.#_trades_controller_is_init = true;
        })
        .catch((e) =>
        {
            console.log('Error: ошибка при работе бота #${this.#_id} с WS', e);
        });

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
        if (this.#_trades_controller_is_init)
        {
            this.#_trades_controller.newMessage(message);
        }
    }

    //Пингануть WS
    ping()
    {
        if (this.#_data_transmitter.isConnected())
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
        console.log('Бот #${this.#_id} разрушен');
    }
};