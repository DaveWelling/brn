mdc.startup.initializeBlockly = function () {

    // Creates block structure, block code generation and adds block to mdc.toolbox;
    mdc.startup.buildBlocksInTree();
    
    // convert toolbox structure from JSON to xml so blockly can read it.
    const x2js = new X2JS();
    let toolbox = x2js.json2xml_str(mdc.toolbox);

    const blocklyOptions = {
        toolbox: toolbox,
        collapse: true,
        comments: true,
        disable: true,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: 'start',
        css: true,
        media: 'https://blockly-demo.appspot.com/static/media/',
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true,
        grid: {
            spacing: 20,
            length: 1,
            colour: '#888',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxcale: 3,
            minScale: 0.3,
            scaleSpeed: 1.05
        }
    };

    
    /* Inject your Blockly workspace into the DOM */
    mdc.blocklyDiv = document.getElementById('blocklyDiv');
    mdc.workspace = Blockly.inject(mdc.blocklyDiv, blocklyOptions);
    
    mdc.ensureCamelCaseForMetaDataNames();
    mdc.populateDropDowns();

    // Handle the buttons that show or hide the metadata JSON.
    mdc.codeShown = false;
    mdc.toggleCode = function(){
        if (mdc.codeShown) {
            document.getElementById('toggleCode').textContent = 'Show Code';
            document.getElementById('codeArea').style.display='none';
            document.getElementById('codeArea').style.width='0px';
            document.getElementById('blocklyArea').style.width='100%';
        } else {
            document.getElementById('toggleCode').textContent = 'Hide Code';
            document.getElementById('codeArea').style.display='table-cell';
            document.getElementById('codeArea').style.width='100%';
            document.getElementById('blocklyArea').style.width='50%';
        }
        mdc.codeShown = !mdc.codeShown;
        Blockly.svgResize(mdc.workspace);
    };
    mdc.clearWorkspace = function(){
        if (window.confirm('Are you sure you want to clear this?'))
            mdc.workspace.clear();
    };
    mdc.collapseNavHeadings = function(){
        let blocks = mdc.workspace.getAllBlocks();
        let navHeadings = blocks.filter(block=> { 
            let pieces = block.type.split('_');
            let typeGroup = pieces[0];
            let type = pieces.length>1 ? pieces[1] : '';
            switch (typeGroup) {
                case 'navHeading':
                case 'namespace':
                    return true;    
                case 'layout':
                    return (type === 'UserProfileHeaderLayout');
                default:
                    return false;
            }
        });
        navHeadings.forEach(block=>block.setCollapsed(true));
    };
};

