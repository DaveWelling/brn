(function(){
    // Using inheritance because it saves A LOT of code, is only one level hierarchy and allows significant code reuse.
    mdc.BaseMdcBlockGroup = class BaseMdcBlockGroup {
        constructor(toolbox, hNodeTypeGroup, color) {
            this.hNodeTypeGroup = hNodeTypeGroup;
            this.config = mdc.startup.buildTree[hNodeTypeGroup];
            this.buildControls = this.config.controls;
            this.color = color;
            this.includeSecurityModifiers = this.config.includeSecurityModifiers || false;
            this.blockDescription = this.config.groupDescription || '';
            this.hasChildren = this.config.hasChildren || false;
            this.allowedChildrenTypes = this.config.allowedChildrenTypes || [];
            this.blockTypesAllowedToFollowThisOne = this.config.blockTypesAllowedToFollowThisOne || [];
            this.toolbox = toolbox;
        }
        addCodeGenerator(){
            let mdcBlockGroup = this;
            this.buildControls.forEach(function(hNodeType){
                Blockly.JavaScript[blockName(hNodeType, mdcBlockGroup.hNodeTypeGroup)] = function(blocklyBlock) {
                    const textTitle = blocklyBlock.getFieldValue('title');
                    const code = {
                        'id': blocklyBlock.data, 
                        'viewport': ['all'],
                        'title': textTitle,           
                        'hNodeType': hNodeType,
                        'hNodeTypeGroup': mdcBlockGroup.hNodeTypeGroup
                    };
                    gatherAllListsIntoChildren(code,blocklyBlock);
                    if (mdcBlockGroup.includeSecurityModifiers) {
                        addSecurityModifiersToCode(code, blocklyBlock);
                    }
                    
                    return mdcBlockGroup.addCodeGeneratorCustom(code, blocklyBlock, hNodeType);
                };
            });
        }
        
        addToBlocks() {
            const mdcBlock = this;
            this.buildControls.forEach(function(hNodeType){
                Blockly.Blocks[blockName(hNodeType, mdcBlock.hNodeTypeGroup)] = {
                    init: function() {
                        const blocklyBlock = this;
                        this.setInputsInline(true);
                        this.data = this.data || new ObjectId().toString();
                    
                        blocklyBlock.appendDummyInput()
                            .setAlign(Blockly.ALIGN_LEFT)
                            .appendField(prettyName(hNodeType));
                        blocklyBlock.appendDummyInput()
                            .setAlign(Blockly.ALIGN_RIGHT)
                            .appendField('  Title:')
                            .appendField(new Blockly.FieldTextInput(''), 'title');
                        
                        
                        blocklyBlock.setPreviousStatement(true, mdcBlock.hNodeTypeGroup);
                        blocklyBlock.setNextStatement(true, mdcBlock.blockTypesAllowedToFollowblocklyBlockOne);
                        blocklyBlock.setColour(mdcBlock.color[0]);
                        blocklyBlock.setTooltip(mdcBlock.blockDescription);
                        blocklyBlock.setHelpUrl('');
                        blocklyBlock.customContextMenu = (options) => addIdMenuOption(options, blocklyBlock);

                        
                        mdcBlock.addToBlocksCustom(mdcBlock.color, blocklyBlock, hNodeType, mdcBlock);


                        if (mdcBlock.includeSecurityModifiers) {
                            mdcBlock.addSecurityModifiersToBlock(blocklyBlock, hNodeType);
                        }
                        
                    
                    }
                };
            });
        }

        addToToolbox(){
            let that = this;
            let section = {
                'block': [],
                '_name': this.getPrettyBlockGroupName(),
                '_colour': this.color[1]
            };
            this.buildControls.forEach(function(name){
                section.block.push({
                    'field': {
                        '_name': 'title',
                        '__text': ''
                    },
                    '_type': blockName(name, that.hNodeTypeGroup)
                });
            });
            this.toolbox.xml.category.push(section);
        }

        addCodeGeneratorCustom(code, block, hNodeType) {
            return JSON.stringify(code);
        }
        
        addToBlocksCustom(color, block, hNodeType) {
            // Do nothing unless overridden.
        }
        addSecurityModifiersToBlock(block, hNodeType) {
            block.appendValueInput('securityModifier')
                .setCheck('securityModifier')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(new Blockly.FieldImage('./media/images/Whitelock.png', 25, 25, '*'));
            // find first statement input
            let firstStatementInput = block.inputList.find(input=>input.type === Blockly.NEXT_STATEMENT);
            if (firstStatementInput) {
                block.moveInputBefore('securityModifier', firstStatementInput.name);
            }
        }
        
        getPrettyBlockGroupName(){
            return _.startCase(this.hNodeTypeGroup)+'s';
        }
        blockName(hNodeType){
            return blockName(hNodeType, this.hNodeTypeGroup);
        }
    };
    function gatherAllListsIntoChildren(code,block){
        let children;
        block.inputList.forEach(input=>{
            if (input.type === Blockly.NEXT_STATEMENT) {
                let listStatements = Blockly.JavaScript.statementToCode(block, input.name);
                children = appendStatements(children, listStatements);
            }
        });
        if (children) {
            code.children = JSON.parse(`[${children}]`);
        }
    }
    function appendStatements(currentStatements, newStatements) {
        if (currentStatements && currentStatements.length > 0) {
            if (newStatements.length > 0) {
                return currentStatements + ',' + newStatements;
            } else {
                return currentStatements;
            }
        } else {
            return newStatements;
        }
    }
    function blockName(hNodeType, hNodeTypeGroup) {
        return hNodeTypeGroup + '_' + hNodeType;
    }

    function addSecurityModifiersToCode(code, block) {        
        const childrenSecurityModifiers = Blockly.JavaScript.valueToCode(block, 'securityModifier');
        if (childrenSecurityModifiers){
            // Copy security modifiers over to the code object.
            Object.assign(code, JSON.parse(`{${childrenSecurityModifiers}}`));
        }
    }
    function prettyName(hNodeTypeTitle) {
        return _.startCase(hNodeTypeTitle) + '  |';
    }
    

    function addIdMenuOption(options, block){
        options.push({
                'text': 'Override block ID',
                'enabled': true,
                'callback': function() { block.data = prompt('Override the ID for this block.', block.data);}
        });
        
    }

})();