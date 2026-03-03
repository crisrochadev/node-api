const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: 'A rota solicitada não existe.',
        path: req.originalUrl // Opcional: mostra a rota tentada
    });
}
module.exports = notFound;