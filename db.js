// Simple in-memory database replacement for better-sqlite3
const users = new Map();

module.exports = {
  getUserLang: (userId) => {
    return users.get(userId) || null;
  },
  setUserLang: (userId, lang) => {
    if (lang === null || lang === undefined) {
      users.delete(userId);
    } else {
      users.set(userId, lang);
    }
  }
};
