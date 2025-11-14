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
  // if (session.user.role !== "user" || session.user.role !== "admin") {
  // return res.status(403).json({ message: "Accès refusé" });
  // }

  try {
    // ----- GET -----
    if (req.method === 'GET') {
       // ✅ UNE SEULE REQUÊTE avec JOIN
      const bookingsWithEvents = await prisma.booking.findMany({
        where: { 
          booking_user_id: parseInt(id) 
        },
        include: {
          event: true // ✅ Prisma fait le JOIN automatiquement
        },
        orderBy: {
          booking_created: 'desc'
        }
      });

      // ✅ Formate les données
      const formatted = bookingsWithEvents.map(b => ({
        // Données de réservation
        booking_id: b.booking_id,
        booking_status: b.booking_status,
        booking_quantity: b.booking_quantity,
        booking_price: b.booking_price,
        booking_created: b.booking_created,
        
        // Données de l'événement (déjà jointes)
        event_id: b.event.event_id,
        event_name: b.event.event_name,
        event_date: b.event.event_date,
        event_time: b.event.event_time,
        event_location: b.event.event_location,
        event_image: b.event.event_image,
      }));

      return res.status(200).json(formatted);
    }

    // ----- PUT -----
    // if (req.method === 'PUT') {
    //   const body = req.body;

    //   const updatedEvent = await prisma.booking.update({
    //     where: { event_id: parseInt(id) },
    //     data: {
    //       event_name: body.name,
    //       event_description: body.description,
    //       event_category: body.category,
    //       event_date: new Date(body.date),
    //       event_time: body.time,
    //       event_location: body.location,
    //       event_organizer: body.organizer,
    //       event_address: body.address,
    //       event_image: body.image,
    //       event_seats: body.seats,
    //       event_price: body.price,
    //     },
    //     // include: { tickets: true },
    //   });

    //   return res.status(200).json(updatedEvent);
    // }

    // // ----- DELETE -----
    // if (req.method === 'DELETE') {
    //   await prisma.booking.delete({
    //     where: { booking_id: id },
    //   });

    //   return res.status(200).json({ message: 'Événement supprimé' });
    // }

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