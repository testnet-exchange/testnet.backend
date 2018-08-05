import http from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes from '.'

const app = () => express(apiRoot, routes)

let userSession

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user.id)
})

test('GET /trade 200 (user) - asset.list', async () => {
  const method = 'asset.list'

  const { status, body } = await http(app())
    .get(apiRoot)
    .query({ access_token: userSession, method })

  expect(status).toBe(200)

  console.log('response', body)

  const { error, result } = body
  expect(error).toBeFalsy()
  expect(Array.isArray(result)).toBe(true)
})

test('GET /trade 404 (user) - no.such.method', async () => {
  const method = 'no.such.method'

  const { status, body } = await http(app())
    .get(apiRoot)
    .query({ access_token: userSession, method })

  expect(status).toBe(404)
  expect(typeof body).toEqual('object')

  console.log('body', body)

  const { error, result } = body
  expect(error).toBeTruthy()
  expect(typeof result).toEqual('object')
})
