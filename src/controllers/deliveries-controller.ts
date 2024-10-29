import { Request, Response } from 'express'
import { z } from 'zod'

import { prisma } from '@/database/prisma'

class DeliveriesController {
  async  create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      description: z.string(),
    })

    const { description, user_id } = bodySchema.parse(request.body)

    await prisma.delivery.create({
      data: {
        userID: user_id,
        description,
      }
    })

    return response.status(201).json()
  }

  async index(request: Request, response: Response) {
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: { 
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return response.json({ deliveries })
  }
}

export { DeliveriesController }