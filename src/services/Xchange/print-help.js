import methods from './methods'

export const printHelp = (action) => {
  const method = methods.filter(m => m.name === action)[0]

  if (!method) {
    return `no method: ${action}`
  } else {
    return method.tokens
  }
}
