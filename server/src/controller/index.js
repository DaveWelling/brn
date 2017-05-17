const config = require('../config');
const useCaseController = require('./useCaseController');
const genericController = require('./genericController');
module.exports = {
    register: register
};

register.attributes = {
    name: 'controller'
};

function register(server, options, next) {

    // Add the status route
    server.route({
        method: 'GET',
        path: '/status',
        handler: function (request, reply) {
            return reply('Server up.');
        }
    });
    
    // This is mainly used for injecting test configuration into the server
    let configToUse = Object.assign(config, options.overrideConfig);
    
    useCaseController.add(server, configToUse);
    genericController.add(server);    
    
    next();
}
