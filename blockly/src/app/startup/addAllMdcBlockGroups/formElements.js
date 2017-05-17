(function(){

    class FormElement extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let required = blocklyBlock.getFieldValue('required');
            let dropdownNamespace;
            let dropdownRelation;
            if (hNodeType.includes('DropDown')) {
                dropdownNamespace = blocklyBlock.getFieldValue('namespace');
                dropdownRelation = blocklyBlock.getFieldValue('relation');
            }
            let textPropertyname = blocklyBlock.getFieldValue('propertyName');                
            let editableListElements = Blockly.JavaScript.statementToCode(blocklyBlock, 'editableListElements');
            // Song and dance to figure out the sequence based on order in the workspace.
            let parent = blocklyBlock.getSurroundParent();
            let parentChildren = parent.getDescendants();
            let sequence = (parentChildren.findIndex(function(value) {
                return (value.id === blocklyBlock.id);
            }) - 1); // subtract 1 because includes parent with getDescendants
            
            code.propertyName = textPropertyname;
            code.sequence = sequence;

            // Exclude boolean types from having a required flag
            if (hNodeType !== 'Toggle') {
                code.required = ('true' === required.toLowerCase());
            }
            
            if (hNodeType.includes('DropDown')) {
                Object.assign(code, {
                    'foreignNamespace': dropdownNamespace,
                    'foreignRelation': dropdownRelation
                });
            }
            if (hNodeType === 'Integer'){
                code.max = parseInt(blocklyBlock.getFieldValue('max'));
                code.min = parseInt(blocklyBlock.getFieldValue('min'));
            }
            if (hNodeType === 'LongText') {
                code.rows = blocklyBlock.getFieldValue('rows');
            }
            if (hNodeType === 'ShortText' || hNodeType === 'LongText') {
                code.minLength = parseInt(blocklyBlock.getFieldValue('minLength'));
                code.maxLength = parseInt(blocklyBlock.getFieldValue('maxLength'));
            }
            if (hNodeType === 'Toggle') {
                code.toggleValues = [];
                code.toggleValues.push(blocklyBlock.getFieldValue('toggleOption1'));
                code.toggleValues.push(blocklyBlock.getFieldValue('toggleOption2'));
            }
            if (editableListElements.length > 0) {
                Object.assign(code, {'formElements':JSON.parse(`[${editableListElements}]`)});
            }
            return JSON.stringify(code);
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType) {
            
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Property Name:')
                .appendField(new Blockly.FieldTextInput(''), 'propertyName');     
                
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
            if (hNodeType === 'Integer') {
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Min:')
                    .appendField(new Blockly.FieldNumber('0', Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1), 'min');                    
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Max:')
                    .appendField(new Blockly.FieldNumber('9999', Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1), 'max');   
            }
            if (hNodeType === 'LongText') {
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Rows:')
                    .appendField(new Blockly.FieldNumber('20', Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1), 'rows');                    
            }
            if (hNodeType === 'ShortText' || hNodeType === 'LongText') {
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Min Length:')
                    .appendField(new Blockly.FieldNumber('0', Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1), 'minLength');                    
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Max Length:')
                    .appendField(new Blockly.FieldNumber('100', Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1), 'maxLength');   
            }
            if (hNodeType === 'Toggle') {
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  First Toggle Option:')
                    .appendField(new Blockly.FieldTextInput('false'), 'toggleOption1');    
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Second Toggle Option:')
                    .appendField(new Blockly.FieldTextInput('true'), 'toggleOption2');    
            } 

            
            // Exclude boolean types from having a required flag
            if (hNodeType !== 'Toggle'){
                blocklyBlock.appendDummyInput()
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('  Required:')
                    .appendField(new Blockly.FieldCheckbox('false'), 'required');
            }
            
            if (hNodeType === 'EditableList'){
                // Allow form elements inside an editable list.                        
                blocklyBlock.appendStatementInput('editableListElements')
                    .setCheck(['formElement'])
                    .appendField('Form Elements:'); 
            }
            

                
        }
    }

    mdc.generation.toolbox['formElement'] = FormElement;

})();