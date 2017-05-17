const useCaseRepository = require('./repository/useCaseRepository');
module.exports = {
    get,
    remove,
    add
};

const cache = {};
function get(useCaseName) {
    if (cache.hasOwnProperty(useCaseName)){
        return Promise.resolve(cache[useCaseName]);
    } else {
        return useCaseRepository.get(useCaseName).then(result=>{
            cache[useCaseName] = result;
        });
    }
}
function remove(useCaseName){
    delete cache[useCaseName];
}

function add(useCase){
    cache[useCase.title] = useCase;
}