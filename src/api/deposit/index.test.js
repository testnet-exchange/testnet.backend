import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes from '.'
import blockchain from '../../services/blockchain'

const app = () => express(apiRoot, routes)

let userSession

beforeEach(async () => {
  blockchain.init()
  const user0 = await User.create({ email: 'a@b.com', password: '123456' })
  const user1 = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user1.id)
})

test('GET /get-address 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/get-address`)
    .query({ access_token: userSession })

  expect(status).toBe(200)

  const { error, result } = body
  expect(error).toBeFalsy()
  expect(typeof result).toEqual('object')
  expect(typeof result.eth).toEqual('string')
  expect(typeof result.btc).toEqual('string')
})

test('GET /get-address 401 - no access to get-address', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/get-address`)
    .query()

  expect(status).toBe(401)
  expect(typeof body).toEqual('object')
})

test('GET /check-balance 200 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/update-balance`)
    .query({ access_token: userSession })

  expect(status).toBe(200)
})

test('GET /check-balance 401 - no access to check-balance', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/update-balance`)
    .query()

  expect(status).toBe(401)
})
