import request from 'superagent'

const API_ROOT = `https://test-insight.swap.online/insight-api`

export const fetchBalance = (address) => {
  return request(`${API_ROOT}/addr/${address}`)
    .then(json => json.body)
    .then(
      ({ balanceSat, unconfirmedBalanceSat }) => ({
        balance: balanceSat,
        unconfirmed: unconfirmedBalanceSat,
      })
    )
}

export const fetchTransactionIDs = (address) => {
  return request(`${API_ROOT}/addr/${address}`)
    .then(json => json.body)
    .then(({ transactions }) => transactions)
}

export const fetchTransaction = (txid) => {
  return request(`${API_ROOT}/tx/${txid}`)
    .then(json => json.body)
}

export const fetchUTXOs = (address) => {
  return request(`${API_ROOT}/addr/${address}/utxo`)
    .then(json => json.body)
}

export default {
  fetchTransaction,
  fetchTransactionIDs,
  fetchUTXOs,
}
