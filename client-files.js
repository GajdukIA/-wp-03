const net = require('net');
const fs = require('fs');
const port = 8124;
const string = 'QA';
const bad = 'DEC';
const good = 'ACK';
let arr=[];

const client = new net.Socket();
let currentIndex = -1;
client.setEncoding('utf8');

let questions = [];
client.connect({port: port, host: '127.0.0.1'}, () => {
    let a=0;
    for(a =2;a<process.argv.length;a++){
        arr.push(process.argv[a]);
    }
    console.log(arr);
    console.write(arr);
});

client.on('data', (data) => {
    if (data === bad)
        client.destroy();
    if (data === good) {
        sendFILES();
        client.destroy();
    }
});

client.on('close', function () {
    console.log('Connection closed');
});


//otpravka files
function sendFILES() {

    }
    else
        client.destroy();
}