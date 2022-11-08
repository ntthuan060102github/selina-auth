const { validationResult } = require('express-validator');
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
const { redis_base } = require('../helpers/redis_base')

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

        if (Number(user_data.status_code) === 1) {
            user_data = user_data.data
            
            if (user_data === "no_data") {
                return res.json(response_data(data="email_no_exists", status_code=4, message="Tài khoản không tồn tại!"))
            }

            if (user_data.password === password){
                delete user_data.password

                const token = await generate_token(user_data)

                if (Boolean(token)) {
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
        await redis_base.set(`access_token_${access_token}`, JSON.stringify(user_data), {
            EX: 3*24*60*60,
        })
        const refresh_token = jwt.sign(
            {
                user_data
            }, 
            "refresh_token_" + encode_key,
            {
                expiresIn: "15d"
            }
        )
        await redis_base.set(`refresh_token_${refresh_token}`, JSON.stringify(user_data), {
            EX: 15*24*60*60,
        })
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
        const body = req.body
        const refresh_token = body.refresh_token

        const user_data_in_redis = await redis_base.get(`refresh_token_${refresh_token}`)
        
        if (!Boolean(user_data_in_redis)) {
            return res.json(response_data(data="token_expired", status_code=3))
        }
        const user_data = JSON.parse(user_data_in_redis)

        const access_token = jwt.sign(
            {
                user_data
            }, 
            "access_token_" + encode_key,
            {
                expiresIn: "3d"
            }
        )
        await redis_base.set(`access_token_${access_token}`, JSON.stringify(user_data), {
            EX: 3*24*60*60,
        })
        return res.json(response_data({access_token}))
    }
    catch (err) {
        console.log(err)
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}
module.exports = {
    login,
    refresh_token
}