const fs = require('fs');
const crypto = require('crypto');

// Utility: Read users from JSON
function readUsers() {
  try {
    return JSON.parse(fs.readFileSync('users.json'));
  } catch {
    return [];
  }
}

// Utility: Write users to JSON
function writeUsers(users) {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 4));
}

// Hash function
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// AUTH FUNCTIONS

function authorize(action, username, password) {
  if (!username || !password) {
    return { success: false, status: 400, message: 'Username and password are required' };
  }

  const users = readUsers();

  if (action === 'register') {
    const exists = users.some(u => u.username === username);
    if (exists) {
      return { success: false, status: 400, message: 'Username already exists' };
    }

    const hashed = hashPassword(password);
    users.push({ username, password: hashed, rating: 600 });
    writeUsers(users);

    return { success: true, status: 200, message: 'Registered', redirect: '/dashboard' };
  }

  if (action === 'login') {
    const user = users.find(u => u.username === username);
    const hashed = hashPassword(password);
    if (user && user.password === hashed) {
      return { success: true, status: 200, message: 'Login successful', redirect: '/dashboard' };
    } else {
      return { success: false, status: 401, message: 'Invalid credentials' };
    }
  }

  return { success: false, status: 400, message: 'Invalid action' };
}

function changePassword(username, newPass, confirmPass) {
  if (!username || !newPass || !confirmPass) {
    return { success: false, status: 400, message: 'All fields are required.' };
  }

  if (newPass !== confirmPass) {
    return { success: false, status: 400, message: 'Passwords do not match.' };
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return { success: false, status: 404, message: 'Username not found.' };
  }

  const hashed = hashPassword(newPass);
  user.password = hashed;
  writeUsers(users);

  return { success: true, status: 200, message: 'Password updated', redirect: '/signup?message=Password updated successfully. Please log in.' };
}

function signout() {
  return { success: true, redirect: '/signup?message=Signed Out' };
}

module.exports = {
  authorize,
  changePassword,
  signout,
};
