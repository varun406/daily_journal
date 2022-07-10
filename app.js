//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Write what you feel ,what you want to do, what you want to achieve & what you did on daily basis.";
const aboutContent =
  "This is Daily Journal in which you can write about yourself and daily achievements";
const contactContent = "Contact Us on dailyjournal46@gmail.com";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  // mongoose schema
  title: String,
  content: String,
};

const Post = new mongoose.model("Post", postSchema); //mongoose model ,model name in database will be posts

app.get("/", function (req, res) {
  // This is triggered when we take getRequest of particular pg.

  Post.find({}, function (err, posts) {
    // this is confusing , we have retrieve the posts document from mongodb & forwarded to route page
    res.render("home", { homeDescription: homeStartingContent, posts: posts }); //the page shouldn`t be end with extension (.ejs) & placed inside the views folder.
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutDescription: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactDescription: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, foundPost) {
    res.render("post", { title: foundPost.title, content: foundPost.content });
  });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postDescription,
  });

  post.save(function (err) {
    if (err) {
      console.log("Something went wrong: " + err.message);
    }
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
