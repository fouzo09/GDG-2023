
document.addEventListener("DOMContentLoaded", function(e) {

    const socket = new WebSocket('wss://61xkeobz5h.execute-api.us-east-1.amazonaws.com/dev/');
    const messageInput = document.getElementById("message_input");
    const sendMessageBtn = document.getElementById("send_message_btn");
    const messages = document.getElementById("messages");
   
    (()=>{
        const sender = prompt("Votre pseudo svp");
        localStorage.setItem("sender", sender);
    })();

    

    sendMessageBtn.addEventListener("click", function(e) {
        const messageInputValue = messageInput.value;
        const receiver = prompt("Le pseudo du destinataire");
        const command = {
            action: 'message',
            receiverName: receiver,
            message: messageInputValue
        }
        socket.send(JSON.stringify(command));
        appendContent(messageInputValue);
    });

    socket.addEventListener('open', (event) => {
        const command = {
            action: 'adduser',
            userName: getSender()
        };
        socket.send(JSON.stringify(command));
    });


    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        appendContent(message);
    });
  

    const getSender = ()=>{
        return localStorage.getItem("sender");
    }

    function appendContent(content) {
        const newParagraph = document.createElement('p');
        newParagraph.textContent = content;
        messages.appendChild(newParagraph);
    }
});