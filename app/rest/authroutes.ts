/**
 *    SPDX-License-Identifier: Apache-2.0
 */
import { helper } from '../common/helper';
import { responder } from './requestutils';
const AuthorizationService = require('../auth/authorization-service');

const logger = helper.getLogger('Auth');

/**
 *
 *
 * @param {*} router
 * @param {*} platform
 */
export async function authroutes(router: any, platform: any) {
	const proxy = platform.getProxy();

	/**
	 * *
	 * Network list
	 * GET /networklist -> /login
	 * curl -i 'http://<host>:<port>/networklist'
	 */

	router.get(
		'/networklist',
		responder(async (req: any) => {
			const networkList = await proxy.networkList(req);
			return { networkList };
		})
	);

	/**
	 * *
	 * Login
	 * POST /login -> /login
	 * curl -X POST -H 'Content-Type: application/json' -d '{ 'user': '<user>', 'password': '<password>' }' -i 'http://<host>:<port>/login'
	 */
	router.post('/login', async (req, res, next) => {
		logger.debug('req.body', req.body);

		console.log('**********');
		console.log(req.body);
		// 		{ user: 'exploreradmin',
		//   password: 'exploreradminpw',
		//   network: 'slaff-test-network' }

		const loginResponse = await AuthorizationService.login(
			'test@test.com',
			'iva'
		);

		return res.status(200).json({
			success: true,
			message: 'You have successfully logged in!',
			token: loginResponse.token
		});

		// return passport.authenticate('local-login', async (err, token, userData) => {
		// 	if (!token) {
		// 		return res.status(400).json({
		// 			success: false,
		// 			message: userData.message
		// 		});
		// 	}

		// 	return res.status(200).json({
		// 		success: true,
		// 		message: 'You have successfully logged in!',
		// 		token,
		// 		user: userData
		// 	});
		// })(req, res, next);
	});

	router.post(
		'/logout',
		async (req: { body: any; logout: () => void }, res: { send: () => void }) => {
			logger.debug('req.body', req.body);
			req.logout();
			res.send();
		}
	);
}
