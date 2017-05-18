(function(){

    class ActionElement extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let dropdownButtonStyle = blocklyBlock.getFieldValue('buttonStyle');
            let dropdownForAction = blocklyBlock.getFieldValue('forAction');
            let dropdownNamespace = blocklyBlock.getFieldValue('namespace');
            let dropdownRelation = blocklyBlock.getFieldValue('relation');
            let customAction =  `${dropdownForAction.toUpperCase()}_${dropdownNamespace.toUpperCase()}_${dropdownRelation.toUpperCase()}`;

            code.customAction = customAction;
            code.forAction = dropdownForAction.toLowerCase();
            code.namespace = dropdownNamespace.toLowerCase();
            code.relation = dropdownRelation.toLowerCase();
            if (hNodeType.includes('Button')) {
                code.style = dropdownButtonStyle;
            }
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
            if (hNodeType.includes('Button')){
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Button Style:')
                    .appendField(new Blockly.FieldDropdown(mdc.getButtonStyles), 'buttonStyle');
            }
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  For Action:')
                .appendField(new Blockly.FieldDropdown(mdc.getActionElementActions), 'forAction');
        }
    }

    mdc.generation.toolbox['actionElement'] = ActionElement;

})();