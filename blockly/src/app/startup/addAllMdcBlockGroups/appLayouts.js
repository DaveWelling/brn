(function(){

    class AppLayout extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            return [JSON.stringify(code),Blockly.JavaScript.ORDER_ATOMIC];
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType, mdcBlock) {
            blocklyBlock.appendStatementInput('children')
                .setCheck(mdcBlock.allowedChildrenTypes)
                .appendField('Children:', 'childrenField');
            blocklyBlock.setOutput(true, 'appLayout');
            // this is a value block (not a statement block)
            blocklyBlock.setNextStatement(false);
            blocklyBlock.setPreviousStatement(false);
        }
    }

    mdc.generation.toolbox['appLayout'] = AppLayout;

})();