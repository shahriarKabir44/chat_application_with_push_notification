function getel(x) {
    return document.getElementById(x)
}

//rendering
function renderGroupChatComponent(group) {
    var s = `
    <div class="col-sm-12  col-lg-6">
        <h4 style="text-align: center">${group.name}</h4>
        <div class="container" style="width:inherit;clear:both">
            <button style="float:left; " type="button" class="btn btn-info" onclick="joinRoom(${group.id},'${group.name}')" >Join room</button>
            <button style="float:right; " type="button" class="btn btn-danger" onclick="leaveRoom(${group.id},'${group.name}')" >Leave room</button>
        </div>
        <div id="demo${group.id}" class="colp" >
        <div class="f messageBar" id="messageContainer${group.id}">
  	 
       
     
        </div>
            <input type="text" id="messageText${group.id}" style="width:80%">
            <button type="submit" onclick="sendMessage(${group.id},'${group.name}')" class="btn btn-info" style="width:19%"  >send!  </button>
         
        </div>
    </div>`
    getel('root').innerHTML += s

}

function renderMessage(message) {
    var par = getel(`messageContainer${message.receiverId}`)
    par.innerHTML
    var s = ``
    if (message.senderName == getel('myName').value) {
        s = `<div class="message ">
              <div class="isent"> ${message.body}</div>
            </div>`
    } else s = `<div class="message ">
                   <span class="sender">${message.senderName}</span>
                   <br>
                  <div class="usent"> ${message.body}</div>
                </div>`
    par.innerHTML += s
}
renderGroupChatComponent({
    id: 1,
    name: "Python"
})
renderGroupChatComponent({
    id: 2,
    name: "JavaScript"
})
renderGroupChatComponent({
    id: 3,
    name: "C++"
})
//rendering end

//event handlers

//event handlers end
function leaveRoom(id, name) {
    var newMessage = {
        receiverId: id,
        body: `${getel('myName').value} has left!`,
        senderName: getel('myName').value,
        roomName: name
    }

    socket.emit('leave', name, newMessage)
    renderMessage(newMessage)
}
function sendMessage(id, name) {
    var newMessage = {
        receiverId: id,
        body: getel(`messageText${id}`).value,
        senderName: getel('myName').value,
        roomName: name
    }
    socket.emit('groupMessage', name, newMessage)
    renderMessage(newMessage)

}
function joinRoom(id, name) {
    var newMessage = {
        receiverId: id,
        body: `${getel('myName').value} has joined!`,
        senderName: getel('myName').value,
        roomName: name
    }
    socket.emit('addMe', name, newMessage)
    renderMessage(newMessage)
}


//socket handling 
socket.on('newGroupMessage', data => {
    f(data)
    renderMessage(data)
})

//socket handling end



const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc'
function f(messageData) {
    if (navigator.serviceWorker) {
        send(messageData).catch(er => { console.log(er) })
    }
}


async function send(messageData) {

    const register = await navigator.serviceWorker.register('worker.js', {
        scope: '/',
    })

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertToUnit8Array(public_key),
    })
    var mergedData = {
        subscription: subscription,
        message: messageData
    }
    await fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mergedData)
    })

}

/**
 * 
 * @param {string} base64str 
 */
function convertToUnit8Array(base64str) {
    const padding = '='.repeat((4 - (base64str.length % 4)) % 4)
    const base64 = (base64str + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    var outputArray = new Uint8Array(rawData.length)
    for (let n = 0; n < rawData.length; n++) {
        outputArray[n] = rawData.charCodeAt(n)
    }
    return outputArray
}