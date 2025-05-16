import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { DomainEvents } from '@/core/events/domain-events';
import { Redis } from 'ioredis';
import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();
const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB,
});
const schemaId = randomUUID();

function generateUniqueDataBaseURL(schemaId: string) {
    if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }

    const url = new URL(env.DATABASE_URL);

    url.searchParams.set('schema', schemaId);

    return url.toString();
}

beforeAll(async () => {
    const dataBaseURL = generateUniqueDataBaseURL(schemaId);

    env.DATABASE_URL = dataBaseURL;

    DomainEvents.shouldRun = false;

    await redis.flushdb();

    execSync('pnpm prisma migrate deploy')
});

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
    await prisma.$disconnect();
});