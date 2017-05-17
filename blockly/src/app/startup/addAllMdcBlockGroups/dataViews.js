(function(){

    class DataView extends mdc.BaseMdcBlockGroup {
        
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let dropdownNamespace = blocklyBlock.getFieldValue('namespace');
            let dropdownRelation = blocklyBlock.getFieldValue('relation');
            let textPropertyname = blocklyBlock.getFieldValue('propertyName');

            code.namespace = dropdownNamespace;
            code.relation = dropdownRelation;
            code.propertyName = textPropertyname;

            return JSON.stringify(code);
        }

        addToBlocksCustom(color, blocklyBlock, hNodeType) {
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Namespace:')
                .appendField(new Blockly.FieldDropdown(mdc.getNamespaces), 'namespace');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Relation:')
                .appendField(new Blockly.FieldDropdown(mdc.getRelations), 'relation');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Property Name:')
                .appendField(new Blockly.FieldTextInput(''), 'propertyName');
        }
    }
    mdc.generation.toolbox['dataView'] = DataView;

})();