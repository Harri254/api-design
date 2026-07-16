import {drizzle}  from 'drizzle-orm/node-postgres'
import * as schema from './schema.ts'
import {Pool} from 'pg'
import { env, isProd  } from '../../env.ts'
import { remember } from '@epic-web/remember'

const createPool = () => {
    return new Pool({
        connectionString: env.DATABASE_URL,
        connectionTimeoutMillis: 5000, // fail after 5s instead of hanging forever
    })
}

let client;

if(isProd()){
    client = createPool()
}else {
    client = remember("dbPool", ()=> createPool())
}

export const db = drizzle({client, schema});

export default db