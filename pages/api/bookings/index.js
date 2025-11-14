import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {
                booking_id,
                booking_event_id,
                booking_user_id,
                booking_user_firstname,
                booking_user_lastname,
                booking_user_email,
                booking_user_phone,
                booking_price,
                booking_quantity,
            } = req.body;

            // Création dans la DB
            const newBooking = await prisma.booking.create({
                data: {
                    booking_id,
                    booking_event_id,
                    booking_user_id,
                    booking_user_firstname,
                    booking_user_lastname,
                    booking_user_email,
                    booking_user_phone,
                    booking_price,
                    booking_quantity,
                },
            });

            return res.status(201).json(newBooking);
        } catch (err) {
            console.error('Erreur Prisma :', err);
            return res.status(500).json({ error: err.message, details: err });
        }
    }
}