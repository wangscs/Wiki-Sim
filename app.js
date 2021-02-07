const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String, 
  content: String, 
}

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function(req, res){
  Article.find({}, function(err, foundResults){
    if(!err){
      res.send(foundResults);
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});