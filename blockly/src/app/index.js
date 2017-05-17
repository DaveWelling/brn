(function(){

    mdc.deployUrl = 'http://localhost:10437/api/backbone/useCase';
    mdc.startup.initializeBlockly();

    function generateJsonFromBlocks(event) {
        if (event.type === Blockly.Events.UI) return;
        let codeView = document.getElementById('generatedCode');
        
        if (mdc.workspace.getTopBlocks().length === 0) {
            codeView.value = 'No blocks.  Add a block.';
            return;
        }
        
        let code = mdc.services.deploy.getMetaDataFromBlocks(toastr.warning);
        if (code.useCaseBlock) {
            let json;
            try {
                json = JSON.parse(code.result);
            } catch (ex) {
                toastr.error('See console log for more details', 'There was a problem generating your metadata.');
                console.error('Failed to parse JSON: ', code);
            }
            codeView.value = JSON.stringify(json, null, '    ');
        } else {
            codeView.value = 'Use case block must exist.';
        }
    }
    mdc.workspace.addChangeListener(generateJsonFromBlocks);

})();