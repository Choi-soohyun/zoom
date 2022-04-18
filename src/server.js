import express from 'express';

const app = express();

// view
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

// static
app.use('/public', express.static(__dirname + '/public'));

// router
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen)