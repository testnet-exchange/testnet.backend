import { runMethod, XError } from '../../services/Xchange'

const fetchAuthUID = (user, role) => {
  if (role !== 'user') {
    return {}
  }

  if (!user) {
    throw new XError(403, `Not logged in`)
  }

  const uid = user.xid

  if (!uid) {
    throw new XError(404, `No xid at user ${user.id}`)
  }

  return uid
}

export const sendRequest = (role) => async (req, res, next) => {
  const { user, params: { method }, query: { access_token, ...payload } } = req

  try {
    const uid = fetchAuthUID(user, role)
    const opts = uid ? { uid } : {}

    const reply = await runMethod(method, payload, role, opts)

    res.json(reply)
  } catch ({ status, code, name, message }) {
    const reply = { error: true, result: { code, name, message } }

    res.status(status || 500).json(reply)
  }
}
