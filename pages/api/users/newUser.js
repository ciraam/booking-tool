import { prisma } from '../../../prisma/prisma.js';
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    // ----- POST -----
    if (req.method === 'POST') {
      const body = req.body;

      const newUser = await prisma.user.create({
        data: {
          user_firstname: body.firstname,
          user_lastname: body.lastname,
          user_email: body.email,
          user_pseudo: '',
          user_password: await bcrypt.hash(body.password, 10),
          user_phone: body.phone,
          user_image: '',
        },
      });

      return res.status(201).json(newUser);
    }

    // ----- AUTRES METHODES -----
    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res
      .status(500)
      .json({ message: 'Erreur serveur', details: error.message });
  }
}