import { Router } from 'express'
import { token } from '../../services/passport'
import { sendRequest } from './controller'

const router = new Router()

/**
 * @api {get} /trade/admin/:method Send root-level request to Xchange
 * @apiName SendRequestAdmin
 * @apiGroup Trade
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam {String} method Xchange server method.
 * @apiParam {Any} ... parameters for a method (including uid if needed)
 * @apiSuccess {Object} error Contains non-null if error.
 * @apiSuccess {Object} result Response.
 * @apiError 500 Some parameters may contain invalid values.
 * @apiError 404 Method not found.
 * @apiError 403 Method requires more permissions
 * @apiError 401 Malformed parameters.
 */
router.get('/admin/:method',
  token({ required: true, roles: ['admin'] }),
  sendRequest('admin'))

/**
 * @api {get} /trade/user/:method Send authenticated request to Xchange
 * @apiName SendRequestUser
 * @apiGroup Trade
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {String} method Xchange server method.
 * @apiParam {Any} ... parameters for a method (without uid)
 * @apiSuccess {Object} error Contains non-null if error.
 * @apiSuccess {Object} result Response.
 * @apiError 500 Some parameters may contain invalid values.
 * @apiError 404 Method not found.
 * @apiError 403 Method requires more permissions
 * @apiError 401 Malformed parameters.
 */
router.get('/user/:method',
  token({ required: true }),
  sendRequest('user'))

/**
 * @api {get} /trade/public/:method Send general-scope request to Xchange
 * @apiName SendRequestPublic
 * @apiGroup Trade
 * @apiPermission public
 * @apiParam {String} method Xchange server method.
 * @apiParam {Any} ... parameters for a method
 * @apiSuccess {Object} error Contains non-null if error.
 * @apiSuccess {Object} result Response.
 * @apiError 500 Some parameters may contain invalid values.
 * @apiError 404 Method not found.
 * @apiError 403 Method requires more permissions
 * @apiError 401 Malformed parameters.
 */
router.get('/public/:method',
  token({ required: false }),
  sendRequest('public'))

export default router
