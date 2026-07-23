const path = require("node:path")
const { Pool } = require('pg')
const express = require("express")
const app = express()

const PORT = process.env.PORT || 3000

const pool = new Pool({
    connectionString: "postgres://admin:admin123@localhost:5432/clientes"
})

app.use(express.static(path.join(__dirname, "/public")))
app.use(express.json()) // habilita el req.body para jsons
app.use(express.urlencoded()) // habilita el req.body para formularios

app.get("/clientes", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes;') // rows: trae los registros resultantes y rowCount trae la cantidad de registros

        res.status(200).json({
            data: result.rows,
            count: result.rowCount
        })
    } catch (error) {
        console.error(error)
        res.json({
            error: "Hubo un error al consultar los datos."
        })
    }
})

app.get("/clientes/:rut", async (req, res) => {
    const { rut } = req.params

    try {
        const result = await pool.query("SELECT * FROM clientes WHERE rut = $1", [rut])

        res.json({
            data: result.rows,
            count: result.rowCount
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Hubo un error al consultar los datos."
        })
    }
})

app.post("/clientes", async (req, res) => {
    const { nombre, rut, edad } = req.body

    try {
        const result = await pool.query("INSERT INTO clientes(rut, nombre, edad) VALUES ($1, $2, $3) RETURNING rut", [rut, nombre, edad])
    
        res.status(201).json({
            data: result.rows
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Hubo un error al insertar el nuevo registro."
        })
    }
})

// todo: agregar validaciones nombre, rut, edad
// todo: agregar DELETE y PUT (update) 

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})