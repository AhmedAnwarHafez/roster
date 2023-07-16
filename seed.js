const Redis = require('ioredis')

if (!process.env.REDIS_URL) {
  console.log('Please set the REDIS_URL environment variable')
  process.exit(1)
}

const redis = new Redis(process.env.REDIS_URL)

const data = {
  Teacher1: {
    name: 'Teacher1',
    availability: 'unavailable',
    password: 'password1',
  },
  Teacher2: {
    name: 'Teacher2',
    availability: 'unavailable',
    password: 'password2',
  },
  Teacher3: {
    name: 'Teacher3',
    availability: 'unavailable',
    password: 'password3',
  },
}

async function seedData() {
  for (const [key, value] of Object.entries(data)) {
    await redis.set(`teacher:${key}`, JSON.stringify(value))
  }
  console.log('Data seeded')
}

seedData()
