const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const postsFile = path.join(__dirname, "posts.json");

// Function to read posts.json
const getPosts = () => {
  if (!fs.existsSync(postsFile)) {
    fs.writeFileSync(postsFile, "[]"); // Create empty JSON file if not exists
  }
  return JSON.parse(fs.readFileSync(postsFile, "utf8"));
};

// Home route - Display all blog posts
app.get("/", (req, res) => {
  const posts = getPosts();
  res.render("home", { posts });
});

// Single Post route
app.get("/post", (req, res) => {
  const postId = parseInt(req.query.id);
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return res.status(404).send("Post Not Found");
  res.render("post", { post });
});

// Add Post route (POST)
app.post("/add-post", (req, res) => {
  const posts = getPosts();
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    category: req.body.category,
    image: req.body.image || "default.jpg",
    excerpt: req.body.excerpt,
    content: req.body.content
  };
  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.redirect("/");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
