import { compare } from "bcrypt"
import { Request, Response } from  "express"
import { sign } from "jsonwebtoken"
import { z } from "zod"

import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/app-error"
import { authConfig } from "@/configs/auth"

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: { email }
    })
    
    if (!user) {
      throw new AppError("Invalid credentials.", 401)
    }
    
    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError("Invalid credentials.", 401)
    }

    const { expiresIn, secret } = authConfig.jwt

    const token = sign({ role: user.role ?? "CUSTOMER" }, secret, {
      subject: user.id,
      expiresIn,
    })

    const { password: hashedPassword, ...userWithoutPassword } = user
    return response.json({ 
      token,
      user: userWithoutPassword,
    })
  }
}

export { SessionsController }