#!/usr/bin/env node

const yargs = require('yargs')
const Redis = require('ioredis')
const dotenv = require('dotenv')

dotenv.config({ path: '~/.roster/.env' })

if (!process.env.REDIS_URL) {
  console.log('Please set the REDIS_URL environment variable')
  process.exit(1)
}

const redis = new Redis(process.env.REDIS_URL)

yargs
  .command({
    command: 'show',
    describe: 'Show teacher availability',
    handler: async () => {
      const keys = await redis.keys('teacher:*')
      for (const key of keys) {
        const teacher = JSON.parse((await redis.get(key)) || '')
        console.log(
          `${teacher.availability === 'available' ? '✅' : '❌'} ${teacher}`,
        )
      }
      await redis.quit()
    },
  })
  .command({
    command: 'update',
    describe: 'Update teacher availability',
    builder: {
      name: {
        describe: 'The name of the teacher',
        demandOption: true,
        type: 'string',
      },
      availability: {
        describe: 'The availability of the teacher',
        demandOption: true,
        type: 'string',
      },
      password: {
        describe: 'The password of the teacher',
        demandOption: true,
        type: 'string',
      },
    },
    handler: async (argv) => {
      const teacherKey = `teacher:${argv.name}`
      const teacherData = await redis.get(teacherKey)
      if (!teacherData) {
        console.log('Teacher not found')
        return
      }
      const teacher = JSON.parse(teacherData)
      if (teacher.password !== argv.password) {
        console.log('Invalid password')
        return
      }
      teacher.availability = argv.availability
      await redis.set(teacherKey, JSON.stringify(teacher))
      console.log('Availability updated')

      await redis.quit()
    },
  })
  .demandCommand(1, '')
  .help().argv
