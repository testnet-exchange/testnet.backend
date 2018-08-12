import request from 'superagent'

import { checkMethod } from './check-method'

const EXCHANGE_API = `http://localhost:8080`

const BASE_PARAMS = {
  'jsonrpc': '2.0',
  'id': 0
}

export const runMethod = async (method, _payload, role = 'public', opts = {}) => {
  const params = checkMethod(method, _payload, role, opts)

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
