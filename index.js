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

const getTeacherKeys = async () => {
  return await redis.keys('teacher:*')
}

const getTeacherData = async (key) => {
  return JSON.parse((await redis.get(key)) || '')
}

const printTeacherAvailability = (teacher) => {
  console.log(`${teacher.availability ? '✅' : '❌'} ${teacher.name}`)
}

const updateTeacherAvailability = async (key, availability) => {
  const teacher = await getTeacherData(key)
  teacher.availability = availability
  await redis.set(key, JSON.stringify(teacher))
}

const showTeacherAvailability = async () => {
  const keys = await getTeacherKeys()
  for (const key of keys.sort()) {
    const teacher = await getTeacherData(key)
    printTeacherAvailability(teacher)
  }
  await redis.quit()
}

const updateTeacher = async (name, availability, password) => {
  const teacherKey = `teacher:${name}`
  const teacher = await getTeacherData(teacherKey)
  if (!teacher) {
    console.log('Teacher not found')
    return
  }
  if (teacher.password !== password) {
    console.log('Invalid password')
    return
  }
  await updateTeacherAvailability(teacherKey, availability)
  console.log(
    `${name} is now ${availability ? 'ON the floor' : 'OFF the floor'}`,
  )

  await redis.quit()
}

yargs
  .command({
    command: 'show',
    describe: 'Show teacher availability',
    handler: async () => {
      await showTeacherAvailability()
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
        type: 'boolean',
      },
      password: {
        describe: 'The password of the teacher',
        demandOption: true,
        type: 'string',
      },
    },
    handler: async (argv) => {
      await updateTeacher(argv.name, argv.availability, argv.password)
    },
  })
  .demandCommand(1, '')
  .help().argv
