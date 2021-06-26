function getel(x) {
    return document.getElementById(x)
}
var socket = io()
//rendering

function renderAGroup(group) {
    var s = ` <div class="groupBlock col-sm-12 col-lg-6">
                <h4 style="text-align: center;">${group.name}</h4>
                <div class="d-flex" style="clear: both;">
                    <button class="btn btn-success" style="float: left;" onclick="joinGroup(${group.id},'${group.name}')" >join</button>
                    <button class="btn btn-danger" style="float: right;" onclick="leaveGroup(${group.id},'${group.name}')">leave</button>
                </div>
                <div class="messageGontainer" id="groupMessageContainer${group.id}">
                    
                </div>
                <div class="formContainer d-flex">
                    <input autocomplete="false" class="messageForm" id="inputMessage${group.id}" type="text">
                    <button class="btn btn-primary sendMessageBtn" onclick="sendMessage(${group.id},'${group.name}')">Send!</button>
                </div>
            </div>`
    getel('groupContainer').innerHTML += s
}

function renderAMessage(message) {
    var s = ``
    if (message.senderName == myName) {
        s = `<div class="message isent">
                <div>${message.body}</div>
            </div>`

    }
    else {
        s = ` 
            <div class="message usent">
                <span class="sender">
                    <p>${message.senderName}</p>
                </span>
                <div>${message.body}</div>
            </div>`
    }
    getel(`groupMessageContainer${message.receiverID}`).innerHTML += s
}



renderAGroup({
    name: "Python",
    id: 1
})
renderAGroup({
    name: "JavaScript",
    id: 2
})
renderAGroup({
    name: "C++",
    id: 3
})

//rendering end


//event handlers
function leaveGroup(id, name) {
    var newMessage = {
        body: `${myName} has left!`,
        senderName: myName,
        receiverID: id,
        groupName: name
    }
    socket.emit('leave', name, newMessage)
    renderAMessage(newMessage)
}
function joinGroup(id, name) {
    var newMessage = {
        body: `${myName} has joined!`,
        senderName: myName,
        receiverID: id,
        groupName: name
    }
    socket.emit('join', name, newMessage)
    renderAMessage(newMessage)
}

function sendMessage(id, name) {
    var newMessage = {
        body: getel(`inputMessage${id}`).value,
        senderName: getel(`myName`).value,
        receiverID: id,
        groupName: name
    }
    socket.emit('newMessage', name, newMessage)
    renderAMessage(newMessage)
}

//event handlers end


// socket receivers
socket.on('groupMessage', data => {
    renderAMessage(data)
})
//socket receivers end