import { Request, Response } from 'express'
import { z } from 'zod'

import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/app-error'

class DeliveryLogsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    })
    const { delivery_id, description } = bodySchema.parse(request.body)

    const delivery = await prisma.delivery.findUnique({ 
      where: {
        id: delivery_id
      }
    })

    if (!delivery) {
      throw new AppError('Delivery not found.', 404)
    }

    if (delivery.status === "PROCESSING") {
      throw new AppError('Change status to shipped.')
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryID: delivery_id,
        description,
      }
    })

    response.status(201).json()
  }
}

export { DeliveryLogsController }