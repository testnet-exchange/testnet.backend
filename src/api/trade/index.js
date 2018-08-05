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
 * @apiParam {String} method Xchange server method.
 * @apiParam {Array} params Array of parameters for a method.
 * @apiSuccess {Object} error Contains non-null if error.
 * @apiSuccess {Object} result Response.
 * @apiError 500 Some parameters may contain invalid values.
 * @apiError 404 Method.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  sendRequest)

export default router
