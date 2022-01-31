//const User = require("../Model/user");
const { User } = require("../Model/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createToken(user, SECRET_KEY, expiresIn) {
    const { id, name, email, username } = user;
    const payload = {
        id,
        name,
        email,
        username,
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function register(input) {
    const newUser = input;
    // Convertimos a minusculas el email y username
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { email, username, password } = newUser;

    // Revisamos si el email esta en uso
    const foundEmail = await User.findOne({ email });
    if (foundEmail) throw new Error("El email ya existe");

    // Revisamos si el username esta en uso
    const foundUserName = await User.findOne({ username });
    if (foundUserName) throw new Error("El usermail ya existe");

    // Encriptar
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt);

    try {
        const user = new User(newUser);
        user.save();
        return user;
    } catch (error) {
        console.log(error);
    }
}

async function login(input) {
    const { email, password } = input;

    const userFound = await User.findOne({ email: email.toLowerCase() });
    if (!userFound) throw new Error("Error en el email o contraseña");

    const passwordSucess = await bcryptjs.compare(password, userFound.password);
    if (!passwordSucess) throw new Error("Error en el email o contraseña");

    return {
        token: createToken(userFound, process.env.SECRET_KEY, "6h"),
    };
}

async function getUser(id, username) {
    let user = null;
    if (id) user = await User.findById(id);
    if (username) user = await User.findOne({ username });
    if (!user) throw new Error("El usuario no existe");

    return user;
}

async function updateAvatar(file) {
    console.log(file);
    /* const { id } = ctx.user;
    try {
        await User.findByIdAndUpdate(id, { avatar: "" });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    } */
}

module.exports = {
    register,
    login,
    getUser,
    updateAvatar,
};