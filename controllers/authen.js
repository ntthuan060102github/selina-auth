const { validationResult } = require('express-validator')
const { 
    password_encode_key, 
    SECRET_KEY,
    APP_ENV,
    encode_key
} = require('../configs/app_configs')
const response_data = require('../helpers/response')
const { services } = require('../configs/app_configs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const UserPermission = require('../models/UserPermission')

const login = async (req, res, next) => {
    try{
        const input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(input_validate.array(), status_code=4))
        }

        const body = req.body
        const account = body.email
        const password = body.password

        let user_data = await axios.post(
            `${services.profile[APP_ENV].domain}/get-user-info-by-email`,
            {
                email: account,
                secret_key: SECRET_KEY
            }
        )
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return res.json(response_data(data="call_api_failure", status_code=4, message="Lỗi hệ thống!"))
        })
        console.log(user_data)

        if (Number(user_data.status_code) === 1) {
            user_data = user_data.data
            
            if (user_data === "no_data") {
                return res.json(response_data(data="email_no_exists", status_code=4, message="Tài khoản không tồn tại!"))
            }

            if (user_data.password === password){
                delete user_data.password

                // console.log(user_data)
                const user_permissions = []
                const user_permissions_obj = await UserPermission.find({email: account})
                user_permissions_obj.forEach(
                    user_permission_obj => user_permissions.push(
                        user_permission_obj.permission_code
                    )
                )
                user_data.permissions = user_permissions
                const token = await generate_token(user_data)

                if (Boolean(token)) {
                    const access_token_in_db = await Token.findOne({
                        "user_id": user_data.user_id,
                        "token_type": "access_token"
                    })

                    const refresh_token_in_db = await Token.findOne({
                        "user_id": user_data.user_id,
                        "token_type": "refresh_token"
                    })
                    

                    if (access_token_in_db) {
                        const new_access_token = await Token.findOneAndUpdate(
                            {
                                "user_id": user_data.user_id,
                                "token_type": "access_token"
                            },
                            {
                                "token": token.access_token
                            }
                        )
                    }
                    else {
                        const new_access_token = new Token({
                            "user_id": user_data.user_id,
                            "token": token.access_token,
                            "token_type": "access_token"
                        })

                        if (!new_access_token.validateSync()) {
                            new_access_token.save()
                        }
                        else {
                            return res.json(response_data(data="token_object_invalid", status_code=4, message="Lỗi hệ thống!")) 
                        }
                        
                    }

                    if (refresh_token_in_db) {
                        const new_refresh_token = await Token.findOneAndUpdate(
                            {
                                "user_id": user_data.user_id,
                                "token_type": "refresh_token"
                            },
                            {
                                "token": token.refresh_token
                            }
                        )
                    }
                    else {
                        const new_refresh_token = new Token({
                            "user_id": user_data.user_id,
                            "token": token.refresh_token,
                            "token_type": "refresh_token"
                        })

                        if (!new_refresh_token.validateSync()) {
                            new_refresh_token.save()
                        }
                        else {
                            return res.json(response_data(data="token_object_invalid", status_code=4, message="Lỗi hệ thống!")) 
                        }
                        
                    }

                    return res.json(response_data(token))
                }
                else {
                    return res.json(response_data(data="system_error", status_code=4, message="Lỗi hệ thống!"))
                }
            }
            else {
                return res.json(response_data(data="password_incorrect", status_code=4, message="Mật khẩu không chính xác!"))
            }
        }
        else {
            return res.json(response_data(data="call_api_failure", status_code=4, message="Lỗi hệ thống!"))
        }
    }
    catch(err) {
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const generate_token = async (user_data) => {
    try {
        const access_token = jwt.sign(
            {
                user_data
            }, 
            "access_token_" + encode_key,
            {
                expiresIn: "3d"
            }
        )
        const refresh_token = jwt.sign(
            {
                user_data
            }, 
            "refresh_token_" + encode_key,
            {
                expiresIn: "15d"
            }
        )
        return {
            access_token,
            refresh_token
        }
    }
    catch (err){
        console.log(err)
        return false
    }
}

const refresh_token = async (req, res, next) => {
    try {
        return res.json(response_data())
    }
    catch (err) {
        console.log(err)
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const token_data = async (req, res, next) => {
    try {
        const token = req?.body?.token
        
        if (!token) {
            return res.json(response_data(data={}, status_code=4, message="token?"))
        }
        const data = jwt.verify(token, "access_token_" + encode_key)
        res.json(response_data(data))
    }
    catch (err) {
        console.log(err)
        return res.json(response_data(data={}, status_code=4, message=String(err)))
    }
}

module.exports = {
    login,
    refresh_token,
    token_data
}