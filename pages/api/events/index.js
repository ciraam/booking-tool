import { prisma } from '../../../prisma/prisma.js';

export default async function handler(req, res) {
  try {
    // ----- GET -----
    if (req.method === 'GET') {
      const events = await prisma.event.findMany({
        // include: { tickets: true },
        orderBy: { event_created: 'asc' },
      });
      return res.status(200).json(events);
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