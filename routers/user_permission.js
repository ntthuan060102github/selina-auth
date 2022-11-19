const router = require('express').Router()
const { add_user_permission } = require('../controllers/user_permission')
const { add_user_permission_validator } = require('../validation/user_permission')

router.post("/add-user-permission", add_user_permission_validator(), add_user_permission)

module.exports = router