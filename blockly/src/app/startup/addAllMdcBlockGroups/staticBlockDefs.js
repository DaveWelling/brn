Blockly.Blocks['relation'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Relation:')
            .appendField(new Blockly.FieldTextInput('relationTitle'), 'title');
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Pretty Name:')
            .appendField(new Blockly.FieldTextInput(''), 'prettyName');
        this.setPreviousStatement(true, 'arrayOfRelations');
        this.setNextStatement(true, 'arrayOfRelations');
        this.setColour('#919191');
        this.setTooltip('Create a Relation');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['usecase'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Use Case:')
            .appendField(new Blockly.FieldTextInput('useCaseTitle'), 'title');            
        this.appendDummyInput()
            .appendField('Release:')
            .appendField(new Blockly.FieldTextInput('0'), 'majorVer')
            .appendField(new Blockly.FieldTextInput('0'), 'minorVer')
            .appendField(new Blockly.FieldTextInput('0'), 'patchVer');
        this.appendStatementInput('namespaces')
            .setCheck('arrayOfNamespaces')
            .appendField('Namespaces:');
        this.appendValueInput('appLayout')
            .setCheck('appLayout')
            .appendField('Layout:');
        this.setTooltip('App Block');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['namespace'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Namespace')
            .appendField(new Blockly.FieldTextInput('namespaceTitle'), 'title');
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Pretty Name:')
            .appendField(new Blockly.FieldTextInput(''), 'prettyName');
        this.appendStatementInput('Relations')
            .setCheck('arrayOfRelations')
            .appendField('Relations:');
        this.setInputsInline(false);
        this.setPreviousStatement(true, 'arrayOfNamespaces');
        this.setNextStatement(true, 'arrayOfNamespaces');
        this.setColour('#595959');
        this.setTooltip('Create a Namespace');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['hiddenfor'] = {
    init: function () {
        this.appendValueInput('securityModifier')
            .setCheck('securityModifier')
            .appendField('Hidden For:')
            .appendField(new Blockly.FieldDropdown([['newUser', 'newUser'], ['user', 'user'], ['admin', 'admin'], ['support', 'support']]), 'hiddenfor');
        this.setInputsInline(false);
        this.setOutput(true, 'securityModifier');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['readonlyfor'] = {
    init: function () {
        this.appendValueInput('securityModifier')
            .setCheck('securityModifier')
            .appendField('Read Only For:')
            .appendField(new Blockly.FieldDropdown([['newUser', 'newUser'], ['user', 'user'], ['admin', 'admin'], ['support', 'support']]), 'readonlyfor');
        this.setInputsInline(false);
        this.setOutput(true, 'securityModifier');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['addforfeatureflags'] = {
    init: function () {
        this.appendValueInput('securityModifier')
            .setCheck('securityModifier')
            .appendField('Add For Feature Flag:')
            .appendField(new Blockly.FieldTextInput('ffName'), 'featureFlag');
        this.setInputsInline(false);
        this.setOutput(true, 'securityModifier');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['removeforfeatureflag'] = {
    init: function () {
        this.appendValueInput('securityModifier')
            .setCheck('securityModifer')
            .appendField('Remove For Feature Flag: ')
            .appendField(new Blockly.FieldTextInput('ffName'), 'featureFlag');
        this.setInputsInline(false);
        this.setOutput(true, 'securityModifier');
        this.setTooltip('');
        this.setHelpUrl('');
    }
};