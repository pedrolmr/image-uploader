const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');

const { authenticate, generateToken } = require('./middlewares');

module.exports = (server) => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/images', authenticate, imageList);
  server.post('/api/images', authenticate, postImage);
};

function register(req, res) {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;

  db('users')
    .insert(creds)
    .then((ids) => res.status(201).json(ids))
    .catch((error) => json(error));
}

function login(req, res) {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}!`, token });
      } else {
        res.status(401).json({ message: 'You are not allowed here!' });
      }
    })
    .catch((error) => res.json(error));
}

function imageList(req, res) {
  db('images')
    .then((image) => res.status(200).json(image))
    .catch((error) => res.status(500).json(error));
}
