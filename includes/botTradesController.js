/* 
    Контроллер сделок по боту.
*/

const botTradeControllerModel = require('./botTradeController.js');

module.exports = class {

    #_parent = null;
    #_options = null;
    #_data_transmitter = null;
    #_instrument = {
        last_price : 0
    };

    #_account = {
        amount : 0
    };

    #_first_init_flags = {
        amount : false,
        last_price : false,
    };

    #_first_init = false;

    #_session = {
        margin_levels : {
            long : [],
            short : [],
        }
    };

    #_orders_storage = {};

    constructor(parent)
    {
        this.#_parent = parent;

        this.#_parent.dataTransmitter().websocket().send(JSON.stringify({"op": "subscribe", "args": ["margin", "trade:XBTUSD", "order"]}));

    }

    parent() {
        return this.#_parent;
    }

    getAccountInfo()
    {
        return this.#_account;
    }

    //Обработка сообщений
    newMessage(message)
    {
        if (typeof message.table != 'undefined' && typeof message.data == 'object')
        {
            //Баланс аккаунта
            if (message.table == 'margin' && typeof message.data[0].amount != 'undefined')
            {
                let old = this.#_account.amount;
                this.#_account.amount = message.data[0].amount;
                this.#onAmmountUpdated(this.#_account.amount, old);
            }

            //Цена XBT
            else if (message.table == 'trade' && typeof message.data[0].price != 'undefined')
            {
                let old = this.#_instrument.price;
                this.#_instrument.price = message.data[0].price;
                this.#onPriceUpdated(this.#_instrument.price, old);
            }

            else
            {
                console.log(message)
            }
        }
        else
        {
            console.log(message)
        }
        
    }

    //Инициализация когда получены ВСЕ первичные данные
    #firstInit = function()
    {
        if (this.#_first_init == false)
        {
            let all_ready = true;
            for (let i in this.#_first_init_flags)
            {
                if (this.#_first_init_flags[i] == false)
                {
                    all_ready = false;
                }
            }

            if (all_ready)
            {
                this.#_first_init = true;

                console.log('Бот #${this.#_id} получил первичные данные от биржи и БД и начинает работу');

                //Считаем маржинальные уровни по актуальной сессии

                this.#_session.margin_levels.long.push(['x100', this.#_parent.options().session_start_price - this.#roundToHalf(this.#_parent.options().session_start_price * 0.0048)]);
                this.#_session.margin_levels.long.push(['x50', this.#_parent.options().session_start_price - this.#roundToHalf(this.#_parent.options().session_start_price * 0.01455)]);
                this.#_session.margin_levels.long.push(['x25', this.#_parent.options().session_start_price - this.#roundToHalf(this.#_parent.options().session_start_price * 0.0337)]);
                this.#_session.margin_levels.long.push(['x10', this.#_parent.options().session_start_price - this.#roundToHalf(this.#_parent.options().session_start_price * 0.08592)]);
                this.#_session.margin_levels.long.push(['x5', this.#_parent.options().session_start_price - this.#roundToHalf(this.#_parent.options().session_start_price * 0.16282)]);
                this.#_session.margin_levels.long.push(['x3', this.#_parent.options().session_start_price - this.#roundToHalf(this.#_parent.options().session_start_price * 0.246985)]);
                this.#_session.margin_levels.long.push(['x2', this.#_parent.options().session_start_price - this.#roundToHalf(this.#_parent.options().session_start_price * 0.3311)]);

                this.#_session.margin_levels.short.push(['x100', this.#_parent.options().session_start_price + this.#roundToHalf(this.#_parent.options().session_start_price * 0.005)]);
                this.#_session.margin_levels.short.push(['x50', this.#_parent.options().session_start_price + this.#roundToHalf(this.#_parent.options().session_start_price * 0.0152)]);
                this.#_session.margin_levels.short.push(['x25', this.#_parent.options().session_start_price + this.#roundToHalf(this.#_parent.options().session_start_price * 0.036265)]);
                this.#_session.margin_levels.short.push(['x10', this.#_parent.options().session_start_price + this.#roundToHalf(this.#_parent.options().session_start_price * 0.10497)]);
                this.#_session.margin_levels.short.push(['x5', this.#_parent.options().session_start_price + this.#roundToHalf(this.#_parent.options().session_start_price * 0.242235)]);
                this.#_session.margin_levels.short.push(['x3', this.#_parent.options().session_start_price + this.#roundToHalf(this.#_parent.options().session_start_price * 0.488095)]);
                this.#_session.margin_levels.short.push(['x2', this.#_parent.options().session_start_price + this.#roundToHalf(this.#_parent.options().session_start_price * 0.98)]);

                console.log(this.#_session.margin_levels);
            }
        }
    }

    //События

    #onAmmountUpdated = function(value, old)
    {
        console.log('Account amount: '+this.getAccountBalance()+' XBT');

        this.#_first_init_flags.amount = true;
        this.#firstInit();

    }

    #onPriceUpdated = function(value, old)
    {
        console.log('XBT last price: '+value);

        this.#_first_init_flags.last_price = true;
        this.#firstInit();

        //Закладываем логику работы основной части бота

        //Если цена больше контрольной точки, создаем объекты шортовых сделок, если они не созданы. Наоборот с лонгами

        if (value > this.#_parent.options().session_start_price)
        {
            this.#_session.margin_levels.short.forEach((v, i) =>
            {

                /*
                if (v[1] === null || v[1].status == 'executed')
                {
                    if (value >= v[2] - this.#_parent.options().price_reserve_value)
                    {
                        console.log(`Создаем объект short сделки для плеча ${v[0]}`);

                        this.#_session.margin_levels.short[i][1] = new botTradeControllerModel(this, 'short', v[2], this.#_parent.options().session_start_price, 100, 'main_');
                    }
                }
                */
            });
        }
    }


    //Функции

    getAccountBalance()
    {
        return this.#_account.amount / 100000000;
    }

    //Приватные функции
    
    #roundToHalf = function(value)
    {
        return Math.round(value / 0.5) * 0.5;
    }
};