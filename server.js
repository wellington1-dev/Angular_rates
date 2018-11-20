//express
const express = require('express');
const app = express();

//body-parser

const bodyParser = require('body-parser');
// configure body-parser to read JSON
app.use(bodyParser.json());

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public/dist/public'));
//changing the Welcome To mean stack assignment, you'll need to go to app folder and inside, you'll be able to check the app.component.ts



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myCake');
// ----------------------------------------------------------------------------------------------------------------------------
var RateSchema = new mongoose.Schema({
    stars: Number,
    opinion: String,

}, {
        timestamps: true
    });

mongoose.model('Rate', RateSchema); // We are setting this Schema in our Models as 'User' Registering Model
var Rate = mongoose.model('Rate')

// --------------------------------------------------------------------------------------------------------------------------

var CakeSchema = new mongoose.Schema({
    name: String,
    description: String,
    url: String,
    rating: [RateSchema]

}, {
        timestamps: true
    });

mongoose.model('Cake', CakeSchema); // We are setting this Schema in our Models as 'User' Registering Model
var Cake = mongoose.model('Cake')

// ------------------------------------------------------------------------------------------------------------------------




app.get('/cakes', function (req, res) {
    //GET: Retrieve all Tasks
    // Task.create({ title: "test", description: "test", url: "test" }, function (err) { })
    Cake.find({}, function (err, cakes) {
        if (err) {
            console.log('There was an error 11')
        }
        res.json(cakes)
    })
})


app.get('/cakes/:id', function (req, res) {
    //GET: Retrieve a Task by ID
    Cake.findOne({
        _id: req.params.id
    }, function (err, cakes) {
        if (err) {
            console.log('There was an error 22')
        }
        res.json(cakes)
    })
})

app.post('/cakes', (req, res) => {
    //POST: Create a Task
    const cake_inst = new Cake();
    cake_inst.name = req.body.name;
    cake_inst.description = req.body.description;
    cake_inst.url = req.body.url;
    cake_inst.save(function (err) {
        if (err) {
            console.log("there is an error 33")
        } else {
            console.log("POST DATA", req.params);
            res.json(cake_inst)
        }
    })
})

//PUT: Update a Task by ID
app.put('/update/:id', function (req, res) {
    Cake.update({ _id: req.params.id }, { $set: { name: req.body.title, description: req.body.description, url: req.body.url } }, function (err, data) {
        if (err) {
            console.log('Something Went Wrong-display');
        } else {
            console.log("It worked, record deleted:");
            res.json(data);
        }
    })
})
app.delete('/cakes/:id', function (req, res) {
    Cake.deleteOne({
        _id: req.params.id
    }, function (err) {
        if (err) {
            console.log("We have an error!", err);
            res.redirect('new');
        } else {
            res.json('cakes');
        }
    })
})

// ----------------------------------------------------------------------------------------------------------------------------------
// Rating routes

app.get('/rates', function (req, res) {
    //GET: Retrieve all Tasks
    // Task.create({ title: "test", description: "test", url: "test" }, function (err) { })
    Rate.find({}, function (err, rates) {
        if (err) {
            console.log('There was an error 1')
        }
        res.json(rates)
    })
})


app.get('/rates/:id', function (req, res) {
    //GET: Retrieve a Task by ID
    Rate.findOne({
        _id: req.params.id
    }, function (err, rates) {
        if (err) {
            console.log('There was an error 2')
        }
        res.json(rates)
    })
})

app.post('/rates/:id', (req, res) => {
    //creating a field inide of an existed object(field).
    console.log(req.params.id, req.body)
    const rate_inst = new Rate();
    rate_inst.stars = req.body.stars;
    rate_inst.opinion = req.body.opinion;
    rate_inst.save(function (err) {
        if (err) {
            console.log("there is an error 3")
        } else {
            Cake.findOne(
                { _id: req.params.id },
                function (err, cake_inst) {
                    cake_inst.rating.push(rate_inst)
                    cake_inst.save(function () {
                        res.json(rate_inst)
                    })
                }
            )
            // find cake by req.params
            // cakeinstance.rating.push(rate_instance)
            // cakeinstance.save(function() {   })


        }
    });
})

//PUT: Update a Task by ID
app.put('/update/:id', function (req, res) {
    Rate.update({ _id: req.params.id }, { $set: { name: req.body.stars, opinion: req.body.opinion } }, function (err, data) {
        if (err) {
            console.log('Something Went Wrong-display');
        } else {
            console.log("It worked, record deleted:");
            res.json(data);
        }
    })
})
app.delete('/rates/:id', function (req, res) {
    Rate.deleteOne({
        _id: req.params.id
    }, function (err) {
        if (err) {
            console.log("We have an error!", err);
            res.redirect('new');
        } else {
            res.json('rates');
        }
    })
})

app.listen(8000, function () {
    console.log("listening on port 8000");
})