const ipTools = require('./getIpAddresses');
const composeFilePath = './docker-compose.yml';
const composeFileTemplatePath = './docker-compose.dev.yml';
const fs = require('fs');
const openBrowser = require('react-dev-utils/openBrowser');
const path = require('path');

module.exports = {
    openPages,
    populateDockerComposeTemplate
};

function populateDockerComposeTemplate(){
    ipTools.getPreferredIp().then(dockerHostIp=>{
        let blocklyPath = path.join(__dirname, '..', 'blockly/src');
        const keyValuePairs = {
            BLOCKLY_SITE_DIRECTORY: blocklyPath,
            DOCKER_HOST_IP: dockerHostIp
        };
        writeNewComposeFile(keyValuePairs);
    });
}

function openPages(){
    openBrowser("http://localhost/blockly/");
}

function writeNewComposeFile(keyValuePairs) {
    return new Promise((resolve, reject)=> {
        console.log('Writing compose file to path: ' + composeFilePath);
        fs.readFile(composeFileTemplatePath, 'utf8', function (err, composeFileContent) {
            if (err) {
                reject(err);
            }
            let newComposeFile = composeFileContent;
            Object.getOwnPropertyNames(keyValuePairs).forEach(templateKey=>
                newComposeFile= newComposeFile.replace('${'+templateKey+'}', keyValuePairs[templateKey])
            );
            fs.writeFile(composeFilePath, newComposeFile, (writeError)=> {
                if (writeError) {
                    reject(writeError);
                } else {
                    console.log('New compose file written.');
                    resolve();
                }
            });
        });
    });
}


