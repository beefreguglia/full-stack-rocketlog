import request from "supertest"

import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("SessionsController", () => {
  let user_id: string

  afterAll(async() => {
    await prisma.user.delete({ where: { id: user_id } })
  })

  it('should be able to authenticate and get access token', async () => {
    const createdUserResponse = await request(app).post("/users").send({
      name: 'Auth Test User',
      email: 'authtestuser@example.com',
      password: '123456'
    })

    user_id = createdUserResponse.body.id

    const sessionResponse = await request(app).post("/sessions").send({
      email: 'authtestuser@example.com',
      password: '123456'
    })

    expect(sessionResponse.status).toBe(200)
    expect(sessionResponse.body.token).toEqual(expect.any(String))
  })
})