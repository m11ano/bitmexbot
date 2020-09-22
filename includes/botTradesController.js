/* 
    Контроллер сделок по боту.
*/

const botTradeControllerModel = require('./botTradeController.js');

module.exports = class {

    #_is_destoyed = false;
    #_parent = null;
    #_options = null;
    #_data_transmitter = null;
    #_instrument = {
        last_price : 0
    };

    #_account = {
        amount : 0,
        availableMargin : 0
    };

    #_first_init_flags = {
        amount : false,
        last_price : false,
        available_margin : false,
    };

    #_first_init = false;

    #_session = {
        margin_levels : {
            long : [],
            short : [],
        }
    };

    #_trades = [];

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
        if (this.#_is_destoyed)
        {
            return false;
        }

        if (typeof message.table != 'undefined' && typeof message.data == 'object')
        {
            let need_print = true;

            //Баланс аккаунта
            if (message.table == 'margin' && typeof message.data[0].amount != 'undefined')
            {
                let old = this.#_account.amount;
                this.#_account.amount = message.data[0].amount;
                this.#onAmmountUpdated(this.#_account.amount, old);

                need_print = false;
            }
            if (message.table == 'margin' && typeof message.data[0].availableMargin != 'undefined')
            {
                let old = this.#_account.available_margin;
                this.#_account.available_margin = message.data[0].availableMargin;
                this.#onAvailableMarginUpdated(this.#_account.available_margin, old);

                need_print = false;
            }

            //Цена XBT
            if (message.table == 'trade' && typeof message.data[0].price != 'undefined')
            {
                let old = this.#_instrument.price;
                this.#_instrument.price = message.data[0].price;
                this.#onPriceUpdated(this.#_instrument.price, old);

                need_print = false;
            }

            if (need_print)
            {
                //console.log(message)
            }

            console.log(message)
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

                console.log(`Бот #${this.#_parent.options().id} получил первичные данные от биржи и БД и начинает работу`);

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

                //console.log(this.#_session.margin_levels);
            }
        }
    }

    //События

    #onAmmountUpdated = function(value, old)
    {
        console.log('Account amount: '+this.#_account.amount+' ');

        this.#_first_init_flags.amount = true;
        this.#firstInit();

    }

    #onAvailableMarginUpdated = function(value, old)
    {
        console.log('Account available margin amount: '+this.#_account.available_margin+' ');

        this.#_first_init_flags.available_margin = true;
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
                if (value >= v[1] - this.#_parent.options().price_reserve_value)
                {
                    if (this.getTradeById('main_ML_short_'+v[0]) === undefined)
                    {
                        let volume = this.mainCountTradeVolume(v[0], (v[1] - this.#_parent.options().price_modifier));
                        if (volume > 0)
                        {
                            this.createTrade('main_ML_short_'+v[0], 'short', (v[1] - this.#_parent.options().price_modifier), (this.#_parent.options().session_start_price + this.#_parent.options().price_modifier), volume);
                        }
                    }
                }
            });
        }
    }


    //Функции

    getAccountBalance()
    {
        return this.#_account.amount / 100000000;
    }

    getTradeById(id)
    {
        return this.#_trades.find((i) => {
            if (i.options().id == id)
            {
                return true;
            }
        });
    }

    //Функция создания трейда. На исполнение ставится в очередь

    createTrade(...args)
    {
        let id = args[0];
        if (this.getTradeById(id) === undefined)
        {
            let trade = new botTradeControllerModel(this);
            this.#_trades.push(trade);
            trade.init(...args);
            this.#processTradesInitQueue();
        }
    }

    mainCountTradeVolume(level, price)
    {
        let maxBalance = this.#_parent.options().max_amount * 100000000;
        let usingBalance = (this.#_account.amount > maxBalance ? maxBalance : this.#_account.amount) / 100000000;
        if (usingBalance > this.#_account.available_margin / 100000000)
        {
            usingBalance = this.#_account.available_margin / 100000000;
        }

        let volume = usingBalance * this.#_parent.options()['main_pos_cof_'+level];
        let count = Math.round(volume * price);

        return count;
    }

    //Приватные функции

    //Обработки очереди на трейды

    #processTradesInitQueue = () =>
    {
        for (let i in this.#_trades)
        {
            if (this.#_trades[i].isInitStarted() && this.#_trades[i].isInitFinished() == false)
            {
                break;
            }
            else if (this.#_trades[i].isInitStarted() == false && this.#_trades[i].isInitFinished() == false)
            {
                this.#_trades[i].startInit()
                .then(() => {
                    if (this.#_is_destoyed == false)
                    {
                        this.#processTradesInitQueue();
                    }
                });
                break;
            }
        }
    }
    
    #roundToHalf = function(value)
    {
        return Math.round(value / 0.5) * 0.5;
    }

    //остальное

    destroy()
    {
        this.#_is_destoyed = true;

        for (let i in this.#_trades)
        {
            this.#_trades[i].destroy();
        }
    }
};