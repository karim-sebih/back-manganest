import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

function getUsers(req, res) {
  User.findAll().then((users) => {
    res.json(users);
  });
}

function createUser(req, res) {
  console.log(req);

  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  User.findOne({ where: { email } }).then(async (existingEmail) => {
    if (existingEmail) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hash = await hashPassword(password);
    User.create({ username, email, password: hash, role: role || "VIEWER" })
      .then((newUser) => {
        const { password, ...safeUser } = newUser.dataValues;
        res.status(201).json({ message: "Utilisateur créé", newUser: safeUser });
      });
  });
}

async function deleteUser(req, res) {
  try {
    const id = req.user.id;

    const deleted = await User.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ message: "Compte supprimé avec succès" });

  } catch (error) {
    res.status(500).json({ error: "Erreur suppression utilisateur" });
  }
}


async function updateUser(req, res) {
  const id = req.user.id;
  const { username, email, password, role } = req.body;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      user.password = await hashPassword(password);
    }

    const updatedUser = await user.save();
    const { password: _, ...safeUser } = updatedUser.dataValues;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
}

function getUserById(req, res) {
  const id = req.user.id;
  User.findOne({ where: { id } }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
}

function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

function getRoles(req, res) {
  res.json({
    roles: ["ADMIN", "VIEWER",]
  });
}

async function getProfile(req, res) {

  try {

    const userId = req.user.id;

    const user =
      await User.findByPk(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

async function getSettings(req, res) {

  try {

    const userId = req.user.id;

    const user =
      await User.findByPk(userId);

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}


export default {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  findUserByEmail,
  getRoles,
  getProfile,
  getSettings
};
