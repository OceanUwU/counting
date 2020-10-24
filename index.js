const fs = require('fs');
const numberSave = './public/number.json'; //The path of the file where the number is stored
var number = fs.existsSync(numberSave) ? require(numberSave) : 0; //If there is a file with the previous number saved, use that as the starting number. Otherwise, use 0.
var firstChars = 3; //The number of characters to take from the start of a socket id to send to the clients.
var lastCounter = '.'.repeat(firstChars); //A variable to store the last person to count. Start it with something which will never match

const io = require('socket.io').listen( //Start a socket.io server which listens on...
    require('express')() //...an express server, which...
    .use(require('express').static('./public')) //...serves files from the public directory...
    .listen(require('./port'), () => console.log('Server is up!')) //...and listens on the port configured in the port file.
);

const update = obj => obj.emit('update', number, lastCounter); //Function to tell (a) socket(s) the current number: emit the number and the last person to count to the client(s).

io.on('connect', socket => { //When a client connects:
    update(socket); //Tell it the current number.

    socket.on('++', () => { //When a client attempts to count up:
        if (socket.id.startsWith(lastCounter)) return; //If the last client to count is the same client which is now attempting to count, block the attempt.
        lastCounter = socket.id.slice(0, firstChars); //Save the first few characters of the socket's id to remember which client to block.
        fs.writeFileSync(numberSave, ++number); //Increment the number, and write it to a file.
        update(io); //Tell all the clients the new number.
    });
});