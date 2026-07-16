import {db} from './connection.ts'
import { pathToFileURL } from 'node:url'
import { users,habits,habitTags,entries,tags } from './schema.ts'

const seed = async () => {
    console.log("🌱 Starting database seed....")

    try {
        console.log("Clearing existing data....")

        await db.delete(entries);
        await db.delete(habitTags);
        await db.delete(habits);
        await db.delete(tags);
        await db.delete(users);

        console.log("Creating demo users....")

        const [demoUser] = await db.insert(users).values({
            email: "katu@app.com",
            password: "password",
            username :"katu",
            firstName : "demo",
            lastName : "person",
        }).returning()

        console.log("Creating tags............")

        const [healthTag] = await db.insert(tags).values({
            name:"Health",
            color: "#1d2ec8"
        }).returning()

        console.log("Creating habit......")

        const [exerciseHabit] = await db.insert(habits).values({
            userId: demoUser.id,
            name: "Exercise",
            description : "Daily workout",
            frequency: "daily",
            targetCount:1,
        }).returning()


        await db.insert(habitTags).values({
            habitId:exerciseHabit.id,
            tagId: healthTag.id,
        })

        console.log("Creating entry.........")

        const today = new Date()
        today.setHours(12, 0, 0, 0)

        for(let i = 0; i<7; i++){
            const date = new Date(today);
            date.setDate(date.getDate() - i)
            await db.insert(entries).values({
                habitId: exerciseHabit.id,
                completionDate: date,
            })
        }
        console.log('✅ Database seeded successfully!');
        console.log('User credentials');
        console.log(`User email : ${demoUser.email}`);
        console.log(`user username : ${demoUser.username}`);
        console.log(`User password : ${demoUser.password}`);
    } catch (e) {
        console.error("❌ Seed failed ", e)
        process.exit(1)
    }
}

if(import.meta.url === pathToFileURL(process.argv[1]).href){
    seed()
    .then(()=>process.exit(0))
    .catch((e) => process.exit(1))
}

export default seed;