// server.js (tag: v2)
const express = require('express')
const app = express()
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const port = isProduction ? process.env.PORT : 3000
const publicPath = path.resolve(__dirname, 'dist')

// We point to our static assets
app.use(express.static(publicPath))
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, './dist/index.html'))
})

// And run the server
app.listen(port, function () {
  console.log('Server running on port ' + port)
})
