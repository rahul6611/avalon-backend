const express = require('express');
const app = express();
require("./config/db")
// const indexRouters = require('./routes/indexRoutes');
const PORT = 3000;
const cors = require('cors');
const morgan = require('morgan')

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use('/', indexRouters);
app.get('/', async (req, res) => {
    res.send('Welcome To Avalon App')
})

// server is running on ...
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});