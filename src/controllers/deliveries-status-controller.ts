import { Request, Response } from 'express'
import { z } from 'zod'

import { prisma } from '@/database/prisma'

class DeliveriesStatusController {
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const bodySchema = z.object({
      status: z.enum(["PROCESSING", "SHIPPED", "DELIVERED"])
    })

    const { id } = paramsSchema.parse(request.params)
    const { status } = bodySchema.parse(request.body)

    await prisma.delivery.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })

    await prisma.deliveryLog.create({
      data: {
        deliveryID: id,
        description: status,
      }
    })
    
    return response.status(204).json()
  }
}

export { DeliveriesStatusController }