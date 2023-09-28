const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require('method-override');

const port = process.env.PORT || 5000

//set templating engine
app.set('view engine', 'ejs');


//MIDDLEWARE
//Middleware for serving static files
app.use(express.static('public'));

//Middleware for body-parser

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


//parse application/json
app.use(bodyParser.json());

//Middleware for methodOverride
app.use(methodOverride('_method'))


//Database URL
const url = process.env.dbUrl

//Connecting app with database
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("MongoDB Connected"))
.catch((err)=>console.log(err))


//Import the Diary Model
const Diary = require("./models/Diary");


//ROUTING

//Route for GET /
app.get('/',(req, res)=>{
    res.render('Home');
});

//Route for /about
app.get('/about',(req, res)=>{
    res.render('About');
});

//Route for Diary page
app.get('/diary',(req, res)=>{
    Diary.find().then(data=>{
        res.render('Diary',{ data:data });
    }).catch(err=>console.log(err))
});

//Route for diary details
app.get('/diary/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Page', { data: data });
    })
        .catch(err => console.log(err));
})


//Route for Add
app.get('/add',(req,res)=>{
    res.render('Add');
});

//Route for add-to-diary
app.post("/add-to-diary",(req, res)=>{
    //savethe data to database
    const Data = new Diary({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    });

    Data.save().then(()=>{
        res.redirect('/diary');
    }).catch(err=>console.error(err));
});

//Route for edit page
app.get('/diary/edit/:id', async (req, res)=>{
    await Diary.findOne({
        _id: req.params.id
    }).then((data)=>{
        res.render('Edit', { data:data });
    }).catch(err=>console.log(err));
});

//Route for editting data
app.put('/diary/edit/:id',async (req, res)=>{
   await  Diary.findOne({
        _id:req.params.id
    }).then( async (data)=>{
        data.title = req.body.title
        data.description = req.body.description
        data.date = req.body.date

        await data.save().then(()=>{
            res.redirect('/diary')
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})


//Route for deleting a collection
app.delete('/diary/delete/:id',async (req, res)=>{
    await Diary.deleteOne({
        _id: req.params.id
    }).then(()=>{
        res.redirect('/diary')
    }).catch(err => console.log(err))
})


app.listen(port, ()=>console.log(`Server is running on ${port}...`));