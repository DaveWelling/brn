'use strict';

const Hapi = require('hapi');

function init(logRoutes, overrideConfig) {
    const apiControllers = require('../../../src/controller/index');
    const server = new Hapi.Server();
    let resolve, reject;
    const promise = new Promise(function(res, rej) {resolve = res; reject = rej;});
    server.connection();

    server.register({
        // Serve REST API
            register: apiControllers,
            options: {
                overrideConfig
            }
        },{
            routes: {
                prefix: '/api'
            }
        }, (err) => {
            if (err) {
                reject(err);
            }

            if (logRoutes === true) {
                let routingTable = server.table();

                routingTable.forEach(function (connection) {

                    connection.table.forEach(table => {
                        //noinspection Eslint
                        console.log(`Path: ${table.path} | Verb: ${table.method}`);
                    });

                });
            }
            resolve(server);
        }
    );
    // Put this on here so you can start another new server if you like.
    server.init = init;
    return promise;
}

module.exports = init;
