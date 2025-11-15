import { prisma } from '../../../prisma/prisma.js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  // Vérifie si connecté
  if (!session) {
  return res.status(401).json({ message: "Non authentifié" });
  }

  if (session.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé" });
    }

  try {
    // ----- GET -----
    if (req.method === 'GET') {
      const getUser = await prisma.user.findUnique({
        where: { user_id: parseInt(id) },
      });

      if (!getUser) {
        return res.status(404).json({ message: 'User introuvable' });
      }

      return res.status(200).json(getUser);
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