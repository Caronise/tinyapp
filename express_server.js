const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { urlDatabase, users, generateRandomString, addUser, urlsForUser, getUserByEmail } = require('./helpers');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: [
    '7de13381-61b5-47aa-9c74-5ede1ceac390',
    '8dddb6db-4d8d-4571-a836-04fa8d5a9186',
  ],
}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// If user is logged in redirect to urls page, else redirect to login page.
app.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls")
  } else {
    res.redirect("/login")
  }
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// This route shows the urls to the user, if the user is not registered he will be prompted to register or log in
app.get('/urls', (req, res) => {
  const userUrls = urlsForUser(req.session.user_id);
  const templateVars = {
    urls: userUrls,
    user: users[req.session.user_id]
  };
  if (req.session.user_id !== undefined) {
    res.render("urls_index", templateVars);
  } else {
    res.send('Please register or log in to view the URL list');
  }
});

// This route renders the page so a user can create a new tinyURL
app.get('/urls/new', (req, res) => {
  if (req.session.user_id !== undefined) {
    let templateVars = {
      user: users[req.session.user_id],
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// This route renders the edit page so a user can edit his short URLS, or view the shortURL after creation
app.get('/urls/:shortURL', (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located in your account");
    return;
  }
  if (req.session.user_id !== undefined) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id],
    };
    res.render("urls_show", templateVars);
  } else {
    res.send('Please register or log in to view this short URL');
  }
});

// This route renders the registration page so users can register
app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
  };
  res.render("urls_register", templateVars);
});

// This route renders the login page so users can login
app.get('/login', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_login', templateVars);
});

// 
app.post('/urls/:shortURL', (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located in your account");
    return;
  }
  urlDatabase[req.params.shortURL] = {
    shortURL: req.params.shortURL,
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls`);
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    shortURL,
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located in your account");
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(401).send('Invalid username / password, try again!');
    return;
  }
  if (getUserByEmail(email, users)) {
    res.status(401).send('That email is already in use');
    return;
  }
  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  addUser(id, email, hashedPassword);
  req.session.user_id = id;
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!getUserByEmail(email, users)) {
    res.status(403).send('You\'ve entered an incorrect email. Please try again');
    return;
  }
  const safePassword = bcrypt.compareSync(password, getUserByEmail(email, users).password);
  if (!safePassword) {
    res.status(403).send('Invalid Password');
    return;
  }
  req.session.user_id, getUserByEmail(email, users).id;
  res.redirect(`/urls`);
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/register');
});

