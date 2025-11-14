import { prisma } from '../../../prisma/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // ----- GET -----
    if (req.method === 'GET') {
      const event = await prisma.booking.findUnique({
        where: { booking_id: id },
      });

      if (!event) {
        return res.status(404).json({ message: 'Réservation introuvable' });
      }

      return res.status(200).json(event);
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