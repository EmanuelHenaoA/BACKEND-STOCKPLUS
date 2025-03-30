const jwt = require('jsonwebtoken');

const autenticarUsuario = (req, res, next) => {
    try {
        // Obtener el encabezado Authorization
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ success: false, msg: 'Token no proporcionado' });
        }

        // Extraer el token del encabezado
        const token = authHeader.split(' ')[1];
        console.log('Token recibido:', token); // Aquí se registra el token recibido para depuración

        if (!token) {
            return res.status(401).json({ success: false, msg: 'Formato de token inválido' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded; // Guardar los datos del usuario decodificados en req.user
        next(); // Pasar al siguiente middleware o controlador
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(401).json({ success: false, msg: 'Token inválido o expirado' });
    }
};

module.exports = autenticarUsuario;

