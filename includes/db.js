const mysql = require('mysql');

module.exports = class {

    #_mysql = null;
    #is_connected = false;
    #timeout = 0;
    #config = {};

    #_queries_buffer = [];

    constructor(config)
    {
        this.#config = config;
    }

    connect()
    {
        return new Promise((resolve, reject) => {

            if (this.#is_connected)
            {
                resolve();
            }
            else
            {
                this.connectToMysql(resolve, reject);
            }
        });
    }

    connectToMysql(resolve, reject)
    {
        console.log('DB try to connect...');

        this.#_mysql = mysql.createConnection(this.#config);
        this.#_mysql.connect((err) =>
        {
            if (err)
            {
                console.log('DB can\'t connect');

                this.#is_connected = false;
                if (this.#timeout == 0)
                {
                    this.#timeout = setTimeout(() => {
                        this.#timeout = 0;
                        this.connectToMysql(resolve, reject);
                    }, 500);
                }
                reject(err);
            }
            else
            {
                this.#_mysql.on('error', (err) =>
                {
                    console.log('DB connection closed');

                    this.#is_connected = false;
                    if (this.#timeout == 0)
                    {
                        this.#timeout = setTimeout(() => {
                            this.#timeout = 0;
                            this.connectToMysql(resolve, reject);
                        }, 500);
                    }
                });

                this.#is_connected = true;
                console.log('DB connected');

                this.execBuffer();

                resolve();
            }
        });
    }

    mysql()
    {
        if (this.#is_connected)
        {
            return this.#_mysql;
        }
        else
        {
            return {
                query : (...args)=> {
                    this.#_queries_buffer.push(args);
                }
            }
        }
    }

    execBuffer()
    {
        this.#_queries_buffer.forEach((item, i) =>
        {
            this.#_queries_buffer.splice(i, 1);
            this.#_mysql.query(...item);
        });
    }
};