const AuthController = require( './controllers/AuthController');

const { Router } = require('express');

const router = new Router();

router.post('/register', AuthController.store)
router.post('/login', AuthController.login)
router.post('/recover-password', AuthController.passRecover)
router.post('/reset-password', AuthController.resetPassword)
module.exports = router;