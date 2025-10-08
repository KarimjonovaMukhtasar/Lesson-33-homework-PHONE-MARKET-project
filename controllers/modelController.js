import pool from "../config/db.js"

async function getAll(req, res) {
    try {
        const { rows } = await pool.query(`Select * from model`)
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
        const { rows } = await pool.query(`Select * from model where id = $1`, [id])
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
        const { brand_id, name } = req.body
        const brandId = await pool.query(`SELECT * from brand where id = $1`, [brand_id])
        if (brandId.rows.length === 0) {
            return res.status(404).json({ success: false, message: `NOT FOUND SUCH A BRAND ID!` })
        }
        const { rows } = await pool.query(`Insert into model (brand_id, name) VALUES ($1, $2) returning *`, [brand_id, name])
        return res.status(201).json({ success: true, message: `Created Successfully!`, data: rows[0] })
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
        const modelId = await pool.query(`Select * from model where id = $1`, [id])
        if (modelId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID OF A MODEL!`
            })
        }
        const keys = Object.keys(req.body)
        if (keys.includes("brand_id")) {
            const { brand_id } = req.body
            const brandId = await pool.query(`SELECT * from brand where id = $1`, [brand_id])
            if (brandId.rows.length === 0) {
                return res.status(404).json({ success: false, message: `NOT FOUND SUCH A BRAND ID!` })
            }
        }
        const values = Object.values(req.body)
        const query = keys.map((key, i) => key += ` =$${i + 1}`)
        let { rows } = await pool.query(`UPDATE model SET ${query.join(" , ")} where id= $${keys.length + 1} returning *`, [...values, id])
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
        const { id } = req.params
        const modelId = await pool.query(`SELECT * from model where id = $1`, [id])
        if (modelId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const { rows } = await pool.query(`DELETE from model where id = $1 returning *`, [id])
        return res.status(200).json({ success: true, message: 'DELETED SUCCESSFULLY', data: rows[0] })

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

// modelRoutes.get("/brand/:brand_id", getAllBrandModels)
// GET	/api/models/brand/:brand_id	Brendga tegishli modellarni ko'rish
async function getAllBrandModels(req, res) {
        try {
            const {brand_id} = req.params
            const brandId = await pool.query(`SELECT * from brand where id = $1`, [brand_id])
            if(brandId.rows.length === 0){
                return res.status(404).json({success:false, message: `NOT FOUND SUCH AN ID OF A BRAND!`})
            }
            const {rows} = await pool.query(`SELECT m.*, b.name as brand_name from model m JOIN brand on m.brand_id = b.id where m.brand_id = $1`, [brand_id])
            if(rows.length === 0){
                return res.status(404).json({success: false, message: `NO ANY MODEL ON THIS BRAND, SORRY!`, data: rows})
            }
            return res.status(200).json({success:true, message: `SUCCESSFULLY RETRIEVED THE MODELS OF BRAND`, data: rows})
        } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

export { getAll, getOne, deleteOne, updateOne, createOne }