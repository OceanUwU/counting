const socket = io(); //Make a websocket connection to the server.
const numberDisplay = document.getElementById('number');
const button = document.getElementById('button');

socket.on('update', (number, lastCounter) => { //When a new number is received:
    numberDisplay.innerHTML = number; //Display the new number.
    if (socket.id.startsWith(lastCounter))
        button.setAttribute('disabled', '');
    else
        button.removeAttribute('disabled');
});

button.onclick = () => socket.emit('++');