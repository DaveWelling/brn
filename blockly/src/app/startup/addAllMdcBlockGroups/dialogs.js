(function(){

    class Dialog extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let dropdownOpenAction = blocklyBlock.getFieldValue('openAction');
            let dropdownCloseAction = blocklyBlock.getFieldValue('closeAction');
            let dropdownNamespace = blocklyBlock.getFieldValue('namespace');
            let dropdownRelation = blocklyBlock.getFieldValue('relation');
            let openActionType =  `${dropdownOpenAction.toUpperCase()}_${dropdownNamespace.toUpperCase()}_${dropdownRelation.toUpperCase()}_SUCCESS`;
            let closeActionType =  `${dropdownCloseAction.toUpperCase()}_${dropdownNamespace.toUpperCase()}_${dropdownRelation.toUpperCase()}`;
            code.closeAction = dropdownCloseAction.toLowerCase();
            code.openAction = dropdownOpenAction.toLowerCase();
            code.namespace = dropdownNamespace.toLowerCase();
            code.relation = dropdownRelation.toLowerCase();            
            code.openActionType = openActionType;
            code.closeActionType = closeActionType;
            return JSON.stringify(code);
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType, mdcBlock) {
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Open Action:')
                .appendField(new Blockly.FieldDropdown(mdc.getActionElementActions), 'openAction');                
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Close Action:')
                .appendField(new Blockly.FieldDropdown(mdc.getActionElementActions), 'closeAction');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Namespace:')
                .appendField(new Blockly.FieldDropdown(mdc.getNamespaces), 'namespace');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Relation:')
                .appendField(new Blockly.FieldDropdown(mdc.getRelations), 'relation');
            blocklyBlock.appendStatementInput('children')
                .setCheck(mdcBlock.allowedChildrenTypes)
                .appendField('Children:', 'childrenField');
            blocklyBlock.setNextStatement(false);
        }
    }
    mdc.generation.toolbox['dialog'] = Dialog;

})();