import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'fresh.jagoanhosting.com',
      user: 'gancymyi_gancysh',
      password: 'GancyShop2025!',
      database: 'gancymyi_db_gancyshop',
      port: 3306,
    });
    console.log('Connected to DB!');
    await connection.end();
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();
