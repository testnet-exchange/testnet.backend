import { Router } from 'express'
import { token } from '../../services/passport'
import { getAddress, checkBalance } from './controller'

const router = new Router()

/**
 * @api {get} /deposit/:id Retrieve deposit
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
 * @api {get} /deposit/:id Retrieve deposit
 * @apiName RetrieveDeposit
 * @apiGroup Deposit
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} deposit Deposit's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deposit not found.
 * @apiError 401 user access only.
 */
router.get('/check-balance',
  token({ required: true }),
  checkBalance)

export default router
