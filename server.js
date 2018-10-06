const net = require('net');
const fs = require('fs');
const port = 8124;
const clientString = 'QA';
const clientString2='FILES';
const good = 'ACK';
const bad = 'DEC';
let locationOfFile='D:\\';
let logger = fs.createWriteStream('client_id.log');
//let filerr = fs.createWriteStream('my.log');
let p;
let cols;
let now=0;
let seed = 0;
let file;
let hmnow=0;
let filename="";

PathsEnvs();

const server = net.createServer((client) => {
    //server.maxConnections=cols;
    console.log('Client  connected');
    client.setEncoding('utf8');
    let v=0;
    client.on('data', (data, err) =>{
        if (err) console.error(err);
        else if (!err && data === clientString){
            client.id = Date.now() + seed++;
            logger=fs.createWriteStream('client_'+client.id+'.log');
            writeLog('Client #' + client.id + ' connected\n');
            client.write(data === clientString ? good : bad);
            v=1;
        }
        else if(!err&&(data === clientString2)&&(now<cols)){
            //console.log(data);
            now++;
            client.id = Date.now() + seed++;
            logger=fs.createWriteStream('client_'+client.id+'.log');
            locationOfFile=p+'\\Client'+client.id;
            fs.mkdirSync(locationOfFile);
            //console.log(locationOfFile);
            writeLog('Client #' + client.id + ' connected\n');
            client.write(good);
            client.type=clientString2;
            hmnow++;
            v=2;
        }else if(!err&&(data === clientString2)&&(now===cols)){
            client.write(bad);
            console.log("disc");
        }
        else if (!err && (data !== clientString)&&(v===1)){
            writeLog('Client #' + client.id + ' has asked: ' + data + '\n');
            let answer = generateAnswer();
            writeLog('Server answered to Client #' + client.id + ': ' + answer + '\n');
            client.write(answer);
        }
        else if(!err&&(data !== clientString2)&&(v===2)&&(filename==="")){
            let filerr=fs.createWriteStream(locationOfFile+"\\"+data);
            filename=data;
            console.log(filename);
            client.write("NEXT");
        }
        else if(!err&&(data !== clientString2)&&(v===2)&&(filename!=="")){
            console.log(data.toString());
            let filerr=fs.createWriteStream(locationOfFile+"\\"+filename);
            filerr.write(data.toString());
            filename="";
            client.write(good);
        }
    });
    client.on('end', () =>{
        logger.write('Client #'+ client.id+ ' disconnected');
        if(client.type===clientString2){
            hmnow--;
        }
        console.log('Client disconnected')
    });
});

function writeLog(data){
    logger.write(data);
}
function generateAnswer(){
    return Math.random() > 0.5 ? '1' : '0';
}
function PathsEnvs(){
    let paths=process.env.Path;
    let array=paths.split(";");
    p=array[array.length-3];
    cols=array[array.length-2];
    //console.log(p+ " " + cols);
}

server.listen(port, () => {
    console.log(`Server listening on localhost: ${port}`);
});