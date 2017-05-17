(function(){

    class ListColumn extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let textSortable = blocklyBlock.getFieldValue('sortable');
            let textPropertyname = blocklyBlock.getFieldValue('propertyName');

            // Drop downs
            let dropdownNamespace;
            let dropdownRelation;
            if (hNodeType.includes('DropDown')) {
                dropdownNamespace = blocklyBlock.getFieldValue('namespace');
                dropdownRelation = blocklyBlock.getFieldValue('relation');
            }

            // Compose property path if this is for a drop down/foreign key type data.
            let propertyName;
            if (hNodeType.includes('DropDown')) {
                propertyName = `${dropdownNamespace}:${dropdownRelation}.${textPropertyname}`;
            } else {
                propertyName = textPropertyname;
            }

            code.label = code.title;
            code.propertyName = propertyName;
            code.dataType = getDataTypeFromBlockName(this.blockName(hNodeType));
            code.sequence = getSequenceOfBlockBasedOnBlockOrder(blocklyBlock);
            code.sortable = textSortable.toLowerCase();
            return JSON.stringify(code);
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType) {
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Sortable:')
                .appendField(new Blockly.FieldCheckbox('FALSE'), 'sortable');
            if (hNodeType.includes('DropDown')) {
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Namespace:')
                    .appendField(new Blockly.FieldDropdown(mdc.getNamespaces), 'namespace');
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Relation:')
                    .appendField(new Blockly.FieldDropdown(mdc.getRelations), 'relation');
            }
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Property Name:')
                .appendField(new Blockly.FieldTextInput(''), 'propertyName');
        }
    }

    function getDataTypeFromBlockName(blockName) {
        switch (blockName) {
            case 'listColumn_Text':
            case 'listColumn_DropDownText':
                return 'text';
            case 'listColumn_LocalVerboseDateTime':
                return 'localVerboseDateTime';
            default :
                throw new Error(`Unknown list column block type: ${blockName}`);
        }
    }

    function getSequenceOfBlockBasedOnBlockOrder(block){
        let parent = block.getSurroundParent();
        let parentChildren = parent.getDescendants();
        return (parentChildren.findIndex(function(value) {
            return (value.id === block.id);
        }) - 1); // subtract 1 because includes parent with getDescendants
    }

    mdc.generation.toolbox['listColumn'] = ListColumn;

})();