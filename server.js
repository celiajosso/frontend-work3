// set up ======================================================================
var http = require("http");
var express = require("express");
var app = express(); // create our app w/ express
var mongoose = require("mongoose"); // mongoose for mongodb
var cors = require("cors");

var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var path = require("path");

var port = 4000;

// configuration ===============================================================
mongoose.connect(
  "mongodb+srv://test:test@cluster0.3kmencf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
  }
); // connect to mongoDB database on modulus.iox

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // set the static files location /public/img will be /img for users

// define model ================================================================
var Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean,
});

// routes ======================================================================
app.use(cors());

// api ---------------------------------------------------------------------
// get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/todos/:todo_id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todo_id);
    res.json(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// create todo and send back all todos after creation
app.post("/api/todos", async (req, res) => {
  try {
    await Todo.create({
      text: req.body.text,
      done: false,
    });
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update a todo (mark as done/undone)
app.put("/api/todos/:todo_id", async (req, res) => {
  try {
    await Todo.findOneAndUpdate(
      { _id: req.params.todo_id },
      { done: req.body.done },
      { new: true }
    );
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// app.put("/api/todos", function (req, res) {});
app.patch("/api/todos", function (req, res) {});

// delete a todo
app.delete("/api/todos/:todo_id", async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.todo_id });
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// application -------------------------------------------------------------
app.get("*", function (req, res) {
  res.sendFile("./public/index.html", { root: __dirname });
});

// listen (start app with node server.js) ======================================
var server = http.createServer(app);
server.listen(app.get("port"), function () {
  console.log(
    "Express server listening on: http://localhost:" + app.get("port")
  );
});
