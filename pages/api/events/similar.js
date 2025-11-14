import { prisma } from '../../../prisma/prisma.js';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // const session = await getServerSession(req, res, authOptions);
      
  // // Vérifie si connecté
  // if (!session) {
  // return res.status(401).json({ message: "Non authentifié" });
  // }

  // // Vérifie si user ou admin 
  // if (session.user.role !== "user" || session.user.role !== "admin") {
  // return res.status(403).json({ message: "Accès refusé" });
  // }

  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

  const { category, excludeId } = req.query;

  try {
    // Exemple avec SQL direct
    const similarEvents = await prisma.$queryRaw`
      SELECT * FROM event
      WHERE event_category = ${category} AND event_id != ${excludeId}
      ORDER BY event_date ASC
      LIMIT 3
    `;

    res.status(200).json(similarEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
}