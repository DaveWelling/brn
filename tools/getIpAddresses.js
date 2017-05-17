'use strict';

const os = require('os');
const inquirer = require('inquirer');
const ifaces = os.networkInterfaces();
module.exports = {
    getAllInterfaceNames,
    getAllIps,
    getIpForInterface,
    getPreferredIp
};

// Steps
// 1a) Check preferred IP from config
// 1b) If exists, check if still a valid IP
// 1c) If valid, return it.
// 1d) Get all Interfaces that are IPV4 and not loopback
// 2) If more than one, ask use for preferred
// 3) If more than one IP for interface as user for preferred IP
// 4) Store IP in npm config: npm config -S set blockly-react-node.hostIp xxx.xxx.xxx.xxx

function getPreferredIp() {
    const lastHost = process.env.npm_package_config_hostIp;
    if (lastHost) {
        console.log(`Last host IP: ${lastHost}`);
        if (getAllIps().includes(lastHost)) {
            return Promise.resolve(lastHost);
        }
    }

    return getPreferredNetworkInterface().then(iface => {
        const ips = getIpForInterface(iface);
        return getSelectedIp(ips).then(ip => {
            console.log(`Selected IP address ${ip}`);
            return setDefaultIpInConfig(ip).then(()=> ip);
        });
    });
}

function setDefaultIpInConfig(ip) {
    return new Promise((resolve, reject)=>{
        const exec = require('child_process').exec;
        exec(`npm config set blockly-react-node:hostIp ${ip}`,
            function (error, stdout, stderr) {
                if (stdout && stdout.length > 0) {
                    console.log('stdout: ' + stdout);
                }
                if (stderr && stderr.length > 0) {
                    console.log('stderr: ' + stderr);
                }
                if (error !== null) {
                    reject('exec error: ' + error);
                } else {
                    resolve();
                }
            });
    });
    
}

function getSelectedIp(ips) {
    if (ips.length === 0) {
        throw new Error("No IPV4 address was found for the selected interface.  Select another interface");
    } else if (ips.length > 1) {
        return inquirer.prompt([
            {
                type: 'list',
                message: 'Use arrow keys and Enter to select an IP address to debug with.',
                name: 'ipAddress',
                choices: ips
            }
        ]).then(answers => {
            return answers.ipAddress;
        });
    } else {
        return Promise.resolve(ips[0]);
    }
}

function getPreferredNetworkInterface() {
    const interfaces = getAllInterfaceNames();
    if (interfaces.length === 0) {
        throw new Error("No IPV4 network interfaces were found.  This can happen if you are not connected to a network.  Unfortunately, Docker has some trouble with interacting with some host machine loopback IPs.  This script needs a real IPV4 for the host.");
    } else if (interfaces.length > 1) {
        return inquirer.prompt([
            {
                type: 'list',
                message: 'Use arrow keys and Enter to select a network interface to debug with.',
                name: 'interface',
                choices: interfaces
            }
        ]).then(answers => {
            return answers.interface;
        });
    } else {
        return Promise.resolve(interfaces[0]);
    }
}


function getIpForInterface(interfaceName) {
    const selectedIp = [];
    Object.keys(ifaces).forEach(function (ifname) {
        let alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                if (interfaceName === (ifname + ':' + alias)) {
                    selectedIp.push(iface.address);
                }
            } else {
                // this interface has only one ipv4 adress
                if (interfaceName === ifname) {
                    selectedIp.push(iface.address);
                }
            }
            ++alias;
        });
    });
    return selectedIp;
}


function getAllInterfaceNames() {
    const usableInterfaces = [];
    Object.keys(ifaces).forEach(function (ifname) {
        let alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                usableInterfaces.push(ifname + ':' + alias);
            } else {
                // this interface has only one ipv4 adress
                usableInterfaces.push(ifname);
            }
            ++alias;
        });
    });
    return usableInterfaces;
}

function getAllIps() {
    const ips = [];
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            ips.push(iface.address);
        });
    });
    return ips;
}