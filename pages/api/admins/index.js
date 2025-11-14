import { prisma } from '../../../prisma/prisma.js';
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  // Vérifie si connecté
  if (!session) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  // Vérifie si admin
  if (session.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé" });
  }
    
  try {
    // ----- GET -----
    if (req.method === 'GET') {
      const events = await prisma.admin.findMany({
        orderBy: { admin_id: 'asc' },
      });
      return res.status(200).json(events);
    }

    // ----- POST -----
    if (req.method === 'POST') {
      const body = req.body;

      const newAdmin = await prisma.admin.create({
        data: {
          admin_firstname: body.firstname,
          admin_lastname: body.lastname,
          admin_pseudo: body.pseudo,
          admin_email: body.email,
          admin_password: await bcrypt.hash(body.password, 10),
          admin_phone: body.phone,
          admin_image: body.image,
        },
      });

      return res.status(201).json(newAdmin);
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