var express = require('express')
var webPush = require('web-push')

var app = express()

var port = process.env.PORT || 3000

var http = require('http').createServer(app)

var io = require('socket.io')(http)
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
http.listen(port)
const public_key = 'BJ6uMybJWBmqYaQH5K8avYnfDQf9e-iX3euxlHrd6lh3ZBBPlmE8qYMhjoQCF7XACxgwe_ENW1DFT6nzsgsiaMc'
const private_key = 'eSJlzY26NrET8pybZj5IoUnpnAA4K_jWuDZ5hEy5q5M'

webPush.setVapidDetails('mailto:abc@def.com', public_key, private_key)

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('signup.ejs')
})
app.post('/', (req, res) => {
    var data = req.body
    res.render('index.ejs', data)
})

io.on('connection', socket => {
    socket.on('sendMessage', (data) => {
        socket.broadcast.emit('receiveMessage', data)
    })
    socket.on('addMe', (room, data) => {
        socket.join(room)
        socket.to(room).emit('newGroupMessage', data)
    })
    socket.on('groupMessage', (room, data) => {


        socket.to(room).emit('newGroupMessage', data)
    })
    socket.on('leave', (room, data) => {
        socket.leave(room)
        socket.to(room).emit('newGroupMessage', data)
    })
})


app.post('/subscribe', (req, res) => {
    const subscription = req.body.subscription
    const payload = JSON.stringify({ title: `${req.body.message.senderName} to ${req.body.message.roomName}`, body: req.body.message.body })
    webPush.sendNotification(subscription, payload)
        .catch(err => console.log(err))
    res.status(201).json({})
})