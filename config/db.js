import pg from "pg"
const pool = pg
pool.use({
    user: "postgres",
    host: "localhost",
    password:"root",
    database:"phone",
    port: 5432
})