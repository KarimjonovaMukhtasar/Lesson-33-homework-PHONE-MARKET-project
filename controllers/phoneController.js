import pool from "../config/db.js"

async function getAll(req, res) {
    try {
        const { rows } = await pool.query(`Select * from phone`)
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
        const { rows } = await pool.query(`Select * from phone where id = $1`, [id])
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
//  name varchar not null,
//     price decimal(10,2),
//     brand_id smallint REFERENCES brand(id),
//     model_id smallint REFERENCES model(id),
//     color color_enum default 'Black',
//     display decimal(2,1),
//     ram varchar,
//     memory varchar
async function createOne(req, res) {
    try {
        const { name, price, brand_id, model_id, color, display, ram, memory } = req.body
        const brandId = await pool.query(`Select * from brand where id = $1`, [brand_id])
        if (brandId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID OF A BRAND`
            })
        }
        const modelId = await pool.query(`Select * from model where id = $1`, [model_id])
        if (modelId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID OF A MODEL`
            })
        }
        const { rows } = await pool.query(`Insert into phone (name, price, brand_id, model_id, color, display, ram, memory) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *`, [name, price, brand_id, model_id, color, display, ram, memory])
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
        const phoneId = await pool.query(`Select * from phone where id = $1`, [id])
        if (phoneId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const keys = Object.keys(req.body)
        const values = Object.values(req.body)
        if (keys.includes("brand_id")) {
            const {brand_id} = req.body
            const brandId = await pool.query(`Select * from brand where id = $1`, [brand_id])
            if (brandId.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `NOT FOUND SUCH AN ID OF A BRAND`
                })
            }
        }
        if (keys.includes("model_id")) {
            const {model_id} = req.body
            const modelId = await pool.query(`Select * from model where id = $1`, [model_id])
            if (modelId.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `NOT FOUND SUCH AN ID OF A MODEL`
                })
            }
        }
        const query = keys.map((key, i) => key += ` =$${i + 1}`)
        let { rows } = await pool.query(`UPDATE phone SET ${query.join(" , ")} where id= $${keys.length + 1} returning *`, [...values, id])
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
        const phoneId = await pool.query(`SELECT * from phone where id = $1`, [id])
        if (phoneId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const { rows } = await pool.query(`DELETE from phone where id = $1 returning *`, [id])
        return res.status(200).json({ success: true, message: 'DELETED SUCCESSFULLY', data: rows[0] })

    }catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}
// phoneRoutes.get("/model/:model_id", getModelPhones)
// GET	/api/phones/model/:model_id	Modelga tegishli telefonlarni ko'rish
async function getModelPhones(req,res){
    try{
        const {model_id} = req.params
        const modelId = await pool.query(`SELECT * from model where id = $1`, [model_id])
        if(modelId.rows.length === 0){
            return res.status(404).json({success: false, message: `NOT FOUND SUCH AN ID OF MODEL`})
        }
        const {rows} = await pool.query(`SELECT ph.*, m.name as model_name from phone ph JOIN model m ON ph.model_id = m.id where ph.model_id = $1`, [model_id])
        if(rows.length === 0){
            return res.status(404).json({success: false, message: `NO DATA AVAILABLE ON THIS MODEL OF PHONE`})
        }
        return res.status(200).json({success: true, data: rows})
    }catch(e){
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}
export { getAll, getOne, deleteOne, updateOne, createOne, getModelPhones }