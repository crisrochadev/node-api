const transporter  = require("../core/nodemailer");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()
const sendMailPass = async (email, token, name, systemName) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM, // sender address
            to: email, // list of recipients
            subject: "Recupéração de senha", // subject line
            text: `Link para recuperação de senha ${process.env.FRONT_URL}/reset_password?token=${token}`, // plain text body
            html: `<!DOCTYPE html>
                < html lang="pt-BR" >
                <head>
                    <meta charset="UTF-8">
                        <title>Recuperação de Senha</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, Helvetica, sans-serif;">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9; padding: 20px 0;">
                                <tr>
                                    <td align="center">

                                        <!-- Container -->
                                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

                                            <!-- Header -->
                                            <tr>
                                                <td align="center" style="background:#6C63FF; padding:30px;">
                                                    <h1 style="color:#ffffff; margin:0; font-size:24px;">
                                                        Recuperação de Senha
                                                    </h1>
                                                </td>
                                            </tr>

                                            <!-- Body -->
                                            <tr>
                                                <td style="padding:40px 30px; color:#333333; font-size:16px; line-height:1.6;">

                                                    <p style="margin-top:0;">
                                                        Olá, <strong>$${name}</strong> 👋
                                                    </p>

                                                    <p>
                                                        Recebemos uma solicitação para redefinir sua senha.
                                                        Clique no botão abaixo para criar uma nova senha:
                                                    </p>

                                                    <!-- Button -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
                                                        <tr>
                                                            <td align="center">
                                                                <a href="${process.env.FRONT_URL}/reset_password?token=${token}"
                                                                    style="background:#6C63FF;
                              color:#ffffff;
                              text-decoration:none;
                              padding:14px 28px;
                              border-radius:6px;
                              display:inline-block;
                              font-weight:bold;">
                                                                    Redefinir Senha
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <p>
                                                        Se você não solicitou a redefinição de senha,
                                                        pode ignorar este e-mail com segurança.
                                                    </p>

                                                    <p style="font-size:14px; color:#777;">
                                                        Este link é válido por 1 hora.
                                                    </p>

                                                </td>
                                            </tr>

                                            <!-- Footer -->
                                            <tr>
                                                <td align="center" style="background:#f4f6f9; padding:20px; font-size:13px; color:#999;">
                                                    © 2026 ${systemName}. Todos os direitos reservados.
                                                </td>
                                            </tr>

                                        </table>

                                    </td>
                                </tr>
                            </table>

                        </body>
                    </html>`, // HTML body
        });
        return info.messageId
    } catch (err) {
        console.error("Error while sending mail", err);
        return false
    }
}

module.exports = sendMailPass