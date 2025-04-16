import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';
import { execSync } from 'node:child_process';

const prisma = new PrismaClient();
const schemaId = randomUUID();


function generateUniqueDataBaseURL(schemaId: string){
    if(!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set('schema', schemaId);

    return url.toString();
}

beforeAll(async () => {
    const dataBaseURL = generateUniqueDataBaseURL(schemaId);

    process.env.DATABASE_URL = dataBaseURL;

    execSync('pnpm prisma migrate deploy')
});

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
    await prisma.$disconnect();
});