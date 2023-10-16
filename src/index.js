import express from 'express'
import { pool } from './DBpg.js'
import { Port } from './config.js'
import fs from 'fs/promises'
import cors from 'cors'

const app = express()

// Manejo de CORS de manera manual
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5172'); // Cambia a tu dominio
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// })

const originsCors = ['http://localhost:5173', 'https://rutine-editor.vercel.app/']

const corsOptions = {
  origin: (origin, callback) => {
    if (originsCors.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST',
  optionsSuccessStatus: 204,
}; 

app.use(cors(corsOptions))

app.get('/main', async(req, res)=>{
  const search = req.query.food
  const page = parseInt(req.query.page) || 0

  const startPage = page * 16
  const endPage = startPage + 16

  const data = await pool.query(`SELECT * FROM alimento WHERE alimento.nombre ilike $1`, [`%${search}%`]);
  const pageData = data.rows.slice(startPage, endPage)

  res.json(pageData)

})

// app.get('/addTable', async(req, res) => {

//   try {
//     const query = `
//       CREATE TABLE alimento (
//       id_alimento serial NOT NULL constraint pk_alimento primary key, 
//       nombre character varying(100) not null, 
//       calorias numeric(5, 1) not null, 
//       proteinas numeric(4, 1) not null, 
//       carbohidratos numeric(4, 1) not null, 
//       grasas numeric(4, 1) not null
//       )
//     `
//     await pool.query(query);

//     res.status(200).send("operacion realizada con exito")
//   } catch (error) {
//     console.error("Error al crear la tabla en la base de datos", error);
//     res.status(500).send("Error al crear la tabla")
//   }
// })

// app.get('/pushData', async (req, res) => {

//   try {
//     const data = await fs.readFile('src/alimentos.json', 'utf8')
//     const alimentos = JSON.parse(data)

    
//     for ( const element of alimentos) {
//       const {nombre, calorias, proteinas, carbohidratos, grasas} = element
//       const values = [nombre, parseFloat(calorias), parseFloat(proteinas), parseFloat(carbohidratos), parseFloat(grasas)]
//       const query = `insert into alimento(nombre, calorias, proteinas, carbohidratos, grasas) values($1, $2, $3, $4, $5);`
//       await pool.query(query, values)
//     };

//     res.status(200).send("Datos insertados correctamente")
    
//   } catch (error) {
//     console.error("Error al insertar los datos", error)
//     res.status(500).send("Error al insertar los datos")
//   }
// })

// app.get('/deleteTable', async (req, res) => {

//   try {
//     const query = `drop table if exists ${req.params.table || 'tabla'}`;
//     await pool.query(query)
//     res.status(200).send("Se elimino la tabla con exito")

//   } catch (error) {
//     console.error("Error al eliminar la tabla", error)
//     res.status(500).send("Error al eliminar la tabla")
//   }
// })

app.listen(Port);
console.log("Server in port", Port);