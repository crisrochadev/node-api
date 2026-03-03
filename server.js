const express = require('express');
const cors = require('cors');
const router = require('./routes');
const dotenv = require('dotenv');
const notFound = require('./middleware/not_found.js');
const session = require('express-session')

dotenv.config()

const PORT = process.env.PORT;
const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.SECURE, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}))

app.use(cors())
app.use(express.json())
app.use(router)
app.use(notFound)


app.listen(PORT, () => {
    console.log(`aplicação rodando em http://localhost:${PORT}`,)
})