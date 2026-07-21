import User from "../../models/User.js";
import { hashPassword } from "../../utils/password.js";


async function getAllUsers(req, res) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Erreur fetch users" });
    }
}


async function createUserByAdmin(req, res) {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const hash = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hash,
            role: role || "VIEWER"
        });

        const { password: _, ...safeUser } = user.dataValues;

        res.status(201).json(safeUser);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur création user" });
    }

}


async function updateUserByAdmin(req, res) {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;

        if (password) {
            user.password = await hashPassword(password);
        }

        await user.save();

        res.json({ message: "User updated ", user });
    } catch (err) {
        res.status(500).json({ message: "Erreur update user" });
    }
}

async function deleteUserByAdmin(req, res) {
    try {
        const { id } = req.params;

        await User.destroy({ where: { id } });

        res.json({ message: "User supprimé " });
    } catch (err) {
        res.status(500).json({ message: "Erreur delete user" });
    }
}

export {
    getAllUsers,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin
};
