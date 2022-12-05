const router = require('express').Router()
const { login, refresh_token } = require('../controllers/authen')

router.post("/login", login)
router.post("/refresh-token", refresh_token)

module.exports = router