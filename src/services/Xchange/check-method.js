import methods from './methods'
import { XError } from './errors'

export const METHOD_LIST = methods.map(m => m.name)

export const checkMethod = (action, payload, role, options) => {
  const method = methods.filter(m => m.name === action)[0]

  if (!method) throw new XError(404, `No method: ${action}`)

  if (method.role !== role) throw new XError(403, `Wrong role: needs ${method.role}, got ${role}`)

  if (!payload) payload = {}

  if (role === 'user') {
    const { uid } = options

    if (payload.uid) {
      console.warn(`USER DATA contained uid=${payload.uid}, while his uid=${uid}`)
    }

    payload = { ...payload, uid }
  }

  if (method.tokens.includes('business_id') && options.opid) {
    payload = { ...payload, business_id: options.opid }
  }

  const keys = Object.keys(payload)

  if (keys.length !== method.tokens.length) {
    throw new XError(401, `Wrong length: [${keys}] / [${method.tokens}]`)
  }

  const params = method.tokens
    .filter((elem, index) => elem === keys[index])

  if (params.length !== method.tokens.length) {
    throw new XError(401, `Wrong keys: [${keys}] / [${method.tokens}]`)
  }

  return Object.values(payload)
}
