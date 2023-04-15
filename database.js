let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');

const DBSOURCE = "db-tasks.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to SQLite database.')
    db.run(`CREATE TABLE columns (
        db_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text,
        id text
    )`, (err) => {
      if (err) {
        console.log('Table columns already created...')
      }
    })
    db.run(`CREATE TABLE tasks (
        db_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text,
        createdAt text,
        id text,
        columnId text
    )`, (err) => {
      if (err) {
        console.log('Table tasks already created...')
      }
    })
  }
})

module.exports = db
