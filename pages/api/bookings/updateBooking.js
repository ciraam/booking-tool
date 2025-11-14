import { prisma } from '../../../prisma/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // ----- PATCH -----
    if (req.method === "PATCH") {
      const updatedBooking = await prisma.booking.update({
        where: { booking_id: id },
        data: req.body // Les champs à mettre à jour
      });

      return res.status(200).json(updatedBooking);
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