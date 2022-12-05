const router = require('express').Router()
const { login, refresh_token, token_data } = require('../controllers/authen')

router.post("/login", login)
router.post("/refresh-token", refresh_token)
router.post("/token", token_data)

module.exports = router