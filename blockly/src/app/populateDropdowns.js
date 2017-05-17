mdc.populateDropDowns = function(){

    mdc.pubsub.namespaceIds = mdc.pubsub.namespaceIds || [];
    mdc.pubsub.relationIds = mdc.pubsub.relationIds || [];
    mdc.namespaces = mdc.namespaces || [];
    mdc.relations = mdc.relations || [];

    mdc.getFormActions = function(){
        return [['New', 'NEW'], ['Edit','EDIT'], ['Cancel', 'CANCEL'], ['Remove', 'REMOVE'],['Close', 'CLOSE'],['Submit', 'SUBMIT']];
    };

    mdc.getButtonStyles = function(){
        return [
            ['Accent One', 'AccentOne'],
            ['Accent Two', 'AccentTwo'],
            ['Dark', 'Dark'],
            ['Light', 'Light'],
            ['Negative', 'Negative'],
            ['Positive', 'Positive'],
            ['Circle Add', 'CircleAdd'],
            ['Unstyled', 'unstyled']
        ];
    };

    mdc.getActionElementActions = function(){
        return [
            ['Date Range Changed', 'DATERANGECHANGED'],
            ['Logout', 'LOGOUT'],
            ['Search', 'SEARCH'],
            ['New', 'NEW'],
            ['Edit', 'EDIT'],
            ['Cancel', 'CANCEL'],
            ['Close', 'CLOSE']
        ];
    };

    /** Recursively try to find a parent with a default namespace and default relation */
    function findParentDefaultNsAndRltn(block) {
        let namespace;
        let relation;
        if (block.parentBlock_) {
            let namespaceField = block.parentBlock_.getField('defaultNamespace');
            let relationField = block.parentBlock_.getField('defaultRelation');
            if (namespaceField && relationField) {
                namespace = namespaceField.getValue();
                relation = relationField.getValue();
            } else {
                return findParentDefaultNsAndRltn(block.parentBlock_);
            }            
        }
        return {
            namespace,
            relation
        };
    }

    mdc.workspace.addChangeListener(function(event) {
        switch (event.type) {
            case Blockly.Events.MOVE:
                // If possible, set the default namespace and relation values.
                if (event.newParentId){
                    let movedBlock = mdc.workspace.getBlockById(event.blockId);
                    let namespaceField = movedBlock.getField('namespace');
                    let relationField = movedBlock.getField('relation');
                    if (namespaceField && relationField){
                        let nsAndRltn = findParentDefaultNsAndRltn(movedBlock);
                        if (nsAndRltn.namespace && nsAndRltn.relation) {
                            namespaceField.setValue(nsAndRltn.namespace);
                            relationField.setValue(nsAndRltn.relation);
                        }
                    }
                }
                break;
            case Blockly.Events.CREATE:
                event.ids.forEach(function(id){
                    let newBlock = mdc.workspace.getBlockById(id);
                    let title = newBlock.getFieldValue('title');
                    if (newBlock.type === 'namespace') {
                        mdc.pubsub.namespaceIds.push(id);
                        syncListForBlockChange(mdc.namespaces, { name: 'title', blockId: newBlock.id, newValue: title });
                    }
                    if (newBlock.type === 'relation') {
                        mdc.pubsub.relationIds.push(id);
                        syncListForBlockChange(mdc.relations, { name: 'title', blockId: newBlock.id, newValue: title });
                    }
                });
                break;
            case Blockly.Events.DELETE:
                event.ids.forEach(function(id){
                    let namespaceIdIndex = mdc.pubsub.namespaceIds.indexOf(id);
                    if (namespaceIdIndex >= 0) {
                        mdc.pubsub.namespaceIds.splice(namespaceIdIndex, 1);
                        const indexOfNamespace = mdc.namespaces.findIndex(function(namespace){
                            return namespace.id === id;
                        });
                        if (indexOfNamespace >= 0){
                            mdc.namespaces.splice(indexOfNamespace, 1);
                        }
                    }
                    let indexRelationId = mdc.pubsub.relationIds.indexOf(id);
                    if (indexRelationId >= 0) {
                        mdc.pubsub.relationIds.splice(indexRelationId, 1);
                        const indexOfRelation = mdc.relations.findIndex(function(relation){
                            return relation.id === id;
                        });
                        if (indexOfRelation >= 0){
                            mdc.relations.splice(indexOfRelation, 1);
                        }
                    }
                });
                break;
            case Blockly.Events.CHANGE:
                if (mdc.pubsub.namespaceIds.includes(event.blockId)){
                    syncListForBlockChange(mdc.namespaces, event);
                }
                if (mdc.pubsub.relationIds.includes(event.blockId)){
                    syncListForBlockChange(mdc.relations, event);
                }
                break;
        }
    });

    function syncListForBlockChange(list, event) {
        if (event.name !== 'title') return;
        const indexOfItem = list.findIndex(function(listItem){
            return listItem.id === event.blockId;
        });
        if (indexOfItem >= 0){
            list[indexOfItem].title = event.newValue;
        } else {
            list.push({
                title: event.newValue,
                id: event.blockId
            });
        }
    }

    mdc.getNamespaces = function() {
        if (mdc.namespaces.length === 0){
            return [['None Defined', '']];
        }
        return mdc.namespaces.map(function(namespace) {
            return [namespace.title, namespace.title];
        });
    };

    mdc.getRelations = function(){
        if (mdc.relations.length === 0){
            return [['None Defined', '']];
        }
        return mdc.relations.map(function(relation) {
            return [relation.title, relation.title];
        });
    };

};