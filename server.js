const net = require('net');
const fs = require('fs');
const port = 8124;
const clientString = 'QA';
const clientString2='FILES';
const good = 'ACK';
const bad = 'DEC';
let locationOfFile='D:\\';
let logger = fs.createWriteStream('client_id.log');

let seed = 0;

const server = net.createServer((client) => {
    console.log('Client connected');
    client.setEncoding('utf8');

    client.on('data', (data, err) =>
    {
        let v=0;
        if (err) console.error(err);
        else if (!err && data === clientString)
        {
            client.id = Date.now() + seed++;
            logger=fs.createWriteStream('client_'+client.id+'.log');
            writeLog('Client #' + client.id + ' connected\n');
            client.write(data === clientString ? good : bad);
            v=1;
        }
        else if (!err && (data !== clientString)&&(v===1)) {
            writeLog('Client #' + client.id + ' has asked: ' + data + '\n');
            let answer = generateAnswer();
            writeLog('Server answered to Client #' + client.id + ': ' + answer + '\n');
            client.write(answer);
        }else if(!err&&data === clientString2)
        {
            client.id = Date.now() + seed++;
            logger=fs.createWriteStream('client_'+client.id+'.log');
            locationOfFile=locationOfFile+'/Client'+client.id;
            fs.mkdir(locationOfFile);
            writeLog('Client #' + client.id + ' connected\n');
            client.write(data === clientString ? good : bad);
            v=2;
        }else if(!err&&(data !== clientString2)&&(v===2))
        {
            writeLog('Client #' + client.id + ' sended: ' + data + '\n');
            let answer='completed';
            client.write(answer);
        }
    });
    client.on('end', () =>
    {
        logger.write('Client #'+ client.id+ ' disconnected');
        console.log('Client disconnected')
    });
});
function writeLog(data)
{
    logger.write(data);
}
function generateAnswer()
{
    return Math.random() > 0.5 ? '1' : '0';
}
server.listen(port, () => {
    console.log(`Server listening on localhost: ${port}`);
});