import { Request, Response } from 'express'
import { z } from 'zod'

class UsersController {
  create(request: Request, response: Response) {
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


    return response.json({ message: 'Ok' })
  }
}

export { UsersController }