import {body, validationResult } from "express-validator"

export const validateBrandName = [
    body("name").notEmpty().withMessage(`BRAND NAME IS REQUIRED,PLEASE FILL IT!`),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        next()
    }
]

export const validatePhonePrice = [
    body("price").isFloat({gt:0}).withMessage(`PRICE MUST BE A POSITIVE NUMBER AND BIGGER THAN 0!`),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        next()
    }
]

export const validatePhoneNumber = [
    body("phone_number").matches(/^\+998\d{9}$/).withMessage(`PHONE NUMBER MUST HAVE AT LEAST ONLY 12 DIGITS STARTING WITH PLUS`),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        next()
    }
]

export const validateOrder = [
    body("order").isFloat({gt:0}).withMessage(`THE ORDER QUANTITY MUST BE HIGHER THAN 0 AND NOT EQUAL TO 0 TOO!`),
    (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        next()
    }
]
