const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const db = 'mongodb+srv://Gaukhar1188:Somepsw123$@cluster0.sdtomsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const Portfolio = require('./models/portfolio');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const data = { title: 'Main Page' };
//const data2 = { title: 'Portfolio' };
const data3 = { title: 'Contact' };
const data4 = { title: 'Main Page' };
const data5 = { title: 'Admin page' };

app.get('/', (req, res) => res.render('main_page', data));
//app.get('/work', (req, res) => res.render('work', data2));
app.get('/contact', (req, res) => res.render('contact', data3));
app.get('/main_page', (req, res) => res.render('main_page', data4));
app.get('/add_portfolio', (req, res) => res.render('addNew', data5));


app.get('/work', async (req, res) => {
  try {
      const portfolios = await Portfolio.find();
      res.render('work', { title: 'Portfolio', portfolios }); 
  } catch (err) {
      console.log(err);
      res.status(500).send('Error fetching portfolio items');
  }
});

app.get('/project/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const portfolio = await Portfolio.findById(projectId);

    if (!portfolio) {
      return res.status(404).send('Project not found');
    }

    res.render('project_details', { title: 'Project Details', portfolio });
  } catch (err) {
    console.error('Error fetching project details:', err); 
    res.status(500).send('Error fetching project details');
  }
});




app.post('/add-portfolio', async (req, res) => {
  const { title, description, image } = req.body;

  const portfolio = new Portfolio({ title, description, image });

  try {
    const result = await portfolio.save();
    console.log("Portfolio is saved:", result);
    res.redirect('/work'); 
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving portfolio');
  }
});

mongoose.connect(db)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.log('DB connection error:', err));
