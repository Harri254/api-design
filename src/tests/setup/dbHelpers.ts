import { notBetween } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import {
  users,
  habits,
  tags,
  habitTags,
  entries,
  type NewUser,
  type NewHabit,
} from '../../db/schema.ts'
import { generateToken } from '../../utils/jwt.ts'
import { hashPassword } from '../../utils/passwords.ts'

export const createTestUser = async (userData: Partial<NewUser> = {}) => {
  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    username: `testuser-${Date.now()}-${Math.random()}`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    ...userData,
  }

  const hashedPassword = await hashPassword(defaultData.password)
  const [user] = await db.insert(users).values(defaultData).returning()

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return { token, user, rawPassword: defaultData.password }
}

export const createTesthabit = async (
  userId: string,
  habitData: Partial<NewHabit> = {},
) => {
  const defaultData = {
    name: `Test habit ${Date.now()}`,
    description: 'A test habit',
    frequency: 'daily',
    targetCount: 1,
    ...habitData,
  }

  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      ...defaultData,
    })
    .returning()

  return habit
}

export async function cleanupDatabase() {
  // Clean up in the right order due to foreign key constraints
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(users)
}
