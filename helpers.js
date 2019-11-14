const urlDatabase = { };
const users = { };

const generateRandomString = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

const urlsForUser = (id) => {
  let validURLs = {};
  // Loop through the database
  for (const url in urlDatabase) {
    // If the url's user_id matches the id of the current user push that url object to validURLS
    if (urlDatabase[url].userID === id) {
      validURLs[url] = urlDatabase[url];
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
};

module.exports = { urlDatabase, users, generateRandomString, urlsForUser, getUserByEmail };