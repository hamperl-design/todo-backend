let express = require('express')
let app = express()
let db = require('./database')
let bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const HTTP_PORT = 8081;

app.listen(HTTP_PORT, () => {
  console.log('Server is up and listen to %PORT%'.replace('%PORT%', HTTP_PORT))
});

app.get('/', (req, res, next)=> {
  res.json({message: 'OK'})
});
app.get('/api/tasks/', (req, res, next) => {
  let sqlColumn = `SELECT * FROM columns`
  let sqlTasks = `SELECT * FROM tasks`
  let params = []

  let columnData = []
  let taskData = []

  db.all(sqlColumn, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message})
      return;
    }
    columnData = [...rows]
    db.all(sqlTasks, params, (err, taskRows) => {
      if (err) {
        res.status(400).json({"error": err.message})
        return;
      }
      taskData = [...taskRows]

      const finalObj = rows.map(col => {
        return {
          id: col.id,
          title: col.title,
          tasks: taskRows.map(task => {
            return task.columnId === col.id ? {
              title: task.title,
              id: task.id,
              createdAt: task.createdAt
            } : {}
          })
        }
      })

      res.json({
        message: "success",
        data: finalObj
      })
    })
  })
})

app.post('/api/tasks/', async (req, res, next) => {
  let errors = []
  if (req.body.length === 0) {
    errors.push('No Column specified')
  } else {
    // Clear Tables
    let clearSql = `DELETE FROM columns; DELETE FROM tasks; VACUUM;`
    await db.run(clearSql, [], (err) => {
      if (err) {
        res.status(400).json({error: err.message})
        return;
      }
    })

    console.log(req.body)

    req.body.forEach(item => {
      let columnSql = `INSERT INTO columns (title, id) VALUES(?,?)`
      let columanParams = [item.title.toString(), item.id.toString()]

      db.run(columnSql, columanParams, (err, colResult) => {
        if (err) {
          res.status(400).json({"error": err.message})
          return;
        }
      })

      if (item.tasks.length > 0) {
        item.tasks.forEach(taskItem => {
          let taskSql = `INSERT INTO tasks (title, id, createdAt, columnId) VALUES(?,?,?,?)`
          let taskParmas = [taskItem.title.toString(), taskItem.id.toString(), taskItem.createdAt.toString(), item.id.toString()]

          db.run(taskSql, taskParmas, (err, result) => {
            if (err) {
              res.status(400).json({"error": err.message})
              return;
            }
          })
        })
      }

    })


    res.status(200).json({message: 'done'})

  }


})
app.use((req, res) => {
  res.status(404)
})
