// config/db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to DB via Prisma');
  } catch (error) {
    console.error('❌ DB Connection Error:', error);
  }
}

testConnection();

module.exports = prisma;
