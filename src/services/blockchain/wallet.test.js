import {
  init, getAddress,
  filterUnsaved,
  updateBalance,
  getBalanceHistory,
  hashToId,
} from './wallet'

beforeEach(() => {
  init()
})

describe('deposit', () => {
  it('generates different addresses', () => {
    const aliceAddr = getAddress(13)
    const bobAddr = getAddress(15)

    expect(typeof aliceAddr.btc).toBe('string')
    expect(aliceAddr.btc).not.toBe(bobAddr.btc)
  })
})

describe('top up BTC', () => {
  it('updates balance', async () => {
    const res = await updateBalance('BTC', 12)
    console.log(res)
    expect(res.length).toBe(0)
  })

  it('can compare txs', async () => {
    const txids = ['aaa', 'bbb']
    const txs = await filterUnsaved('BTC', 12, txids, (hash) => ({ hash }))

    expect(txs.length).toBe(2)
  })

  it('filters away already saved', async () => {
    const txids = [
      'aaa', 'bbb',
      'd1bc791d5743495f7063e87b17b3983cdd9e39643b2ebde0ad7587e3f149308f'
    ]

    const txs = await filterUnsaved('BTC', 12, txids, (hash) => ({ hash }))

    expect(txs.length).toBe(2)
  })

  it('can fetch previous topups', async () => {
    const result = await getBalanceHistory('BTC', 12)

    expect(typeof result).toBe('object')
    expect(Array.isArray(result.records)).toBe(true)
  })
})

describe('top up ETH', () => {
  it('updates balance', async () => {
    const res = await updateBalance('ETH', 12)
    console.log(res)
    expect(res.length).toBe(0)
  })

  it('can compare txs', async () => {
    const txids = ['0xaaa', '0xbbb']
    const txs = await filterUnsaved('ETH', 12, txids, (hash) => ({ hash }))

    expect(txs.length).toBe(2)
  })

  it('filters away already saved', async () => {
    const txids = [
      '0xaaa', '0xbbb',
      '0x9a47599a32936d3e4f22e7772290f91d9157103179406e6f2935df8c9a9a66a8'
    ]

    const txs = await filterUnsaved('ETH', 12, txids, (hash) => ({ hash }))

    expect(txs.length).toBe(2)
  })

  it('can fetch previous topups', async () => {
    const result = await getBalanceHistory('ETH', 12)

    expect(typeof result).toBe('object')
    expect(Array.isArray(result.records)).toBe(true)
  })
})

describe('unique id', () => {
  it('generates int from hash', async () => {
    const id = hashToId('aaa', 'BTC')

    expect(Number.isInteger(id)).toBe(true)
  })

  it('generates unique numbers', () => {
    const id1 = hashToId('aaa', 'BTC')
    const id2 = hashToId('bbb', 'BTC')

    expect(id1).not.toBe(id2)
  })

  it('generates unique numbers for different currencies', () => {
    const id1 = hashToId('ccc', 'BTC')
    const id2 = hashToId('ccc', 'ETH')

    expect(id1).not.toBe(id2)
  })

  it('generates unique numbers for different vouts', () => {
    const id1 = hashToId('ccc', 'BTC', 4)
    const id2 = hashToId('ccc', 'BTC', 10)

    expect(id1).not.toBe(id2)
  })

  it('generates numbers from 0x hashes', () => {
    // 0x4bd9aa4a7ab5d3e7878af68f24241350ed641bd498d6e8256b8b2a764325bbf0
    const id = hashToId('0xdddddddddddddddddddddddddddddddddddddddddddd', 'ETH')

    expect(Number.isInteger(id)).toBe(true)
  })

  it('generates numbers not too big', () => {
    const id1 = hashToId('ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'BTC')
    const id2 = hashToId('fffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'BTC')

    expect(id1).toBeLessThan(Math.pow(2, 60))
    expect(id2).toBeLessThan(Math.pow(2, 60))
  })
})
