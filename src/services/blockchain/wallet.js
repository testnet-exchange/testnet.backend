import bitcoinjs from 'bitcoinjs-lib'
import bip32 from 'bip32'
import hdkey from 'hdkey'
import BigNumber from 'bignumber.js'

import bitcoin from './bitcoin'
import ethereum, { web3 } from './ethereum'

import { runMethod } from '../Xchange'

const _seed = process.env.WALLET_SEED
const network = bitcoinjs.networks.testnet

let btc, eth

export const init = (seed) => {
  seed = seed || _seed

  if (!seed) {
    throw new Error(`Need rootKey to getAddress`)
  }

  const buffer = Buffer.from(seed, 'hex')

  btc = bip32.fromSeed(buffer, network)
  eth = hdkey.fromMasterSeed(buffer)

  return { eth, btc }
}

export const getAddress = (xid = 0) => {
  const btcPath = `m/44'/0'/0'/0/${xid}`
  const ethPath = `m/44'/60'/0'/0/${xid}`

  const _btckey = btc.derivePath(btcPath)
  const _ethkey = eth.derive(ethPath)

  const _eth = web3.eth.accounts.privateKeyToAccount(_ethkey._privateKey)
  const _btc = bitcoinjs.payments.p2pkh({ pubkey: _btckey.publicKey, network })

  return {
    eth: _eth.address,
    btc: _btc.address,
  }
}

export const withdraw = (currency, xid, amount) => {
  console.log(`withdraw ${currency}`)
}

export const getBalanceHistory = async (currency, xid) => {
  const asset = currency === 'BTC' ? 'TESTNET3' : 'RINKEBY'

  const filter = {
    asset,
    business_type: currency,
    start_time: 0,
    end_time: 0,
    offset: 0,
    limit: 100,
  }

  const { error, result } = await runMethod('balance.history', filter, 'user', { uid: xid })

  if (error) {
    return Promise.reject(error)
  } else {
    return result
  }
}

export const updateBalance = async (currency, xid) => {
  switch (currency) {
    case 'BTC':
      return updateBtcBalance(xid)
    case 'ETH':
      return updateEthBalance(xid)
  }
}

export const updateBtcBalance = async (xid) => {
  console.log(`run update balance`)
  const address = getAddress(xid)

  console.log('address', address)

  const txids = await bitcoin.fetchTransactionIDs(address.btc)
  console.log('txids', txids)

  const utxos = await bitcoin.fetchUTXOs(address.btc)
  console.log('utxo', utxos)

  const onlyConfirmed = utxos.filter(utxo => utxo.confirmations > 0)

  const fetchTransaction = hash =>
    onlyConfirmed.filter(tx => tx.txid === hash)[0]

  const confirmedTxIds = onlyConfirmed.map(u => u.txid)

  const unsaved = await filterUnsaved('BTC', xid, confirmedTxIds, fetchTransaction)

  console.log('unsaved', unsaved)

  const saving = unsaved
    .map(tx => ({ hash: tx.txid, amount: tx.amount, vout: tx.vout }))
    .map(save('BTC', xid))

  return Promise.all(saving)
}

export const updateEthBalance = async (xid) => {
  console.log(`run update balance`)
  const address = getAddress(xid)

  console.log('address', address)

  const txids = await ethereum.fetchTransactionIDs(address.eth)

  console.log('eth txids', txids)

  const unsaved = await filterUnsaved('ETH', xid, txids, ethereum.fetchTransaction)

  console.log('unsaved', unsaved)

  const saving = unsaved
    .map(tx => ({ hash: tx.hash, amount: tx.amount }))
    .map(save('ETH', xid))

  return Promise.all(saving)
}

export const filterUnsaved = async (currency, xid, txids, fetchTransaction) => {
  const saved = await getBalanceHistory(currency, xid)

  console.log(currency, xid)
  console.log('saved', saved)

  const savedTXids = saved.records.map(item => item.detail.hash)

  console.log('saved txids', savedTXids)

  const freshTXids = txids
    .filter(hash => !savedTXids.includes(`${currency}-${hash}`))

  console.log('fresh txids', freshTXids)

  const txs = await Promise.all(freshTXids.map(fetchTransaction))

  console.log('tx', txs)

  return txs
}

export const hashToId = (hash, currency, vout = 0) => {
  vout = parseInt(vout) || 0

  const postoffset = 6
  const postfix =
    (currency === 'BTC' ? 0b100000 : 0b010000) + (vout % 0b10000)

  console.log(postfix.toString(2))

  const MAX = BigNumber(2).pow(58)

  const id = BigNumber(hash, 16).mod(MAX.shiftedBy(-postoffset))

  return id.shiftedBy(postoffset).plus(postfix).toNumber()
}

export const save = (currency, xid) => async (_tx) => {
  console.log('tx', _tx)
  const asset = currency === 'BTC' ? 'TESTNET3' : 'RINKEBY'
  const amount = _tx.amount

  const _id = hashToId(_tx.hash, currency, _tx.vout)

  console.log(_id)

  const tx = {
    uid: xid,
    asset,
    business_type: currency,
    business_id: _id,
    change_str: amount,
    detail: {
      hash: `${currency}-${_tx.hash}`
    }
  }

  const { error, result } = await runMethod('balance.update', tx, 'admin')

  if (error) {
    console.error(error)
    // return Promise.reject(error)
  } else {
    return result
  }
}
