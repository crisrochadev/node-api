module.exports = {
    error(res, message = 'Erro insesperado', data = {}) {
        return res.status(400).json({
            success: false,
            message,
            data
        })
    },
    success(res, message = 'Requisição aceita', data = {}) {
        return res.status(200).json({
            success: true,
            message,
            data
        })
    },
    notFound(res, message = 'Não encontrado!', data = {}) {
        return res.status(404).json({
            success: false,
            message,
            data
        })
    },
    unauthorized(res, message = 'Não autorizado!', data = {}) {
        return res.status(201).json({
            success: false,
            message,
            data
        })
    }
}