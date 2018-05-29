/**
 * Get System Information in json format. Gets Run Queue, Memory and Swap Info.
 */

var os = require('os');
var fs = require('fs');
var url = require('url');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();

var http = require('http');
var PORT = process.env.PORT || 5000;

//create a server object:
http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
}).listen(PORT);

dispatcher.onGet("/api/memory", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getMemory()));
});

dispatcher.onGet("/api/cpu", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getCPU()));
});


dispatcher.onGet("/api/info", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    let result = {};
    result.memory = getMemory();
    result.cpu = getCPU();
    res.end(JSON.stringify(result));
});

dispatcher.onGet("/api/info/all", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getSystemInfo()));
});

function getSystemInfo() {
    var sysinfo = {};

    sysinfo.hostname = os.hostname();
    // console.log(os.networkInterfaces().tun0);
    sysinfo.network = os.networkInterfaces();

    sysinfo.os = {};
    sysinfo.os.release = os.release();
    sysinfo.os.platform = os.platform();
    sysinfo.os.arch = os.arch();
    // console.log(os.loadavg());
    sysinfo.cpu = getCPU(sysinfo);
    // console.log(sysinfo.cpu);
    sysinfo.memory = getMemory();

    /**
     * Gets Swap info out of /proc/swaps on Linux systems.
     */


    // sysinfo.swap = getSwap();

    // console.log(sysinfo);
    return sysinfo;


}

function getMemory() {
    let memory = {};
    memory.total = os.totalmem();
    memory.free = os.freemem();
    memory.used_perc = (100 - ((os.totalmem() - os.freemem()) / os.totalmem() * 100)).toFixed(2);
    return memory;
}

function getCPU() {
    let cpu = {};
    cpu.run_queue_1 = os.loadavg()[0].toFixed(2);
    cpu.run_queue_5 = os.loadavg()[1].toFixed(2);
    cpu.run_queue_15 = os.loadavg()[2].toFixed(2);
    return cpu;
}

function getSwap() {
    var swapinfo = [];

    fs.readFileSync('/proc/swaps').toString().split(os.EOL).forEach(function (line) {
        var lineArray = line.split(/\s+/);
        if (lineArray[0] != 'Filename') {
            var tempObject = {};
            tempObject.size = parseInt(lineArray[2]);
            tempObject.used = parseInt(lineArray[3]);
            tempObject.perc = (tempObject.used / tempObject.size * 100).toFixed(2);
            if (!isNaN(tempObject.size)) {
                swapinfo.push(tempObject);
            }
        }
    });
    return swapinfo;
};

console.log(`started server on ${PORT}`);
console.log(`current system info ${JSON.stringify(getSystemInfo())}`);
