import { Router } from 'express'
import { login, register } from '../controllers/authController.ts'
import { ValidateBody } from '../middleware/validation.ts'
import { insertUserSchema } from '../db/schema.ts'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = insertUserSchema.extend({
    email: z.email('invalid email')
})

const router = Router()

router.post('/register', ValidateBody(registerSchema), register)

router.post('/login', ValidateBody(loginSchema), login)

export default router