import { prisma } from '../../../../prisma/prisma.js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

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
    if (req.method === 'GET') {
        const notifications = await prisma.notificationAdmin.findMany({
          where: { notification_admin_id: parseInt(id) },
          orderBy: { notification_created: 'desc' },
          take: 50
        });
        
        return res.status(200).json(notifications);
    }

    if (req.method === 'PATCH') {
        const notificationRead = await prisma.notificationAdmin.update({
          where: { notification_id: parseInt(id) },
          data: { notification_read: "yes" }
        });
        
        return res.status(200).json(notificationRead);
    }
    
    if (req.method === 'DELETE') {
        await prisma.notificationAdmin.delete({
          where: { notification_id: parseInt(id) }
        });
        
        return res.status(200).json({ success: true });
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