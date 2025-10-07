import { pool } from "../config/db.js"

async function getAll(req, res) {
    try {
        const { rows } = await pool.query(`Select * from brand`)
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
        const { rows } = await pool.query(`Select * from brand where id = $1`, [id])
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
        const { name } = req.body
        const { rows } = await pool.query(`Insert into brand (name) VALUES ($1) returning *`, [name])
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
        const brandId = await pool.query(`Select * from brand where id = $1`, [id])
        if (brandId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const { content } = req.body
        const keys = Object.keys(content)
        const values = Object.values(content)
        const query = keys.map((key, i) => key += ` =$${i + 1}`)
        let { rows } = await pool.query(`UPDATE brand SET ${query.join(" , ")} where id= $${keys.length + 1} returning *`, [...values, id])
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
        const brandId = await pool.query(`SELECT * from brand where id = $1`, [id])
        if(brandId.rows.length === 0){
             return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const {rows} = await pool.query(`DELETE from brand where id = $1 returning *`, [id])
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