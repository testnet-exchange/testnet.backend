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

    if (!uid) {
      throw new XError(401, `You need to provide uid in user-scope method`)
    }

    if (payload.uid) {
      console.warn(`USER DATA contained uid=${payload.uid}, while his uid=${uid}`)
    }

    payload = { ...payload, uid }
  }

  if (method.tokens.includes('business_id') && options.opid) {
    payload = { ...payload, business_id: options.opid }
  }

  if (typeof method.predefined === 'object') {
    payload = { ...payload, ...method.predefined }
  }

  const keys = Object.keys(payload)

  return method.tokens.map((token, index) => {
    if (token !== keys[index]) {
      throw new XError(401, `Wrong keys: [${keys}] / [${method.tokens}]`)
    }

    const handle = method.handle[token]
    const value = payload[token]

    const newValue = handle ? handle(value) : value

    if (newValue === false || newValue === undefined) {
      throw new XError(401, `Wrong value at key [${token}] from value [${value}]`)
    } else {
      return newValue
    }
  })
}
