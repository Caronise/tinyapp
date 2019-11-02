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

const urlsForUser = (id) => {
  let validURLs = [];
  // Loop through the database
  for (const key in urlDatabase) {
    // If the url's user_id matches the id of the current user push that url object to validURLS
    if (urlDatabase[key].userID === id) {
      validURLs.push(urlDatabase[key]);
    }
  }
  return validURLs;
};

const getUserByEmail = function(email, users) {
  for (let userId in users) {
    const currentUser = users[userId];
    if (currentUser.email === email) {
      return currentUser;
    }
  }
  return false;
};

module.exports = { urlDatabase, users, generateRandomString, addUser, urlsForUser, getUserByEmail };