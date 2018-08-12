
export const getAddress = ({ params }, res, next) => {
  res.status(200).json({'error': null, 'result': {'address': '123123123ddddfgff'}})
}

export const checkBalance = ({ params }, res, next) =>
  res.status(200).json({'error': null, 'result': {'balance': 0.123}})
