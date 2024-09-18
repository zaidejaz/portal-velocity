// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const password = 'adminpassword123' // You should change this to a secure password

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('Super admin user already exists')
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create the super admin user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      // Add any other fields required by your User model
    },
  })

  console.log(`Created super admin user with email: ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })