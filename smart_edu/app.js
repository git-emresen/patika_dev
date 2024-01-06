const express = require('express')

const app = express()

app.get('/', (req, res) => {

    res.header('Content-Type', 'text/html')
    res.send('send')
})

const port = 3000
app.listen(port, () => {
    console.log(`App started running on port ${port}`)
})