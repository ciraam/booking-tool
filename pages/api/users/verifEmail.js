import { prisma } from '../../../prisma/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

  const { email } = req.query;

  try {
    // Exemple avec SQL direct
    const verifEmail = await prisma.$queryRaw`
      SELECT * FROM user
      WHERE user_email = ${email}
    `;

    res.status(200).json(verifEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
}