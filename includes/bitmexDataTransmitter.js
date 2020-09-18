const WebSocket = require('ws');
const crypto = require('crypto');
const fetch = require('node-fetch');

module.exports = class {

    #_websocket = null;
    #_is_connected = false;
    #_profile = null;
    #_events = {
        message : ()=>{},
        close : ()=>{},
    };

    constructor(profile)
    {
        this.#_profile = profile;
    }

    on(event, handler)
    {
        this.#_events[event] = handler;
    }

    websocket()
    {
        return this.#_websocket;
    }

    isConnected()
    {
        return this.#_is_connected;
    }

    connect()
    {
        return new Promise((resolve, reject) => {
            if (this.#_is_connected)
            {
                resolve();
            }
            else
            {
                this.connectToWS().then(()=> {
                    resolve();
                }).catch((e) =>
                {
                    reject(e);
                });
            }
        });
    }

    connectToWS()
    {
        return new Promise((resolve, reject) => {

            if (this.#_is_connected)
            {
                resolve();
            }
            else
            {
                this.#_websocket = new WebSocket(`wss://${this.#_profile.server}/realtime`);
                this.#_websocket.on('open', () =>
                {
                    const expires = Math.round(new Date().getTime() / 1000) + 60;
                    let sig = crypto.createHmac('sha256', this.#_profile.api_key_secret).update('GET/realtime' + expires).digest('hex');
                    this.#_websocket.send(JSON.stringify({"op": "authKeyExpires", "args": [this.#_profile.api_key_id, expires, sig]}), () =>
                    {
                        //
                    });
                });

                this.#_websocket.on('message', (message) =>
                {
                    message = JSON.parse(message);
                    if (this.#_is_connected == false && typeof message.request != 'undefined' && typeof message.request.op != 'undefined' && typeof message.success != 'undefined' && message.request.op == 'authKeyExpires' && message.success)
                    {
                        this.#_is_connected = true;
                        resolve();
                    }
                    else
                    {
                        this.#_events.message(message);
                    }
                });

                this.#_websocket.on('close', () =>
                {
                    this.#_is_connected = false;
                    this.#_events.close();
                });

            }

        });
    }

    request(req_url, method = 'GET', data = {})
    {
        data = JSON.stringify(data);

        const endpoint = '/api/v1/' + req_url;
		const expires = Math.round(new Date().getTime() / 1000) + 60;
		const signature = crypto.createHmac('sha256', this.#_profile.api_key_secret).update(method + endpoint + expires + data).digest('hex');

		const headers = {
			'content-type': 'application/json',
			'accept': 'application/json',
			'api-expires': expires,
			'api-key': this.#_profile.api_key_id,
			'api-signature': signature,
		};

		const requestOptions = {
			method: method,
			headers,
			body: data
		};
  
		const url = 'https://' + this.#_profile.server + endpoint;

		return fetch(url, requestOptions).then(res => res.json());
    }
};