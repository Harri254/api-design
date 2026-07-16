import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";

const router = Router();

router.use(authenticateToken);

router.get('/', (req,res)=>{
    res.send({message: "Users"})
})

router.get('/:id', (req,res)=>{
    res.send({message:"Got user"})
})

router.put('/:id', (req,res)=>{
    res.send({message:"User updated"})
})

router.delete('/:id', (req,res)=>{
    res.send({message:"User deleted"})
})

export default router;