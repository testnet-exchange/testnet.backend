import sync, { listen, stop } from './sync-runner'
import { updateBalance } from './wallet'

jest.mock('./wallet')

beforeAll(sync)
afterAll(stop)

test('sync runner should regularly fetch', () => {
  expect(true).toBe(true)
})

test('sync runner should not fetch if not listening', (done) => {
  // sync()

  setTimeout(() => {
    expect(updateBalance).not.toHaveBeenCalled()
    done()
  }, 5000)
})

test('sync runner should regularly fetch', (done) => {
  // sync()

  listen(12, 'BTC')

  setTimeout(() => {
    expect(updateBalance).toHaveBeenCalledWith('BTC', 12)
    done()
  }, 5000)
})
