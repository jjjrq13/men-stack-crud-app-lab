// ------------- PACKAGES -------------
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');

// ------------- ACTIVATE -------------
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const Plants = require('./models/plants');

//------------- ROUTES -------------

app.get('/', (req, res) => {
    try {
        res.render('home.ejs');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

app.get('/plants', async (req, res) => {
    try {
        const plants = await Plants.find();
        res.render('index.ejs', {
            plants: plants,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

app.get('/plants/new', async (req, res) => {
    res.render('new.ejs');
});

app.post('/plants/new', async (req, res) => {
    try {
        await Plants.create(req.body);
        console.log(Plants);

        res.redirect('/plants/');
    } catch (error) {
        console.log(error);
        res.redirect('/plants');
    }
});

app.get('/plants/:plant_id', async (req, res) => {
    try {
        const currentPlant = await Plants.findById(req.params.plant_id);

        res.render('show.ejs', {
            plant: currentPlant,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/plants');
    }
});

app.get('/plants/:plant_id/edit', async (req, res) => {
    try {
        const currentPlant = await Plants.findById(req.params.plant_id);
        res.render('edit.ejs', {
            plant: currentPlant,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/plants');
    }
});

app.put('/plants/:plant_id', async (req, res) => {
    try {
        const currentPlant = await Plants.findById(req.params.plant_id);

        currentPlant.set(req.body);

        await currentPlant.save();

        res.redirect('/plants');
    } catch (error) {
        console.log(error);
        res.redirect('/plants');
    }
});

app.delete('/plants/:plant_id', async (req, res) => {
    try {
        await Plants.findById(req.params.plant_id).deleteOne();

        res.redirect(`/plants`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

app.listen(3000, () => console.log(`Express is running on port 3000`));
