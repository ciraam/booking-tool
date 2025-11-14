import { prisma } from '../../../prisma/prisma.js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  // Vérifie si connecté
  if (!session) {
  return res.status(401).json({ message: "Non authentifié" });
  }
  
  try {
    // ----- GET -----
    if (req.method === 'GET') {
      if (session.user.id !== parseInt(id)) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      const getUser = await prisma.user.findUnique({
        where: { user_id: parseInt(id) },
      });
      return res.status(200).json(getUser);
    }
    // ----- PUT -----
    // if (req.method === 'PUT') {
    //   const body = req.body;

    //   const updatedUser = await prisma.user.update({
    //     where: { user_id: parseInt(id) },
    //     data: {
    //       user_firstname: body.firstname,
    //       user_lastname: body.lastname,
    //       user_pseudo: body.pseudo,
    //       user_phone: body.phone,
    //       user_image: body.image,
    //     },
    //   });

    //   return res.status(200).json(updatedUser);
    // }
    // PATCH - Mise à jour partielle
    if (req.method === "PATCH") {
    //   // Vérifie que l'utilisateur modifie son propre profil (ou est admin)
    //   if (session.user.id !== parseInt(id)) {
    //     return res.status(403).json({ message: "Accès refusé" });
    //   }
    //   if(req.body.user_password !== '') {
    //     req.body.user_password = await bcrypt.hash(req.body.user_password, 10);
    //   }
    //   const updatedUser = await prisma.user.update({
    //     where: { user_id: parseInt(id) },
    //     data: req.body // Les champs à mettre à jour
    //   });

    //   return res.status(200).json(updatedUser);
    // }
    const dataToUpdate = { ...req.body };

      // ✅ Gestion du mot de passe pour les users
      if (dataToUpdate.user_password) {
        const pwd = dataToUpdate.user_password;
        if (pwd && typeof pwd === 'string' && pwd.trim() !== '') {
          dataToUpdate.user_password = await bcrypt.hash(pwd.trim(), 10);
        } else {
          delete dataToUpdate.user_password;
        }
      }

      const updatedUser = await prisma.user.update({
        where: { user_id: parseInt(id) },
        data: dataToUpdate
      });

      return res.status(200).json(updatedUser);
    }
    // ----- DELETE -----
    if (req.method === 'DELETE') {
      // Vérifie que l'utilisateur supprime son propre profil (ou est admin)
      if (session.user.id !== parseInt(id)) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      await prisma.user.delete({
        where: { user_id: parseInt(id) },
      });

      return res.status(200).json({ message: 'User supprimé' });
    }

    // ----- AUTRES METHODES -----
    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      details: error.message,
    });
  }
}