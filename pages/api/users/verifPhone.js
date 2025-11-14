import { prisma } from '../../../prisma/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

  const { phone } = req.query;

  try {
    // Exemple avec SQL direct
    const verifPhone = await prisma.$queryRaw`
      SELECT * FROM user
      WHERE user_phone = ${phone}
    `;

    res.status(200).json(verifPhone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
}