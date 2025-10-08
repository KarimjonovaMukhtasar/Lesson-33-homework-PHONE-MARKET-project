import pool  from "../config/db.js"

async function getAll(req, res) {
    try {
        const { rows } = await pool.query(`Select * from customer`)
        if (!rows) {
            return res.status(404).json({
                success: false,
                message: `NO DATA AVAILABLE IN THE DATABASE`
            })
        }
        return res.status(200).json({
            success: true,
            data: rows
        })
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

async function getOne(req, res) {
    try {
        const { id } = req.params
        const { rows } = await pool.query(`Select * from customer where id = $1`, [id])
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID!`,
                id
            })
        }
        return res.status(200).json({
            success: true,
            data: rows[0]
        })
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

async function createOne(req, res) {
    try {
        const { name, phone_number } = req.body
        const { rows } = await pool.query(`Insert into customer (name, phone_number) VALUES ($1, $2) returning *`, [name, phone_number])
        return res.status(201).json({ success: true, message: `Created successfully!`, data: rows[0] })
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

async function updateOne(req, res) {
    try {
        const { id } = req.params
        const customerId = await pool.query(`Select * from customer where id = $1`, [id])
        if (customerId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        } 
        const keys = Object.keys(req.body)
        const values = Object.values(req.body)
        const query = keys.map((key, i) => key += ` =$${i + 1}`)
        let { rows } = await pool.query(`UPDATE customer SET ${query.join(" , ")} where id= $${keys.length + 1} returning *`, [...values, id])
        return res.status(200).json({ success: true, message: `UPDATED SUCCESSFULLY!`, data: rows[0] })
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

async function deleteOne(req, res) {
    try {
        const {id} = req.params
        const customerId = await pool.query(`SELECT * from customer where id = $1`, [id])
        if(customerId.rows.length === 0){
             return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const {rows} = await pool.query(`DELETE from customer where id = $1 returning *`, [id])
        return res.status(200).json({success:true,message:'DELETED SUCCESSFULLY', data: rows[0]})

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

export {getAll, getOne, deleteOne, updateOne, createOne}