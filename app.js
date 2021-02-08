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

/************************ Routes for ALL Articles*****************************/
app.route("/articles")

  .get(function(req, res){
    Article.find({}, function(err, foundResults){
      if(!err){
        res.send(foundResults);
      } else {
        console.log(err);
      }
    });
  })

  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res){
    Article.deleteMany({}, function(err){
      if(!err){
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

/************************ Routes for Specific Article*************************/
app.route("/articles/:articleTitle")
  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(!err){
        if(foundArticle){
          res.send(foundArticle);
        } else {
          res.send("No articles matching params were found.")
        }
      } else {
        console.log(err);
      }
    });
  })
  /**
   * Put requests REPLACES the entire resource so conditions must include all
   * parameters for the document. 
   */
  .put(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content}, 
      {overwrite: true}, 
      function(err){
      if(!err){
        res.send("Successfully updated article");
      } else {
        res.send(err);
      }
    })
  })
  /**
   * Patch request only replaces the part of the document that is 
   * specified while keeping the other parts of the document 
   * untouched.
   */
  .patch(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article by patching.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
      if(!err){
        res.send("Article successfully deleted");
      } else {
        res.send(err);
      }
    })
  });

app.listen(3000, function(){
  console.log("Server started on port 3000");
});