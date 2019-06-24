var osu = require('node-os-utils')
var os = require('os');

var cpu = osu.cpu
var mem = osu.mem;

cpu.usage()
    .then(info => {
        console.log(info)
    });

console.log(mem);
mem.info().then(info => {
    console.log(info)
});
mem.info().then(info => {
    console.log(info)
});

console.log("Hii "+ JSON.stringify(getMemory()));


function getMemoryBk() {
    let memory = {};
    memory.total = os.totalmem() / (1024 * 1024);
    memory.free = os.freemem() / (1024 * 1024);
    memory.used_perc = (100 - ((os.totalmem() - os.freemem()) / os.totalmem() * 100)).toFixed(2);
    return memory;
}

function getCPUBk() {
    let cpu = {};
    cpu.run_queue_1 = os.loadavg()[0].toFixed(2);
    cpu.run_queue_5 = os.loadavg()[1].toFixed(2);
    cpu.run_queue_15 = os.loadavg()[2].toFixed(2);
    return cpu;
}

function getMemory() {
    mem.info().then(info => {
        let memory = {};
        console.log(info)
        memory.total = (info.totalMemMb * 1024 * 1024).toFixed(0);
        memory.free = (info.freeMemMb * 1024 * 1024).toFixed(0);
        memory.used_perc = (100 - info.freeMemPercentage).toFixed(2);
        console.log(' new memory ',memory);
        return memory;
    });
}

function getCPU() {
    let cpu = {};
    cpu.run_queue_1 = os.loadavg()[0].toFixed(2);
    cpu.run_queue_5 = os.loadavg()[1].toFixed(2);
    cpu.run_queue_15 = os.loadavg()[2].toFixed(2);
    return cpu;
}