import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

export const ValidateBody = (schema: ZodSchema)=>{
    return (req:Request, res: Response , next:NextFunction)=>{
        try {
            const validatedData = schema.parse(req.body)
            req.body = validatedData;
            next()
        } catch (e) {
            if(e instanceof ZodError){
                return res.status(400).json({
                    error : "Validation failed",
                    details : e.issues.map((err) =>({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
            }
            next(e)
        }
    }
}

export const ValidateParams = (schema: ZodSchema)=>{
    return (req:Request, res: Response , next:NextFunction)=>{
        try {
            schema.parse(req.params)
            next()
        } catch (e) {
            if(e instanceof ZodError){
                return res.status(400).json({
                    error : "Invalid Params",
                    details : e.issues.map((err) =>({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
            }
            next(e)
        }
    }
}

export const ValidateQuery = (schema: ZodSchema)=>{
    return (req:Request, res: Response , next:NextFunction)=>{
        try {
            schema.parse(req.query)
            next()
        } catch (e) {
            if(e instanceof ZodError){
                return res.status(400).json({
                    error : "Invalid Query Params",
                    details : e.issues.map((err) =>({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
            }
            next(e)
        }
    }
}
