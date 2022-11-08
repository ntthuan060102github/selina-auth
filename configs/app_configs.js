const encode_key = "selina_8d58f12a545sd10cy39w4psu4cnk"
const decode_key = "selina_s4w87gyt54a8s127q08s97jy4o8n"

const ROUTES_PREFIX = `/selina-auth-api`
const APP_ENV = process.env.app_env || "staging"
const SECRET_KEY = process.env.SECRET_KEY || "selina_2a9wf5498fhm48yio64ty1j68fgn48ae48r4h" 
const REDIS_ENDPOINT_URI = process.env.REDIS_ENDPOINT_URI
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const redis_endpoint =  REDIS_ENDPOINT_URI
const password = REDIS_PASSWORD || undefined

const services = {
    profile: {
        production: {
            domain: "https://selina-proflle.herokuapp.com/selina-profile-api"
        },
        staging: {
            domain: "https://selina-proflle-staging.herokuapp.com/selina-profile-api"
        }
    }
}

module.exports = { 
    decode_key,
    encode_key, 
    redis_endpoint,
    ROUTES_PREFIX,
    services,
    password,
    SECRET_KEY,
    APP_ENV
}