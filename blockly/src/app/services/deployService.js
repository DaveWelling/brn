(function(){    
    mdc.services.deploy.getMetaDataFromBlocks = function(problemDisplayCallback){
        let topBlocks = mdc.workspace.getTopBlocks();
        let useCaseBlock = topBlocks.find(function(block){
            return block.type === 'usecase';
        });
        if (!useCaseBlock) {
            problemDisplayCallback('Cannot deploy without a use case block','Add a use case.');
            return {status: 'fail', reason: 'A top level use case block must exist.'};
        }
         
        let metadata;
        try {
            mdc.services.deploy.errors = [];
            mdc.allConsumedBlockInstanceIds = [];
            metadata = Blockly.JavaScript.blockToCode(useCaseBlock);
        } catch (err){
            problemDisplayCallback(err);
            return {status: 'fail', reason: err};
        } 
        if (mdc.services.deploy.errors.length > 0){
            mdc.services.deploy.errors.forEach(error=>{
                problemDisplayCallback(error);
            });
            return {status: 'fail', reason: 'Errors parsing blocks.'};
        }
        return {status: 'success', result: metadata, useCaseBlock};
    };

    mdc.services.deploy.saveUseCase = function () {
        let metadata = mdc.services.deploy.getMetaDataFromBlocks(toastr.error);
        if (!metadata || metadata.status === 'fail') return;

        return fetch(mdc.deployUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: metadata.result
        }).then(function (response) {
            if (response.ok) {                
                toastr.success('Deploy succeeded.');
                return response.json().then(result=>{
                    metadata.useCaseBlock.data = result._id;
                });
            } else {
                return response.json().then(result => {                    
                    toastr.error(JSON.stringify(result), 'Deploy failed.');
                });
            }
        }).catch(function (err) {
            toastr.error(err.message ? err.message : err, 'Deploy failed.');
        });
    };

})();