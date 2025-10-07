import pkg from "pg"
const {Pool} = pkg
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    database: "phone",
    port: 5432
})

export default pool