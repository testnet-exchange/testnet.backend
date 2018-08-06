import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes from '.'

const app = () => express(apiRoot, routes)

let userSession

beforeEach(async () => {
  const user = await User.create({ email: 'a@c.com', password: '123456' })
  userSession = signSync(user.id)
})

test('empty', () => {
  expect(true).toBe(true)
})

test('GET /trade/user/balance.query 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/user/balance.query`)
    .query({ access_token: userSession })

  expect(status).toBe(200)

  const { error, result } = body
  expect(error).toBeFalsy()
  expect(typeof result).toEqual('object')
})

test('GET /trade 404 (user) - no.such.method', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/user/no.such.method`)
    .query({ access_token: userSession })

  expect(status).toBe(404)
  expect(typeof body).toEqual('object')

  const { error, result } = body
  expect(error).toBeTruthy()
  expect(typeof result).toEqual('object')
})

test('GET /trade 403 (public) - no access to balance.query', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/public/balance.query`)
    .query()

  expect(status).toBe(403)
  expect(typeof body).toEqual('object')

  const { error, result } = body
  expect(error).toBeTruthy()
  expect(typeof result).toEqual('object')
})

test('GET /trade 200 (public) - asset.list', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/public/asset.list`)
    .query()

  expect(status).toBe(200)
  expect(typeof body).toEqual('object')

  const { error, result } = body
  expect(error).toBeFalsy()
  expect(Array.isArray(result)).toBe(true)
})
