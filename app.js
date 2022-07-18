//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//mongoose connect
mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})


const Article = mongoose.model("Article",articleSchema);



app.route("/articles")
    .get((req,res)=>{
        Article.find({},(err,foundArticles)=>{
            if(err){
                res.send(err);
            }else{
                res.send(foundArticles);
            }
        })
    })
    .post((req,res)=>{
      const aarticle = new Article({
        title: req.body.title,
        content: req.body.content
      })
      aarticle.save((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send("Article successufuly added.")
        }
      })
    })
    .delete((req,res)=>{
        Article.deleteMany({},(err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Successufuly deleted all articles.")
            }
        })
    })
    

    
app.route("/articles/:title")
    .get((req,res)=>{
        Article.findOne({title:req.params.title},(err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("No matching article found");
            }
        })
    })
    .put((req,res)=>{
        Article.updateOne({title:req.params.title},{title:req.body.title,content:req.body.content},(err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Successufuly updated article with the title "+req.params.title)
            }
        })
    })
    .patch((req,res)=>{
        Article.updateOne({title:req.params.title},{$set:req.body},(err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Successufuly updated article with the title "+req.params.title)
            }
        })
    })
    .delete((req,res)=>{
        Article.deleteOne({title:req.params.title},(err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Successufuly deleted article with the title "+req.params.title)
            }
        })
    })

app.listen(3000, function() {
  console.log("Server started on port 3000");
});