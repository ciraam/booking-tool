import { prisma } from '../../../prisma/prisma.js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
        
  // Vérifie si connecté
  if (!session) {
  return res.status(401).json({ message: "Non authentifié" });
  }

  // Vérifie si user ou admin 
  if (session.user.role !== "admin") {
  return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    // ----- GET -----
    if (req.method === 'GET') {
      const bookings = await prisma.booking.findMany({
        orderBy: { booking_created: 'desc' },
        include: {
          event: true,
        },
      });
      
      return res.status(200).json(bookings);
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