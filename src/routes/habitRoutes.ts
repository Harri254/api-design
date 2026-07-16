import { Router } from 'express'
import { ValidateBody, ValidateParams } from '../middleware/validation.ts'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import { createHabit, getUserHabits, updateHabit } from '../controllers/habitController.ts'

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional(),
})

const createParamsSchema = z.object({
  id: z.string().max(3),
})

const router = Router()

router.use(authenticateToken)

router.get('/', getUserHabits)

router.get('/:id', (req, res) => {
  res.send({ message: 'Got one habit' })
})

router.patch('/:id', updateHabit)

router.post('/', ValidateBody(createHabitSchema), createHabit)

router.delete('/:id', (req, res) => {
  res.send({ message: 'Deleted habit' }).status(204)
})

router.post(
  '/:id/complete',
  ValidateParams(createParamsSchema),
  ValidateBody(createHabitSchema),
  (req, res) => {
    res.send({ message: 'Completed habit' }).status(201)
  },
)

export default router
