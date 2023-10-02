/**
 * @swagger
 * tags:
 *   name: auth
 *   description: apis for register and login and also add some information.
 * /account/register:
 *   post:
 *     tags : [auth]
 *     summary: sign up
 *     parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           description: just an email for sign up
 *         - in: query
 *           name: password
 *           schema:
 *             type: string
 *           description: just a password ...
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: new user has added to the database
 *       409:
 *         description: user is already exist
 *
 *       400:
 *          description: invalid email or password
 * /account/login:
 *   post:
 *     tags : [auth]
 *     summary: sign in
 *     parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           description: just an email for sign in
 *         - in: query
 *           name: password
 *           schema:
 *             type: string
 *           description: just a password ...
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: user logged in successfully!
 *
 *       500:
 *         description: something went wrong!
 *
 *       400:
 *          description: invalid email or password
 * /user/panel:
 *   get:
 *     tags : [auth]
 *     summary: get user information
 *     requestBody:
 *       required: false
 *     components:
 *       securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: user logged in successfully!
 *
 *       500:
 *         description: something went wrong!
 *
 *       400:
 *          description: invalid email or password
 *
 *       401:
 *          description: access denied
 *
 *       403:
 *          description: unauthorized
 * /account/extraInfo:
 *   post:
 *     tags : [auth]
 *     summary: add some extra information
 *     requestBody:
 *       required: false
 *     components:
 *       securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: user updated successfully!
 *
 *       500:
 *         description: something went wrong!
 *
 *       401:
 *          description: access denied
 *
 *       403:
 *          description: unauthorized
 */
