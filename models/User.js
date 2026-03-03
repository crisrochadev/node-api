const db = require("../core/database")
const crypto = require("crypto");
const dotenv = require('dotenv');
const moment = require("moment/moment");
dotenv.config()
module.exports = {
    async create(data) {
        return await db('users').insert(data);

    },
    async getBy(key, value) {
        return db('users').where({ [key]: value }).first();
    },
    async insertRecover(user_id) {
        const token = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        await db("user_recover").insert({
            user_id,
            token: tokenHash
        });

        return token; // retorna o token ORIGINAL
    },
    async getRecoverUser(token) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const userRecovered = await db('user_recover').where({ token: tokenHash }).first();
        if (!userRecovered) return false;
        const expirationDate = moment(userRecovered.created_at).add(1, 'day');

        if (moment().isAfter(expirationDate)) {
            return false;
        }
        let user = await db('users').where({ id: userRecovered.user_id }).first();
        delete user.password
        return user;
    },
    async update(id, data, tokenHash = null) {
        const user = await db('users').update(data).where({ id });
        if (tokenHash)
            return await db('user_recover')
                .where({ token: tokenHash })
                .delete();
        return user.length
    },
}