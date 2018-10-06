const net = require('net');
const fs = require('fs');
//const path=require('path');
const port = 8124;
const string = 'QA';
const bad = 'DEC';
const good = 'ACK';
let arr=[];
let counter=1;
const path = require('path');
const client = new net.Socket();
let currentIndex = -1;
client.setEncoding('utf8');

let questions = [];
client.connect({port: port, host: '127.0.0.1'}, () => {
   client.write("FILES");
});

client.on('data', (data) => {
    if (data === bad)
        client.destroy();
    if (data === good) {
        sendFILENAME();
        //console.log(process.argv[process.argv.length-counter]);
    }
    if (data==="NEXT"){
        let v="";
        //console.log("data="+data);
        fs.readFile((process.argv[process.argv.length-counter]), (err,va)=>{
            if (err) throw err;
            else {
                console.log(va);
                //va = data.toString();
                let buf1=Buffer.from(va);
                client.write(buf1);
                counter++;
            }
        });
    }
});


client.on('close', function () {
    console.log('Connection closed');
});

//otpravka files name
function sendFILENAME() {
    if(((process.argv.length)-counter)>1){
        console.log(path.basename(process.argv[process.argv.length-counter]));
        client.write(path.basename(process.argv[process.argv.length-counter]));
    }
    else{
        client.destroy();
    }
}

