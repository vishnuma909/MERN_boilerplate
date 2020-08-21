const express = require("../node_modules/express")
const bodyparser = require('../node_modules/body-parser')
const app = express();
const path = require('path')
const cors = require('../node_modules/cors');
require('./mongoose');
const API_PORT = process.env.PORT || '8080';
const routes = require('./routes/index.route')
const passport = require('../node_modules/passport');
require('dotenv').config()
//production
if(process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, 'build/static')));
    app.get("/*", function(req, res) {
        res.sendFile(path.join(__dirname, "build/static", "index.html"));
    });
}
//

app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api/',routes)
app.listen(API_PORT,()=> console.log(`LISTENING ON PORT ${API_PORT}`,`env: ${process.env.NODE_ENV}`))