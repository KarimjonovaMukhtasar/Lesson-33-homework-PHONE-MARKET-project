export const errorHandler = (req,res,err, next)=>{
    console.log(err.stack)
    return res.status(err.status || 500).json({
        message: err.message || `SERVER ERROR`
    })
}