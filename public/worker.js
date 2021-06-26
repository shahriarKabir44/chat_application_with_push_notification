self.addEventListener('push', (e) => {
    console.log(e.data.text())
    var dat = JSON.parse(e.data.text())
    self.registration.showNotification(dat.title, {
        body: dat.body,
        icon: 'https://firebasestorage.googleapis.com/v0/b/pqrs-9e8eb.appspot.com/o/167322533_2991921411089144_4216783957994531514_n.jpg?alt=media&token=ca2241fe-eef4-4b44-993c-670d8401afcb',
    })
})