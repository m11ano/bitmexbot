/* 
    Контроллер сделки. Контролирует вход и выход.
*/

module.exports = class {

    #_is_destoyed = false;
    #_is_init = false;
    #_is_init_started = false;
    #_is_init_finished = false;
    #_parent = null;
    status = 'new';
    #_options = null;

    constructor(parent, type, enter_price, target_price, volume, prefix)
    {
        this.#_parent = parent;

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
                type,
                enter_price,
                target_price,
                volume,
                enter_order_order_id : id + '_enter_' + Date.now() + '_' + Math.round(Math.random() * 1000000),
                target_price_order_id : id + '_target_' + Date.now() + '_' + Math.round(Math.random() * 1000000),
            }
        }
    }

    startInit()
    {
        return new Promise((resolve, reject) =>
        {
            if (this.#_is_init_started)
            {
                reject();
            }
            else
            {
                this.#_is_init_started = true;


                setTimeout(()=> {
                    this.#_is_init_finished = true;

                    if (this.#_is_destoyed == false)
                    {
                        console.log(this.#_options);
                    }

                    resolve();
                }, 3000);

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



    destroy()
    {
        this.#_is_destoyed = true;
    }

};