
const useCase = require('../repository/useCaseRepository');
const useCaseConfig = require('../useCaseConfigs');
const Boom = require('boom');
const EJSON = require('mongodb-extended-json');
const deserialize = require('../../node_modules/mongodb-extended-json/lib/deserialize');
module.exports = {
    add
};

function add(server, config) {
    server.route({
        method: 'GET',
        path: `/${config.configNamespace}/${config.configRelation}/{appName}`,
        handler: function (request, reply) {
            return useCase.get(request.params.appName).then(result=>{
                if (!result) return reply(Boom.notFound(`${request.params.appName} not found.`));
                return reply(EJSON.stringify(result)).header('Content-Type', 'application/json');
            })
            
        }
    });

    server.route({
        method: 'post',
        path: `/${config.configNamespace}/${config.configRelation}`,
        config: {
            tags: ['api'],
            handler: function (request, reply) {
                const objPayload = deserialize(request.payload);
                return useCase.post(objPayload).then(function (itemResult) {
                    useCaseConfig.remove(objPayload.title);
                    useCaseConfig.add(objPayload);
                    return reply({_id: itemResult.insertedId.toHexString()}).code(201);
                }).catch(function (err) {
                    request.log(['error', 'api', 'useCase', 'insert'], err);
                    return reply(Boom.badImplementation(err));
                });
            },
            description: 'Insert ' + config.configRelation + '.'
        }
    });
}