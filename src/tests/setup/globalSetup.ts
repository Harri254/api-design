import { db } from '../../db/connection.ts'
import { users, habits, entries, tags, habitTags } from '../../db/schema.ts'
import { sql } from 'drizzle-orm'
import { execSync } from 'child_process'

export default async function setup() {
  console.log('📋Setting Up test db...')
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

    console.log('🚀 Pushing schema using drizzle-kit...')
    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --dialect="postgresql" --schema="./src/db/schema.ts"`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    )

    console.log('✅ Test db created!')
  } catch (e) {
    console.error('❌ Failed to set up db...', e)
    throw e
  }

  return async () => {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

      process.exit(0)
    } catch (e) {
      console.error('❌ Failed to set up db...', e)
      throw e
    }
  }
}
