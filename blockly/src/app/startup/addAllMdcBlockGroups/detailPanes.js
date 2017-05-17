(function(){

    class DetailPane extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let dropdownForAction = blocklyBlock.getFieldValue('forAction');
            let dropdownNamespace = blocklyBlock.getFieldValue('namespace');
            let dropdownRelation = blocklyBlock.getFieldValue('relation');
            let showForAction =  `${dropdownForAction.toUpperCase()}_${dropdownNamespace.toUpperCase()}_${dropdownRelation.toUpperCase()}`;
            code.showForAction = showForAction;
            code.namespace = dropdownNamespace;
            code.relation = dropdownRelation;
            return JSON.stringify(code);
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType, mdcBlock) {
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
                .appendField('  For Action:')
                .appendField(new Blockly.FieldDropdown(mdc.getFormActions), 'forAction');
            blocklyBlock.appendStatementInput('children')
                .setCheck(mdcBlock.allowedChildrenTypes)
                .appendField('Children:', 'childrenField');
        }
    }

    mdc.generation.toolbox['detailPane'] = DetailPane;
})();