//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Port = 3000;

// creating new app instant using express()
const app = express();

// setting view engine to use ejs for templeting engine //
app.set('view engine', 'ejs');

// Use body parser to pass our request 
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use public directory to store our static files such as images, css code etc. //
app.use(express.static("public"));

// connection to mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Created article schema //
const articleSchema = {
    title: String,
    content: String
};

// Created article mode using mongoose //
const Article = mongoose.model("Article", articleSchema);

// get the details from our server //

app.route("/articles")

.get((req,res) => {
    Article.find((err, foundArticles) => {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post((req,res) => {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if(!err) {
            res.send("successfully send new article");
        } else {
            res.send(err);
         }
});

})

.delete((req,res) => {
    Article.deleteMany((err) => {
        if(!err) {
            res.send("successfully deleted all article");
        } else {
            res.send(err);
        }
    });
});

////// Request Targeting specific Article ///////

app.route("/articles/:articleTitle")


.get((req,res) => {

    Article.findOne({title: req.params.articleTitle},(err, foundArticle) => {
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No article matching that title was found");
        }
    });
})

.put((req,res) => {
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) => {
            if (!err) {
                res.send("successfully update the article");
            }
        }
    );
})

.patch((req,res) => {
    Article.findOneAndUpdate(
        {tilte: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if(!err) {
                res.send("Updated successfully")
            } else {
                res.send(err);
            }
        }

    );
})

.delete((req,res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        err => {
            if(!err) {
                res.send("successfully deleted item")
            } else {
                res.send("error")
            }
        }
    );
});


//TODO 

app.listen(Port, () => {
    console.log("Server started on port ${Port}");
  });
  