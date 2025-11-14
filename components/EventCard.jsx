'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { BookingModal } from './BookingModal.jsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const EventCard = ({ user, userData, event, index, displayedEvents }) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const availableSeats = event.event_seats;
  const minPrice = event.event_price;

  const selectedTickets = [{
      ticketTypeId: 'main',
      ticketTypeName: 'Billet unique',
      quantity: 1,
      price: event.event_price || 0, // prix de l'événement, 0 si gratuit
  }];

  const categoryColors = {
    Concert: 'bg-primary/10 text-primary border-primary/20',
    Conférence: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Sport: 'bg-green-500/10 text-green-600 border-green-500/20',
    Festival: 'bg-accent/10 text-accent border-accent/20',
    Autre: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="group overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border">
        <Link href={`/event/${event.event_id}`} className="block">
          <div className="relative h-48 overflow-hidden cursor-pointer">
            <Image
              src={`/events/${event.event_image}`}
              alt={event.event_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge className={`absolute top-3 right-3 ${categoryColors[event.event_category]}`}>
              {event.event_category}
            </Badge>
          </div>

          <div className="p-5 space-y-4">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {event.event_name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.event_description}</p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })} à {event.event_time.split(':').slice(0,2).join(':')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="line-clamp-1">{event.event_location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span>{availableSeats} places restantes</span>
              </div>
            </div>
          </div>
        </Link>
        <div className="p-5 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">À partir de</p>
              <p className="text-xl font-bold text-primary">
                {minPrice === 0 ? 'Gratuit' : `${minPrice}€`}
              </p>
            </div>
            {displayedEvents?.event_date > new Date() && (<Button
              className="relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setBookingModalOpen(true);
              }}
            >
              Réserver
            </Button>)}
            
          </div>
        </div>
        <BookingModal event={event} user={user} userData={userData} open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} selectedTickets={selectedTickets} />
      </Card>
    </motion.div>
  );
};