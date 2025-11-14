import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false, // Désactive le body parser par défaut
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // ✅ Vérifie que l'utilisateur est connecté
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'profiles');

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024, // ✅ Limite à 2MB
    maxFiles: 1, // ✅ Un seul fichier
    filename: (name, ext, part) => {
      // ✅ Nom du fichier : user-{userId}-{timestamp}.ext
      return `user-${session.user.id}-${Date.now()}${ext}`;
    },
  });

  // ✅ Crée le dossier profiles s'il n'existe pas
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Erreur création dossier:', err);
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erreur parse:', err);
      return res.status(500).json({ 
        message: 'Erreur lors de l\'upload', 
        error: err.message 
      });
    }

    const file = files.file?.[0] || files.file;
    
    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }

    // ✅ Vérifie le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Supprime le fichier uploadé
      await fs.unlink(file.filepath).catch(console.error);
      return res.status(400).json({ 
        message: 'Type de fichier non autorisé. Formats acceptés : JPG, PNG, WEBP, GIF' 
      });
    }

    // ✅ Vérifie la taille (double vérification)
    if (file.size > 2 * 1024 * 1024) {
      await fs.unlink(file.filepath).catch(console.error);
      return res.status(400).json({ 
        message: 'Fichier trop volumineux. Taille maximale : 2MB' 
      });
    }

    // ✅ Supprime l'ancienne photo de profil si elle existe
    try {
      const oldImages = await fs.readdir(uploadDir);
      const userOldImages = oldImages.filter(img => 
        img.startsWith(`user-${session.user.id}-`) && 
        img !== path.basename(file.filepath)
      );
      
      for (const oldImg of userOldImages) {
        await fs.unlink(path.join(uploadDir, oldImg)).catch(console.error);
      }
    } catch (err) {
      console.error('Erreur suppression anciennes images:', err);
    }

    // ✅ URL publique de l'image
    const fileUrl = `/profiles/${path.basename(file.filepath)}`;
    
    return res.status(200).json({ 
      fileUrl,
      message: 'Image uploadée avec succès' 
    });
  });
}