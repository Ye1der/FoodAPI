import express from 'express'
import { pool } from './DBpg.js'
import { Port } from './config.js'
import fs from 'fs'

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

app.get('/agregarTabla', async(req, res) => {
  try {
    const result = await pool.query('CREATE TABLE alimento (id_alimento serial NOT NULL constraint pk_alimento primary key, nombre character varying(100) NULL, calorias numeric(5, 1) NULL, proteinas numeric(4, 1) NULL, carbohidratos numeric(4, 1) NULL, grasas numeric(4, 1) NULL)')
    res.json(result.rows[0])
  } catch (error) {
    console.error(error);
  }
})

app.get('/pushData', async (req, res) => {

  try {
    const data = await fs.readFile('alimentos.json', 'utf8')
    const alimentos = JSON.parse(data)

    alimentos.array.forEach(async (element) => {
      await pool.query(`insert into alimento(nombre, calorias, proteinas, carbohidratos, grasas) values(${element.nombre}, ${parseInt(element.calorias)}, ${parseInt(element.proteinas)}, ${parseInt(element.carbohidratos)}, ${parseInt(element.grasas)});`)

    });
    
  } catch (error) {
    console.error(error)
  }



})

app.listen(Port);
console.log("Server in port", Port);