
mdc.startup.buildTree = {
    actionElement: {
        includeSecurityModifiers: true,
        blockTypesAllowedToFollowThisOne: ['actionElement', 'layout', 'dataView'],
        groupDescription: 'Data entry or action (i.e. button) control which is not attached to a form.',
        controls: [
            'Button'
        ]
    } ,
    appLayout:  {
        includeSecurityModifiers: false,
        allowedChildrenTypes: ['layout'],
        blockTypesAllowedToFollowThisOne: [],
        groupDescription: 'Top level layout block.  Only one per use case.',
        controls:[
            'LeftSideNavAppLayout'
        ]
    },
    detailPane: {
        includeSecurityModifiers: true,
        allowedChildrenTypes: ['layout', 'form', 'nav', 'dataView'],
        blockTypesAllowedToFollowThisOne: ['detailPane'],
        groupDescription: 'Usually attached to a "New" button or a grid.  Specifies the layout of the item which will be changed.',
        controls:[
            'DetailPane'
        ]
    },
    form: {
        includeSecurityModifiers: false,
        allowedChildrenTypes: ['formElement', 'layout'],
        blockTypesAllowedToFollowThisOne: [],
        groupDescription: 'A data entry form.',
        controls:[
            'Form',
            'SubForm'
        ]
    },
    formButton: {
        includeSecurityModifiers: true,
        blockTypesAllowedToFollowThisOne: ['formButton'],
        groupDescription: 'A button to perform an action on a form such as submitting the form or cancelling.',
        controls:[
            'FormButton'
        ]
    },
    formElement: {
        includeSecurityModifiers: true,
        blockTypesAllowedToFollowThisOne: ['formElement'],
        groupDescription: 'A data entry control for a form.',
        controls:[
            'DropDown',
            'DropDownWithFilter',
            'EditableList',
            'Email',
            'Integer',
            'LongText',
            'ShortText',
            'Toggle'
        ]
    },
    layout: {
        includeSecurityModifiers: true,
        allowedChildrenTypes: ['layout', 'list', 'form', 'detailPane', 'actionElement'],
        blockTypesAllowedToFollowThisOne: ['layout','nav'],
        groupDescription: 'A container to organize controls.',
        controls:[
            'DetailVSplitLayout',
            'LeftAlignLayout',
            'RightAlignLayout'
        ]
    },
    list: {
        includeSecurityModifiers: true,
        blockTypesAllowedToFollowThisOne: ['layout'],
        groupDescription: 'Used to display multiple documents for selection or reporting.',
        controls:[
            'CardList',
            'SimpleList'
        ]
    },
    listColumn: {
        includeSecurityModifiers: false,
        blockTypesAllowedToFollowThisOne: ['listColumn'],
        groupDescription: 'Designate what columns or card elements will display in a list.',
        controls:[
            'Text',
            'LocalVerboseDateTime',
            'DropDownText'
        ]
    }
};

mdc.startup.buildBlocksInTree = function(){
    let i = 0;
    Object.getOwnPropertyNames(mdc.startup.buildTree).forEach(function(nodeTypeGroup){
        let color = mdc.colors[i];
        let GroupBuilder = mdc.generation.toolbox[nodeTypeGroup];
        if (GroupBuilder) {
            let group = new GroupBuilder(mdc.toolbox, nodeTypeGroup, color);
            group.addToToolbox();
            group.addCodeGenerator();
            group.addToBlocks();
        } else {
            console.error(`'Build methods are not defined for the ${nodeTypeGroup} block section.`);
        }
        i++;
    });
};