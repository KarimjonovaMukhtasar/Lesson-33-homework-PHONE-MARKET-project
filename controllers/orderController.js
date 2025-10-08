import pool from "../config/db.js"

async function getAll(req, res) {
    try {
        const { rows } = await pool.query(`Select o.*, json_agg(json_build_object('phone_id', od.phone_id, 'quantity', od.quantity)) 
            FILTER (WHERE od.id IS NOT NULL)
            as order_items from "order" o 
            LEFT JOIN order_detail od ON  o.id = od.order_id group by o.id`)
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
        const { rows } = await pool.query(`Select o.*, json_agg(json_build_object('phone_id', od.phone_id, 'quantity', od.quantity)) 
            FILTER (WHERE od.id IS NOT NULL)
            as order_items from "order" o 
            LEFT JOIN order_detail od ON  o.id = od.order_id where o.id = $1 group by o.id`, [id])
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
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const { customer_id, order_date, order_status, order_items } = req.body
        const customerId = await client.query(`SELECT * from customer where id = $1`,[customer_id])
        if(customerId.rows.length === 0){
            return res.status(404).json({success:false, message: `NOT FOUND SUCH AN ID OF A CUSTOMER!`})
        }
        let total_price = 0
        for(const item of order_items){
            const phoneId = await client.query(`SELECT * from phone where id = $1`, [item.phone_id])
            if(phoneId.rows.length === 0){
                return res.status(404).json({success:false, message: `NOT FOUND SUCH A PHONE ID!`, id: item.phone_id})
            }
            total_price += phoneId.rows[0].price * item.quantity
        }
        const newOrder = await client.query(`Insert into "order" (customer_id, order_date, order_status, total_price) VALUES ($1, $2, $3, $4) returning *`, [customer_id, order_date, order_status, total_price])
        const order = newOrder.rows[0]
        for(const item of order_items){
              const orderDetails = await client.query(`INSERT into order_detail (order_id, phone_id, quantity) VALUES ($1, $2, $3) returning *`, [order.id, item.phone_id, item.quantity])
        }
        const order_detail = await client.query(`SELECT * from order_detail where order_id = $1`, [order.id])     
        await client.query(`COMMIT`)
        return res.status(201).json({ success: true, message: `Order Created successfully!`, order: order.rows, order_detail: order_detail.rows})
    } catch (e) {
        console.log(e.message)
        await client.query('ROLLBACK')
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }finally{
        client.release()
    }
}

async function updateOne(req, res) {
    try {
        const { id } = req.params
        const orderId = await pool.query(`Select * from "order" where id = $1`, [id])
        if (orderId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const keys = Object.keys(req.body)
        const values = Object.values(req.body)
        const query = keys.map((key, i) => key += ` =$${i + 1}`)
        let { rows } = await pool.query(`UPDATE "order" SET ${query.join(" , ")} where id= $${keys.length + 1} returning *`, [...values, id])
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
        const orderId = await pool.query(`SELECT * from "order" where id = $1`, [id])
        if (orderId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `NOT FOUND SUCH AN ID`
            })
        }
        const { rows } = await pool.query(`DELETE from "order" where id = $1 returning *`, [id])
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
// orderRoutes.get("/customer/:customer_id", getCustomerOrders)
// GET	/api/orders/customer/:customer_id	Mijozning buyurtmalarini ko'rish
async function getCustomerOrders(req, res) {
    try {
        const { customer_id } = req.params
        const customerId = await pool.query(`Select * from customer where id = $1`, [customer_id])
        if (customerId.rows.length === 0) {
            return res.status(404).json({ success: false, message: `NOT FOUND SUCH AN ID OF A CUSTOMER!` })
        }
        const { rows } = await pool.query(`SELECT o.* , c.name as customer_name from "order" o JOIN customer c ON o.customer_id = c.id where o.customer_id = $1`, [customer_id])
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: `NO ORDERS ON THIS CUSTOMER YET`, data: rows })
        }
        return res.status(200).json({ success: true, data: rows })
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}

// orderRoutes.patch("/:id/status", updateStatus)
// PATCH	/api/orders/:id/status	Buyurtma statusini o'zgartirish
async function updateStatus(req, res) {
    try {
        const {id} = req.params
        const {status} = req.body
        const orderId = await pool.query(`SELECT * from "order" where id = $1`, [id])
        if(orderId.rows.length === 0){
            return res.status(404).json({success:false, message: `NOT FOUND SUCH AN ORDER ID!`, id})
        }
        const {rows} = await pool.query(`UPDATE "order" SET status = $1 where id = $2 returning *`, [status, id])
        return res.status(200).json({success: true, message: `ORDER STATUS UPDATED SUCCESSFULLY`, data: rows[0]})
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({
            success: false,
            message: `SERVER ERROR, SORRY!`,
            error: e.message
        })
    }
}
export { getAll, getOne, deleteOne, updateOne, createOne, getCustomerOrders, updateStatus }