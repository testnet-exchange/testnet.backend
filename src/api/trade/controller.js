import request from 'superagent'
import { checkMethod } from '../../services/Xchange'

const EXCHANGE_API = `http://localhost:8080`

const BASE_PARAMS = {
  'jsonrpc': '2.0',
  'id': 0
}

export const send = (method, params) => {
  const payload = {
    method,
    params: params || [],
    ...BASE_PARAMS
  }

  console.log('payload', payload)

  return request
    .post(EXCHANGE_API)
    .send(payload)
    .then(json => JSON.parse(json.text))
}

export const sendRequest = async (req, res, next) => {
  const { params: { method }, query: { access_token, ...payload } } = req

  console.log('payload', payload)

  try {
    const params = checkMethod(method, payload, 'admin')

    const reply = await send(method, params)

    res.json(reply)
  } catch ({ status, code, name, message }) {
    const reply = { error: true, result: { code, name, message } }

    res.status(status || 500).json(reply)
  }
}

export const sendRequestPublic = async ({ params: { method }, query: { ...payload } }, res, next) => {
  try {
    const params = checkMethod(method, payload, 'public')

    const reply = await send(method, params)

    res.json(reply)
  } catch ({ status, code, name, message }) {
    const reply = { error: true, result: { code, name, message } }

    res.status(status || 500).json(reply)
  }
}

export const sendRequestUser = async (req, res, next) => {
  const { user, params: { method }, query: { access_token, ...payload } } = req

  const uid = user.xid

  if (!uid) return res.status(404).json({ error: true })

  console.log('params', payload)

  try {
    const params = checkMethod(method, payload, 'user', { uid })

    const reply = await send(method, params)

    res.json(reply)
  } catch ({ status, code, name, message }) {
    const reply = { error: true, result: { code, name, message } }

    res.status(status || 500).json(reply)
  }
}
