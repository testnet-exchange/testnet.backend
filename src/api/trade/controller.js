// import request from 'request-promise-native'
import request from 'superagent'

const EXCHANGE_API = `http://localhost:8080`

const BASE_PARAMS = {
  'jsonrpc': '2.0',
  'id': 0
}

export const sendRequest = async (req, res, next) => {
  const { query: { method, params } } = req

  const payload = {
    method,
    params: params || [],
    ...BASE_PARAMS
  }

  console.log('payload', payload)

  try {
    const json = await request
      .post(EXCHANGE_API)
      .send(payload)

    const reply = JSON.parse(json.text)

    console.log('reply', reply)
    res.json(reply)
  } catch ({ status, code, name, message }) {
    const reply = { error: true, result: { code, name, message } }

    res.status(status || 500).json(reply)
  }
}
