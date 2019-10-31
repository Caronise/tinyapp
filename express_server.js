const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const generateRandomString = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

const addUser = (id, email, password) => {
  const newUser = {
    id,
    email,
    password,
  };
  users[id] = newUser;
  return id;
};

const findUser = (email) => {
  for (let userId in users) {
    const currentUser = users[userId];
    if (currentUser.email === email) {
      return currentUser;
    }
  }
  return false;
};

const urlsForUser = (id) => {
  let validURLs = [];
  // Loop through the database 
  for (const key in urlDatabase) {
    // If the url's user_id matches the id of the current user push that url object to validURLS
    if (urlDatabase[key].userID === id) {
      validURLs.push(urlDatabase[key])
    } 
  }
  return validURLs;
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };

  templateVars.urls = urlsForUser(id);

  if (req.cookies["user_id"] !== undefined) {
    res.render("urls_index", templateVars);
  } else {
    res.send('Please register or log in to view the URL list');
  }
});

app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);  
});

app.get('/urls/new', (req, res) => {
  if (req.cookies["user_id"] !== undefined) {
    let templateVars = {
      user: users[req.cookies["user_id"]],
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }  
});

app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_register", templateVars);
});

app.get('/login', (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render('urls_login', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  if (req.cookies["user_id"] !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located in your account");
    return;
  }
  if (req.cookies["user_id"] !== undefined) {
    let templateVars = {
      shortURL: req.params.shortURL,
      url: urlDatabase[req.params.shortURL],
      user: users[req.cookies["user_id"]],
    };
    res.render("urls_show", templateVars);
  } else {
    res.send('Please register or log in to view this short URL');
  }
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { shortURL: shortURL, longURL: req.body.longURL, userID: req.cookies['user_id'] };
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {

  console.log(req.params);
  console.log(req.params.shortURL);

  if (req.cookies["user_id"] !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located in your account");
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  if (req.cookies["user_id"] !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located in your account");
    return;
  }
  urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, userID: req.cookies['user_id'] };
  res.redirect(`/urls`);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(401).send('Invalid entry, try again!');
    return;
  }
  
  if (findUser(email)) {
    res.status(401).send('That email is already in use');
    return;
  }
  const id = generateRandomString();
  addUser(id, email, password);

  res.cookie('user_id', id);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);
  if (!user) {
    res.status(403).send('No User found');
    return;
  }
  if (user.password !== password) {
    res.status(403).send('Invalid Password');
    return;
  }
  res.cookie('user_id', user.id);
  res.redirect(`/urls`);
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id', req.body.password);
  res.redirect('/register');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
          
