const express  = require('express')
const path  = require('path')
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')

const app = new express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/', indexRoutes)
try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
} catch(e) {
    console.log(e)
    process.exit(1)
}
