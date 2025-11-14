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

  // Vérifie si user ou admin 
  if (session.user.role !== "user" || session.user.role !== "admin") {
  return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    // ----- PUT -----
    if (req.method === 'PUT') {
      const body = req.body;

      const updatedEvent = await prisma.event.update({
        where: { event_id: parseInt(id) },
        data: {
          event_name: body.name,
          event_description: body.description,
          event_category: body.category,
          event_date: new Date(body.date),
          event_time: body.time,
          event_location: body.location,
          event_organizer: body.organizer,
          event_address: body.address,
          event_image: body.image,
          event_seats: body.seats,
          event_price: body.price,
        },
        // include: { tickets: true },
      });

      return res.status(200).json(updatedEvent);
    }

    // ----- DELETE -----
    if (req.method === 'DELETE') {
      await prisma.event.delete({
        where: { event_id: parseInt(id) },
      });

      return res.status(200).json({ message: 'Événement supprimé' });
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