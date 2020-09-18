/* 
    Контроллер сделки. Контролирует вход и выход.
*/

module.exports = class {

    #_parent = null;
    status = 'new';
    #_options = null;

    constructor(parent, type, enter_price, target_price, volume, prefix)
    {
        this.#_parent = parent;
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

    }

};