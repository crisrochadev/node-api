const express = require('express');
const cors = require('cors');
const router = require('./routes');
const dotenv = require('dotenv');
const notFound = require('./middleware/not_found.js');
const cookieParser = require("cookie-parser");

dotenv.config()

const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: process.env.FRONT_URL,
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use(notFound)


app.listen(PORT, () => {
    console.log(`aplicação rodando em http://localhost:${PORT}`,)
})