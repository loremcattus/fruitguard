export const getLogin = async (req, res) => {
    const fileHTML = 'login';
    const title = 'Iniciar Sesión';
    return res.render('index.html', { fileHTML, title });
}

export const getRegister = async (req, res) => {
    const fileHTML = 'register';
    const title = 'Registrarse';
    return res.render('index.html', { fileHTML, title });
}

