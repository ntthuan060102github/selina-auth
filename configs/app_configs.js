const encode_key = "selina_8d58f12a545sd10cy39w4psu4cnk"
const decode_key = "selina_s4w87gyt54a8s127q08s97jy4o8n"

const ROUTES_PREFIX = `/selina-auth-api`
const APP_ENV = process.env.app_env || "local"
const SECRET_KEY = process.env.SECRET_KEY || "selina_2a9wf5498fhm48yio64ty1j68fgn48ae48r4h" 
const REDIS_ENDPOINT_URI = process.env.REDIS_ENDPOINT_URI || "redis-16376.c52.us-east-1-4.ec2.cloud.redislabs.com:16376"
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "eHiU1tMrweOCs6qjEzhoDN4FYa0wvqwD"
const MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb+srv://Zeta:thuan2002@cluster0.pmjo1.mongodb.net/Selina-Staging?retryWrites=true&w=majority"

const services = {
    profile: {
        production: {
            domain: "https://selina-proflle.herokuapp.com/selina-profile-api"
        },
        staging: {
            domain: "https://selina-proflle-staging.herokuapp.com/selina-profile-api"
        },
        local: {
            domain: "http://127.0.0.1:8801/selina-profile-api"
        }
    }
}

module.exports = { 
    decode_key,
    encode_key, 
    ROUTES_PREFIX,
    services,
    SECRET_KEY,
    APP_ENV,
    REDIS_ENDPOINT_URI,
    REDIS_PASSWORD,
    MONGO_DB_URL
}