(function(){
    class Layout extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let dropdownNamespace = blocklyBlock.getFieldValue('defaultNamespace');
            let dropdownRelation = blocklyBlock.getFieldValue('defaultRelation');

            code.defaultNamespace = dropdownNamespace.toLowerCase();
            code.defaultRelation = dropdownRelation.toLowerCase();
            return JSON.stringify(code);
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType, mdcBlock) {
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Default Namespace:')
                .appendField(new Blockly.FieldDropdown(mdc.getNamespaces), 'defaultNamespace');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Default Relation:')
                .appendField(new Blockly.FieldDropdown(mdc.getRelations), 'defaultRelation');

            if (hNodeType === 'DetailVSplitLayout') {
                blocklyBlock.additionalListNames = ['list'];
            }
            if (hNodeType === 'TabLayout'){
                // Slight hack to ensure there are children inputs (which happen after this code
                // if going sequentially)
                setTimeout(function(){  
                    const children = blocklyBlock.getInput('children');
                    children.setCheck(['layout']); // only allow layouts inside tab or it will get wacky.
                }, 1);
            }
            if (hNodeType === 'DetailVSplitLayout') {
                blocklyBlock.appendStatementInput('list')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .setCheck(['list', 'layout'])
                    .appendField('List:', 'list');
                blocklyBlock.appendStatementInput('children')
                    .setCheck(['detailPane'])
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('Detail Pane(s):', 'childrenField');
            } else {
                blocklyBlock.appendStatementInput('children')
                    .setCheck(mdcBlock.allowedChildrenTypes)
                    .appendField('Children:', 'childrenField');
            }
        }
    }
    

    mdc.generation.toolbox['layout'] = Layout;
})();