let express = require('express')
let app = express()
let db = require('./database')
let bodyParser = require('body-parser')
let cors = require('cors')

app.use(cors())
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
  let sqlColumn = `SELECT * FROM columns ORDER BY db_id DESC`
  let sqlTasks = `SELECT * FROM tasks ORDER BY db_id DESC`
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

      const data = []
      columnData.forEach((col, index) => {
        data.push({
          id: col.id,
          title: col.title,
          tasks: []
        })

        taskRows.forEach(task => {
          if (task.columnId === col.id) {
            data[index].tasks.push({
              title: task.title,
              id: task.id,
              createdAt: task.createdAt
            })
          }
        })
      })

      res.json({
        message: "success",
        data: data
      })
    })
  })
})

app.post('/api/tasks/', async (req, res, next) => {
  let errors = []
  if (req.body.length === 0) {
    errors.push('No Column specified')
  } else {
    clearDB();

    if (req.body.length > 0) {
          const data = req.body
          const colSql = `INSERT INTO columns (title, id) VALUES(?,?)`;
          const taskSql =`INSERT INTO tasks (title, id, createdAt, columnId) VALUES(?,?,?,?)`;

          data.forEach(cols => {
            db.run(colSql, [cols.title.toString(), cols.id.toString()], () => {
              cols.tasks.forEach(task => {
                db.run(taskSql, [task.title.toString(), task.id.toString(), task.createdAt.toString(), cols.id.toString()])
              })
            })
          })
        }

    res.status(200).json({message: 'done'})
  }
})
app.use((req, res) => {
  res.status(404)
})


function clearDB() {
  let clearColsSql = `DELETE FROM columns`
  let clearTasksSql = `DELETE FROM tasks`
  let vacuumSql = ` VACUUM`
  db.run(clearColsSql, [])
  db.run(clearTasksSql, [])
  db.run(vacuumSql, [])
}
