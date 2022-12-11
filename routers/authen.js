const router = require('express').Router()
const { login, refresh_token, ping } = require('../controllers/authen')
const { auth_user_middleware } = require('../middlewares/auth_user')

router.post("/login", login)
router.post("/refresh-token", refresh_token)
router.get("/ping", auth_user_middleware, ping)

module.exports = router