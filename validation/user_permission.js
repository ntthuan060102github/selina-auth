const { check } = require('express-validator');

const add_user_permission_validator = () => {
    return [
        check("user_id").isInt(),
        check("permission_code").isString()
    ]
}

module.exports = {
    add_user_permission_validator
}