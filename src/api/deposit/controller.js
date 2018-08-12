import blockchain from '../../services/blockchain'
import { success } from '../../services/response/'
import { listen } from '../../services/blockchain/sync-runner'

export const getAddress = async ({ user, params }, res, next) =>
  Promise.resolve(blockchain.getAddress(user.xid))
    .then(result => {
      listen(user.xid, 'ETH')
      listen(user.xid, 'BTC')
      return result
    })
    .then(result => ({ error: null, result }))
    .then(success(res))
    .catch(next)

export const updateBalance = async ({ user, params }, res, next) =>
  blockchain.updateBalance('BTC', user.xid)
    .then(success(res))
    .catch(next)
