/* eslint-disable */

const express = require('express');

const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PATCH',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type'
  ]
};
dotenv.config();
app.use(bodyParser.json());
// const { v4: uuidV4 } = require('uuid');

const startSocketServer = require('./socket'); // Socket connection

const authRoutes = require('./routes/authRoutes'); // Routes import
const courseRoutes = require('./routes/courseRoutes'); // Routes import
const userRoutes = require('./routes/userRoutes'); // Routes import

// mongo db connection
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) throw err;
    console.log('\x1b[106m\x1b[30m%s\x1b[0m', ' <<-- DB Connected Successfully -->> ');
  }
);

app.use(cors(corsOpts)); // Allowing all connection from any origin

// app.set('view engine', 'ejs')
// // app.use(express.static('public'))
app.use(express.static(path.resolve(__dirname, './build'))); // For Heroku build, build frontend and replace build folder in server root directory


app.use('/api', authRoutes); // auth routes
app.use('/api', userRoutes); // course routes
app.use('/api', courseRoutes); // course routes


app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
server.listen(process.env.PORT || 5005, () => {
  console.log('\x1b[103m\x1b[30m%s\x1b[0m', ` <<<<<<<--- Listening to port ${process.env.PORT || 5005} --->>>>>>>`);
});

startSocketServer(server);
