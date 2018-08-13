import { Router } from 'express'
import { token } from '../../services/passport'
import { getAddress, updateBalance } from './controller'

const router = new Router()

/**
 * @api {get} /deposit/get-address Retrieve deposit
 * @apiName RetrieveDeposit
 * @apiGroup Deposit
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} deposit Deposit's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deposit not found.
 * @apiError 401 user access only.
 */
router.get('/get-address',
  token({ required: true }),
  getAddress)

/**
 * @api {get} /deposit/update-balance Retrieve deposit
 * @apiName RetrieveDeposit
 * @apiGroup Deposit
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} deposit Deposit's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deposit not found.
 * @apiError 401 user access only.
 */
router.get('/update-balance',
  token({ required: true }),
  updateBalance)

export default router
