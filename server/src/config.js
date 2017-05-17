const configNamespace = 'backbone';
const configRelation = 'useCase';
const mongoUrl = process.env.MONGO_HOST ? 
    'mongodb://'+process.env.MONGO_HOST+':27017/' :
    'mongodb://127.0.0.1:27017/';


let config = {
    configNamespace,
    configRelation,
    mongoUrl
};
module.exports = Object.assign(config, {setOverrides});

// mainly for testing.
function setOverrides(overrides){
    config = Object.assign(config, overrides);  
}
