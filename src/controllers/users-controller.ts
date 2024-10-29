import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'

import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/app-error'

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { 
      email, 
      name, 
      password 
    } = bodySchema.parse(request.body)
    
    const userWithSameEmail = await prisma.user.findFirst({
      where: { email }
    })

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists.")
    }

    const hashedPassword = await hash(password, 8)
    
    const { 
      password: _,
      ...userWithoutPassword
    } = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    return response.status(201).json(userWithoutPassword)
  }
}

export { UsersController }