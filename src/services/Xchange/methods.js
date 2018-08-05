const check = {
  Number: a => Number.isNaN(Number(a)) ? false : Number(a),
  Optional: defaultValue => a => a || defaultValue
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
  }
]
