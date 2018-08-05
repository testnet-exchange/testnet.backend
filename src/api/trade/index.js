import { Router } from 'express'
import { token } from '../../services/passport'
import { sendRequest } from './controller'

const router = new Router()

/**
 * @api {get} /trade Send request to Xchange
 * @apiName SendRequest
 * @apiGroup Trade
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} trade Response.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Trade not found.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  sendRequest)

export default router
