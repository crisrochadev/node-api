const Response = require("../helpers/Response");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const sendMailPass = require("../helpers/send_mail");
const validator = require('validator')
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()
module.exports = {
    async store(req, res) {
        try {
            const { name, username, email, password } = req.body;
            if (!name) {
                return Response.error(res, 'name é obrigatório')
            }
            if (!username) {
                return Response.error(res, 'username é obrigatório')
            }
            if (!email) {
                return Response.error(res, 'email é obrigatório')
            }
            if (!password) {
                return Response.error(res, 'password é obrigatório')
            }
            if (password.length < 6) {
                return Response.error(res, 'A senha precisa de no mínimo 6 caracteres')
            }
            if (!validator.isEmail(email)) {
                return Response.error(res, 'Email inválido')
            }
            // Verifica se ja existe email
            const exists = await User.getBy('email', email);
            if (exists) {
                return Response.error(res, 'Email já cadastrado')
            }

            // Verifica se ja existe username
            const existsUsername = await User.getBy('username', username);
            if (existsUsername) {
                return Response.error(res, 'Email já cadastrado')
            }
            //Hash de senha
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);

            const user = await User.create({
                name,
                email,
                username,
                password: hash
            });

            console.log(user);

            return Response.success(res, 'Salvo com sucesso', user)
        } catch (error) {
            return Response.error(res, 'Erro na requisição', error)
        }

    },
    async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username) {
                return Response.error(res, 'username é obrigatório')
            }
            // Verifica busca usuario pelo email
            const isEmailLogin = validator.isEmail(username);

            let user;

            if (isEmailLogin) {
                user = await User.getBy('email', username);
            } else {
                user = await User.getBy('username', username);
            }
            if (!user) {
                return Response.error(res, 'Usuário ou senha inválidos')
            }

            //Verifica a senha
            const correctPass = await bcrypt.compare(password, user.password);

            if (!correctPass) {
                return Response.error(res, 'Usuário ou senha inválidos')
            }
            delete user.password;

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "8h" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.SECURE,
                sameSite: "lax",
                maxAge: 3600000
            });

            return Response.success(res, 'Logado com sucesso', user)
        } catch (error) {
            console.log(error)
            return Response.error(res, 'Erro na requisição', error)
        }

    },
    async passRecover(req, res) {
        const { email } = req.body;
        if (!email) {
            return Response.error(res, 'Email é obrigatório')
        }
        const user = await User.getBy('email', email)
        if (!user) {
            return Response.error(res, 'Email não encontrado')
        }

        const token = await User.insertRecover(user.id);
        if (token) {
            const sended = await sendMailPass(user.email, token, user.name, 'CR Games')
            if (!sended) {
                return Response.error(res, 'Erro ao tentar enviar email')
            }
            return Response.success(res, 'Email de recuperação de senha enviado')
        }
        return Response.error(res, 'Erro ao tentar enviar email')
    },
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!token) {
                return Response.error(res, 'token é obrigatório')
            }
            if (!password) {
                return Response.error(res, 'password é obrigatório')
            }
            if (password.length < 6) {
                return Response.error(res, 'A senha precisa de no mínimo 6 caracteres')
            }
            // Verifica se ja existe email
            const exists = await User.getRecoverUser(token);
            if (!exists) {
                return Response.error(res, 'Token inexitente ou expirado')
            }

            //Hash de senha
            const hash = await bcrypt.hash(password, saltRounds);


            const user = await User.update(exists.id, {
                password: hash
            });

            return Response.success(res, 'Senha atualizada com sucesso', user)
        } catch (error) {
            console.error(error)
            return Response.error(res, 'Erro na requisição', error)
        }

    },
}