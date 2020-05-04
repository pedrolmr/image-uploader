const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');

const { authenticate, generateToken } = require('./middlewares');

module.exports = (server) => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/images', authenticate, imageList);
  server.post('/api/images', authenticate, validateImage, postImage);
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

function findImageById(id) {
  return db('images').where({ id }).first();
}

async function addImage(image) {
  const [id] = await db('images').insert(image).returning('id');

  return findImageById(id);
}

function validateImage(req, res, next) {
  const { image, description } = req.body;

  if (Object.keys(req.body).length) {
    if (image && description) {
      req.image = {
        ...req.body,
        user_id: req.decoded.subject,
      };
      next();
    } else {
      res.status(428).json({ message: 'missing required field' });
    }
  } else {
    res.status(404).json({ message: 'missing image information' });
  }
}
function postImage(req, res) {
  addImage(req.image)
    .then((image) => {
      res.status(201).json(image);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error could not post image' });
    });
}
