import express from 'express'
import { pool } from './DBpg.js'
import { Port } from './config.js'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Cambia a tu dominio
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.get('/main', async(req, res)=>{
  const search = req.query.food
  const page = parseInt(req.query.page) || 0

  const startPage = page * 16
  const endPage = startPage + 16

  const data = await pool.query(`SELECT * FROM alimento WHERE alimento.nombre ilike $1`, [`%${search}%`]);
  const pageData = data.rows.slice(startPage, endPage)

  res.json(pageData)

})

app.listen(Port);
console.log("Server in port", Port);