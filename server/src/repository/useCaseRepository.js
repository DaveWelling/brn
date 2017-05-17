// This overwrites existing metadata with the same release number
// (instead of default repository behavior of patching for changes)
const repositoryInit = require('../repository/index').init;
const ObjectId = require('mongodb').ObjectID;
const config = require('../config');

module.exports = {
    post, get, patch
};



// Find existing use case metadata wit the same title
// and overwrite if the release number has not changed.
function post(newUseCase) {
    return repositoryInit({title: 'backbone'}, {title: 'useCase'}).then(repo =>
        repo.getByTitle(newUseCase.title).then(oldUseCase => {
            if (oldUseCase && oldUseCase.release === newUseCase.release) {
                // replace existing
                return repo.remove(oldUseCase._id).then(() =>
                    repo.insert(newUseCase)
                );
            } else {
                // new use case or new release of old one.
                return repo.insert(newUseCase);
            }
        })
    );
}


function get(useCaseName) {
    return repositoryInit({title: config.configNamespace}, {title: config.configRelation}).then(repo =>
        repo.getByTitle(useCaseName)
    );
}

function patch() {
    throw new Error('Not Implemented.');
}