/* 
    Контроллер сделки. Контролирует вход и выход.
*/

module.exports = class {

    #_is_destoyed = false;
    #_is_init = false;
    #_is_init_started = false;
    #_is_init_finished = false;
    #_parent = null;
    #_options = null;
    #_on_destroy = null;

    constructor(parent, on_destroy)
    {
        this.#_parent = parent;
        this.#_on_destroy = on_destroy;

        /*
        this.#_options = {
            type,
            enter_price,
            target_price,
            volume,
            prefix
        };


        
        this.#_parent.parent().dataTransmitter().request('order', 'POST', {
            symbol: "XBTUSD",
            side: (this.#_options.type == 'short' ? 'Sell' : 'Buy'),
            orderQty: Number(10),
            price: Number(11000),
            clOrdID: this.#_options.prefix + this.#_options.type + '_' + Date.now() + '_' + Math.round(Math.random() * 1000000),
            ordType: "Limit" 
        })
        .then((result) => {
            //console.log(result);
        });
        */

    }

    init(id, type, enter_price, target_price, volume)
    {
        if (this.#_is_init == false)
        {
            this.#_is_init = true;

            this.#_options = {
                id,
                status: 0,
                type,
                enter_price,
                target_price,
                volume,
                enter_order_id : id + '_enter_' + Date.now() + '_' + Math.round(Math.random() * 1000000),
                target_order_id : id + '_target_' + Date.now() + '_' + Math.round(Math.random() * 1000000),
                enter_order_status : 0,
                target_order_status : 0,
            }
        }
    }

    startInit()
    {
        return new Promise((resolve, reject) =>
        {
            if (this.#_is_init_started)
            {
                reject(new Error(`Трейд ${this.#_options.id} уже начал инициализацию`));
            }
            else
            {
                this.#_is_init_started = true;

                global.db.mysql().query(`DELETE from bots_trades WHERE bot_id = ? AND session_id = ? AND trade_id = ?`,
                [
                    this.#_parent.parent().options().id,
                    this.#_parent.parent().options().session_id,
                    this.#_options.id,
                ],
                (error, results, fields) =>
                {
                    if (!error)
                    {
                        global.db.mysql().query(`INSERT INTO bots_trades (bot_id, session_id, trade_id, status, type, enter_price, target_price, volume, enter_order_id, target_order_id, enter_order_status, target_order_status) VALUES (?)`,
                        [[
                            this.#_parent.parent().options().id,
                            this.#_parent.parent().options().session_id,
                            this.#_options.id,
                            this.#_options.status,
                            this.#_options.type,
                            this.#_options.enter_price,
                            this.#_options.target_price,
                            this.#_options.volume,
                            this.#_options.enter_order_id,
                            this.#_options.target_order_id,
                            this.#_options.enter_order_status,
                            this.#_options.target_order_status,
                        ]],
                        (error, results, fields) =>
                        {
                            if (!error)
                            {
                                this.createStartOrder()
                                .then(()=>
                                {
                                    this.#_is_init_finished = true;

                                    if (this.#_is_destoyed == false)
                                    {
                                        console.log(this.#_options);
                                    }

                                    resolve();
                                })
                                .catch(() => {
                                    reject();
                                });
                            }
                            else
                            {
                                reject(new Error(`Трейд ${this.#_options.id}, ошибка при вставке записи`));
                            }
                        });
                    }
                    else
                    {
                        reject(new Error(`Трейд ${this.#_options.id}, ошибка при очистке старых записей`));
                    }
                });

                /*
                setTimeout(()=> {
                    this.#_is_init_finished = true;

                    if (this.#_is_destoyed == false)
                    {
                        console.log(this.#_options);
                    }

                    resolve();
                }, 3000);
                */

            }
        });
    }

    
    options()
    {
        return this.#_options;
    }

    isInitStarted()
    {
        return this.#_is_init_started;
    }

    isInitFinished()
    {
        return this.#_is_init_finished;
    }

    createStartOrder()
    {
        return new Promise((resolve, reject) =>
        {
            if (this.#_options.enter_order_status == 0)
            {
                resolve();
            }
            else
            {
                reject();
            }
        });
    }


    destroy()
    {
        this.#_is_destoyed = true;
        this.#_on_destroy(this);
    }

};