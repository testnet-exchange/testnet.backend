
export const getAddress = ({ params }, res, next) => {
  res.status(200).json({'error': null, 'result': {'ETC': '123123123ddddfgff', 'BTC': '123123124354FFF'}})
}

export const checkBalance = ({ params }, res, next) =>
  res.status(200).json({'error': null, 'result': {'ETC': 0.123, 'BTC': 0.3433334}})
