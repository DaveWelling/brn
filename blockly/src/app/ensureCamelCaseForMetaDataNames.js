mdc.ensureCamelCaseForMetaDataNames = function(){

    mdc.workspace.addChangeListener(function(event) {
        if (event.type === Blockly.Events.CHANGE) {
            let changedBlock = mdc.workspace.getBlockById(event.blockId);
            if (event.element === 'field' && event.name === 'propertyName') {
                updateWithValue(changedBlock, event.name, _.camelCase(event.newValue));
            }
            if (changedBlock.type === 'namespace' || changedBlock.type === 'relation') {
                if (event.element === 'field' && event.name === 'title') {
                    updateWithValue(changedBlock, event.name, _.camelCase(event.newValue));
                    const prettyNameField = changedBlock.getField('prettyName');
                    if (prettyNameField.getValue() === ''){
                        updateWithValue(changedBlock, 'prettyName', _.startCase(event.newValue));
                    }
                }
            }
        }
    });

    const updateWithValue = _.debounce(function(block, valueName, value) {
        let field = block.getField(valueName);
        field.setText(value);
    }, 750);
};