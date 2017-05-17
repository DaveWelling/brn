(function(){

    class FormButton extends mdc.BaseMdcBlockGroup {
        addCodeGeneratorCustom(code, blocklyBlock, hNodeType) {
            let dropdownButtonAction = blocklyBlock.getFieldValue('buttonAction');
            let dropdownButtonStyle = blocklyBlock.getFieldValue('buttonStyle');
            code.formAction = dropdownButtonAction;
            code.buttonStyle = dropdownButtonStyle;
            return JSON.stringify(code);
        }
        addToBlocksCustom(color, blocklyBlock, hNodeType) {
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Form Action:')
                .appendField(new Blockly.FieldDropdown(mdc.getFormActions), 'buttonAction');
            blocklyBlock.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField('  Button Style:')
                .appendField(new Blockly.FieldDropdown(mdc.getButtonStyles), 'buttonStyle');
        }
    }

    mdc.generation.toolbox['formButton'] = FormButton;
})();