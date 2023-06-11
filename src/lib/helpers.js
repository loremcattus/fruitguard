import bcrypt from 'bcryptjs';
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//compara la password con la password en la base dedatos
helpers.matchPassword = async (password, savedPassword) => {
    try{
        return await bcrypt.compare(password, savedPassword);
    } catch(e) {
        console.log(e);
    }
};

helpers.matchRole = (role, savedRole) => {
    try{
        return role == savedRole;
    } catch(e) {
        console.log(e)
    }
}

export default helpers;