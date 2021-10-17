const express = require('express');
const controllers = require('./controllers');
const path = require('path')
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({})

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// turn on routes
app.use(controllers);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});