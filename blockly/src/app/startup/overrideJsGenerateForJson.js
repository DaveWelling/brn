
// The default JavaScript code gen will try to put together statements
// from a 'Statement Input' block as code -- which makes sense.
// We need it to give us the conten of a JSON with array instead
// with commas in between the 'statements'.
// This ovverride of the default JavaScript scrub does what we need.
Blockly.JavaScript.scrub_ = function(block, code) {
    
    let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = Blockly.JavaScript.blockToCode(nextBlock);
    if (nextCode && nextCode.length > 0) {
        return code + ',' + nextCode;
    }
    return code + nextCode;
};