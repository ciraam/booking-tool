import { prisma } from '../../../../prisma/prisma.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const notifications = await prisma.notificationAdmin.findMany({
        orderBy: { notification_created: 'asc' },
      });
      return res.status(200).json(notifications);
    }

    // ----- POST -----
    if (req.method === 'POST') {
      const body = req.body;

      // 1️⃣ Récupérer tous les admins
      const admins = await prisma.admin.findMany({
        select: { admin_id: true },
      });

      if (admins.length === 0) {
        return res.status(404).json({ message: "Aucun admin trouvé" });
      }

      // 2️⃣ Créer une notification pour chacun
      const notifications = await prisma.$transaction(
        admins.map((admin) =>
          prisma.notificationAdmin.create({
            data: {
              notification_admin_id: admin.admin_id,
              notification_type: body.type,
              notification_title: body.title,
              notification_message: body.message,
            },
          })
        )
      );

      return res.status(201).json({
        message: `Notifications envoyées`,
        notifications,
      });
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