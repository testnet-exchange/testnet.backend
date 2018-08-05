const check = {
  Number: a => Number.isNaN(Number(a)) ? false : Number(a),
  Optional: defaultValue => a => a || defaultValue,
  ENUM: list => a => list.includes(a) ? a : false,
  Taker_fee_rate: a => 0.0002,
  Maker_fee_rate: a => 0.0001
}

export default [
  // ADMIN ONLY
  {
    name: 'balance.update',
    role: 'admin',
    tokens: ['uid', 'asset', 'business_type', 'business_id', 'change_str', 'detail']
  },
  // user scope
  {
    name: 'balance.query',
    role: 'user',
    tokens: ['uid']
  },
  {
    name: 'balance.history',
    role: 'user',
    tokens: ['uid', 'asset', 'business_type', 'start_time', 'end_time', 'offset', 'limit']
  },
  {
    name: 'order.put_limit',
    role: 'user',
    tokens: ['uid', 'market', 'side', 'amount', 'price', 'taker_fee_rate', 'maker_fee_rate', 'source'],
    handle: {
      side: check.ENUM([1, 2]),
      taker_fee_rate: check.Taker_fee_rate,
      maker_fee_rate: check.Maker_fee_rate
    }
  },
  // public scope
  {
    name: 'asset.list',
    role: 'public',
    tokens: []
  },
  {
    name: 'order.depth',
    role: 'public',
    tokens: ['market', 'limit', 'interval'],
    handle: {
      limit: check.Number,
      interval: check.Optional('0')
    }
  },
  {
    name: 'market.status_today',
    role: 'public',
    tokens: ['market']
  },
  {
    name: 'market.summary',
    role: 'public',
    tokens: ['market']
  }
]
