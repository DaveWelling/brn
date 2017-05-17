(function(){

    class List extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let initialOrderBy = blocklyBlock.getFieldValue('initialOrderBy');
            let initialSort = blocklyBlock.getFieldValue('initialSort');
            let filterAction = blocklyBlock.getFieldValue('filterAction');
            let rowClickAction = blocklyBlock.getFieldValue('rowClickAction');
            let namespace = blocklyBlock.getFieldValue('namespace');
            let relation = blocklyBlock.getFieldValue('relation');
            let columns = Blockly.JavaScript.statementToCode(blocklyBlock, 'columns');
            Object.assign(code, {
                initialOrderBy, initialSort, filterAction, rowClickAction, namespace, relation
            });
            code.columns = JSON.parse(`[${columns}]`);
            return JSON.stringify(code);
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType) {
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('Namespace:')
                .appendField(new Blockly.FieldDropdown(mdc.getNamespaces), 'namespace');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('Relation:')
                .appendField(new Blockly.FieldDropdown(mdc.getRelations), 'relation');
            const filterActionDropDown = new Blockly.FieldDropdown(mdc.getActionElementActions);
            filterActionDropDown.setValue('SEARCH');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('Filter Action:')
                .appendField(filterActionDropDown, 'filterAction');
            const rowClickDropDown = new Blockly.FieldDropdown(mdc.getActionElementActions);
            rowClickDropDown.setValue('EDIT');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('Row Click Action:')
                .appendField(rowClickDropDown, 'rowClickAction');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('Initial Order By:')
                .appendField(new Blockly.FieldTextInput('propertyName'), 'initialOrderBy');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('Initial Sort Direction:')
                .appendField(new Blockly.FieldDropdown([['ascending', 'ascending'], ['descending','descending']]), 'initialSort');
            blocklyBlock.appendStatementInput('columns')
                .setCheck(['listColumn'])
                .appendField('List Columns:');
        }
    }

    mdc.generation.toolbox['list'] = List;

})();