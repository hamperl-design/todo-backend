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
      } else {
        let insert = `INSERT INTO columns (title, id) VALUES (?,?)`
        db.run(insert, ["Backlog", "EpVhAaWDFWYSbfS_Pfoja"])
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
      } else {
        let insert = `INSERT INTO tasks (title, id, createdAt, columnId) VALUES (?,?,?,?)`
        db.run(insert, ['First Task', 'gEwFJHYGVoY_-S6QUSFXn', '2023-04-14T08:19:15.870Z', 'EpVhAaWDFWYSbfS_Pfoja'])
        db.run(insert, ['Second Task', 'hEwFJHYGVoY_-S6QUSFFn', '2023-04-14T08:20:15.870Z', 'EpVhAaWDFWYSbfS_Pfoja'])
      }
    })
  }
})

module.exports = db
