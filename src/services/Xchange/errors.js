export class XError extends Error {
  constructor (status, message, code) {
    super(message)
    this.status = status
    this.code = code
    this.message = message
    this.name = 'XError'
  }
}
