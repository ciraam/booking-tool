import { prisma } from '../../../prisma/prisma.js';
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { id } = req.query;
  const idSuperAdmin = [1, 2];
  const session = await getServerSession(req, res, authOptions);

  // Vérifie si connecté
  if (!session) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  // Vérifie si admin
  if (session.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    // ----- GET -----
    if (req.method === 'GET') {
      // if (session.user.id !== parseInt(id)) {
      //   return res.status(403).json({ message: "Accès refusé" });
      // }
      const getAdmin = await prisma.admin.findUnique({
        where: { admin_id: parseInt(id) },
      });
      return res.status(200).json(getAdmin);
    }
    // PATCH - Mise à jour partielle
    if (req.method === "PATCH") {
      // if (session.user.id !== parseInt(id)) {
      //   return res.status(403).json({ message: "Accès refusé" });
      // }
    //   if(req.body.admin_password !== '') {
    //     req.body.admin_password = await bcrypt.hash(req.body.admin_password, 10);
    //   }
    //   const updatedAdmin = await prisma.admin.update({
    //     where: { admin_id: parseInt(id) },
    //     data: req.body // Les champs à mettre à jour
    //   });

    //   return res.status(200).json(updatedAdmin);
    // }
      const dataToUpdate = { ...req.body };
      
      // ✅ Gestion du mot de passe pour les admins
      if (dataToUpdate.admin_password) {
        const pwd = dataToUpdate.admin_password;
        if (pwd && typeof pwd === 'string' && pwd.trim() !== '') {
          dataToUpdate.admin_password = await bcrypt.hash(pwd.trim(), 10);
        } else {
          delete dataToUpdate.admin_password;
        }
      }

      const updatedAdmin = await prisma.admin.update({
        where: { admin_id: parseInt(id) },
        data: dataToUpdate
      });

      return res.status(200).json(updatedAdmin);
    }

    // ----- DELETE -----
    if (req.method === 'DELETE') {
      // if (session.user.id !== parseInt(id)) {
      //   return res.status(403).json({ message: "Accès refusé" });
      // }
      await prisma.admin.delete({
        where: { admin_id: parseInt(id) },
      });

      return res.status(200).json({ message: 'Admin supprimé' });
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