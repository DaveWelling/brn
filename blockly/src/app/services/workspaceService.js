(function(){
    const x2js = new X2JS();
    
    mdc.services.saveIntermediateDal = function (useCaseTitle) {       
        let topBlocks = mdc.workspace.getTopBlocks();
        let useCaseBlock = topBlocks.find(function(block){
            return block.type === 'usecase';
        });
        if (useCaseBlock){
            useCaseTitle = useCaseBlock.getFieldValue('title');
        }
        const xml = Blockly.Xml.workspaceToDom(mdc.workspace);
        // Need to use blockly XML to text for some reason (x2js will not work)
        const xmlText = Blockly.Xml.domToText(xml);
        const workspace = x2js.xml_str2json(xmlText);
        
        let filename = useCaseTitle + '.json';
        let blob = new Blob([JSON.stringify(workspace)], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, filename);
        
    };
    mdc.services.getIntermediateDal = function (file) {
        
        let reader = new FileReader();
        reader.onload = function(e) { 
            let json = JSON.parse(e.target.result);
            loadIntermediateToBlockly(json); 
        };
        reader.readAsText(file);
        
    };
    function saveAs(blob, filename) {
        let a = document.createElement('a');
        let url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

    function loadIntermediateToBlockly(workspaceJson) {
        const workspaceString = x2js.json2xml_str(workspaceJson);
        // Need to use blockly XML parser (domToWorkspace will not work on XML string (despite docs saying otherwise))
        const xml = Blockly.Xml.textToDom(workspaceString);
        Blockly.Xml.domToWorkspace(xml, mdc.workspace);
    }
})();