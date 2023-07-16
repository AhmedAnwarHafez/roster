const Redis = require('ioredis')
const dotenv = require('dotenv')

dotenv.config({ path: '~/.roster/.env' })

if (!process.env.REDIS_URL) {
  console.log('Please set the REDIS_URL environment variable')
  process.exit(1)
}

const redis = new Redis(process.env.REDIS_URL)

const data = {
  ahmad: {
    name: 'ahmad',
    availability: 'unavailable',
    password: 'ahmad',
  },
  daph: {
    name: 'daph',
    availability: 'unavailable',
    password: 'daph',
  },
  jared: {
    name: 'jared',
    availability: 'unavailable',
    password: 'jared',
  },
}

async function seedData() {
  for (const [key, value] of Object.entries(data)) {
    await redis.set(`teacher:${key}`, JSON.stringify(value))
  }
  console.log('Data seeded')
}

seedData()
