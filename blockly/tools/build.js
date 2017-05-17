// This build file is needed because this project is vanilla JavaScript
// and we need a way to get the node_module dependencies into the folder that is 
// served.

const ncp = require('ncp').ncp;
const dest = 'src/vendor';
const src = [
    'node_modules/blockly/blockly_compressed.js',
    'node_modules/blockly/blocks_compressed.js',
    'node_modules/blockly/javascript_compressed.js',
    'node_modules/blockly/msg/js/en.js',
    'node_modules/lodash/lodash.min.js',
    'node_modules/x2js/xml2json.min.js'
];
console.log('Copying vendor files to client path from node_modules');
src.forEach(from => nodecopy(from,dest));
function nodecopy(src, dst) {
    ncp(src, dst, function (err){
        if (err)
            return console.error(err);
        console.log(`Copying ${src} to ${dst} finished!`);
    });
}