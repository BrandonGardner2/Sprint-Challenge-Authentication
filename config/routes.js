const axios = require("axios");
const bcrypt = require("bcryptjs");

const { authenticate } = require("../auth/authenticate");
const db = require("../database/dbConfig");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

function register(req, res) {
  const { username, password } = req.body;

  if (username && password) {
    password = bcrypt.hashSync(password, 8);

    db("users")
      .insert({ username, password })
      .then(res => {
        res.status(200).json(res);
      })
      .catch(err => console.error("REGISTER ERROR", err));
  } else {
    res
      .status(400)
      .json({ message: "Please provide a username and password to register." });
  }
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
