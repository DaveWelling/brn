(function(){

    class Form extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock) {
            let dropdownNamespace = blocklyBlock.getFieldValue('namespace');
            let dropdownRelation = blocklyBlock.getFieldValue('relation');
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
                
            if (hNodeType != 'SubForm') {
                blocklyBlock.appendStatementInput('formButtons')
                    .setCheck(['formButton'])
                    .appendField('Form Buttons:'); 
            }
            
            blocklyBlock.appendStatementInput('children')
                .setCheck(mdcBlock.allowedChildrenTypes)
                .appendField('FormElements:', 'childrenField');
                
            if (hNodeType === 'SubForm') {
                blocklyBlock.setNextStatement(true, ['form']);
            } else {
                blocklyBlock.setNextStatement(false);
            }
        }
    }

    mdc.generation.toolbox['form'] = Form;

})();