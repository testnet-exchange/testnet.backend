import { updateBalance } from './wallet'

let update
let listening = []

export const stop = () => clearInterval(update)
export const listen = (xid, currency) => {
  const isListening = listening.filter(sub => sub.xid === xid && sub.currency === currency)

  if (isListening.length) {
    return
  }

  console.log(`start listening ${xid} ${currency}`)
  listening.push({ xid, currency })
}

export default () => {
  update = setInterval(() => {
    listening.forEach(async ({ xid, currency }, index) => {
      const updates = await updateBalance(currency, xid)

      console.log('updates for ' + xid, updates)
    })
  }, 5000)
}
