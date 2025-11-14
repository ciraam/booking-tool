import { useState, useEffect, useCallback } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../../components/Header.jsx';
import { Footer } from '../../components/Footer.jsx';
import { BookingModal } from '../../components/BookingModal.jsx';
import { EventCard } from '../../components/EventCard.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Calendar, MapPin, User, Clock, ArrowLeft, Plus, Minus, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function EventDetailPage({ user, isDisconnect }) {
  const router = useRouter();
  const { id } = router.query;
  const [isOnline, setIsOnline] = useState(true);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // useEffect(() => {
  //   const checkConnection = async () => {
  //     try {
  //       // Ping vers ton API ou Google
  //       const response = await fetch('/api/events', {
  //         method: 'HEAD',
  //         cache: 'no-cache',
  //       });
  //       setIsOnline(response.ok);
  //     } catch (error) {
  //       setIsOnline(false);
  //     }
  //   };
  //   // Vérifie toutes les 10 secondes
  //   const interval = setInterval(checkConnection, 10000);
  //   // checkConnection();

  //   return () => clearInterval(interval);
  // }, []);

  const { data: userData, isLoadingProfil } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'GET',
      });
      // if (!res.ok) throw new Error('Utilisateur introuvable');
      return res.json();
    },
    // refetchInterval: 5000,
    enabled: !isDisconnect,
  });
  const formatUserData = userData? userData : ' ';

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const res = await fetch(`/api/events/getEvent?id=${id}`);
      if (!res.ok) throw new Error('Événement introuvable');
      return res.json();
    },
  });

  const [similarEvents, setSimilarEvents] = useState([]);
  const similarUpcoming = Array.isArray(similarEvents)
  ? similarEvents.filter(b => b.event_date > new Date())
  : [];
  const similarPast = Array.isArray(similarEvents)
  ? similarEvents.filter(b => b.event_date < new Date())
  : [];

  useEffect(() => {
    if (!event) return;

    const fetchSimilarEvents = async () => {
      try {
        const res = await fetch(`/api/events/similar?category=${event.event_category}&excludeId=${event.event_id}`);
        if (!res.ok) throw new Error('Événement introuvable');
        const data = await res.json();
        setSimilarEvents(data);
      } catch (error) {
        // console.error(error);
        setSimilarEvents([]);
      }
    };

    fetchSimilarEvents();
  }, [event]);

  if (isLoading) return <div>Chargement...</div>;

  if (!event) return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} isDisconnect={isDisconnect} isOnline={isOnline} />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Événement introuvable</h1>
          <Link href="/"><Button>Retour à l'accueil</Button></Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  // const handleQuantityChange = (ticketId, change) => {
  //   const currentQty = ticketQuantities[ticketId] || 0;
  //   const ticket = event.event_seats;
  //   if (!ticket) return;
  //   const newQty = Math.max(0, Math.min(ticket.available, currentQty + change));
  //   setTicketQuantities({ ...ticketQuantities, [ticketId]: newQty });
  // };

  // const selectedTickets = Object.entries(ticketQuantities)
  //   .filter(([, qty]) => qty > 0)
  //   .map(([ticketId, quantity]) => {
  //     const ticket = event.tickets.find(t => t.id === ticketId);
  //     return { ticketTypeId: ticketId, ticketTypeName: ticket.name, quantity, price: ticket.price };
  //   });

  // const totalAmount = selectedTickets.reduce((sum, t) => sum + t.price * t.quantity, 0);
  // const totalTickets = selectedTickets.reduce((sum, t) => sum + t.quantity, 0);
  // const handleQuantityChange = (change) => {
  //   const currentQty = ticketQuantities['main'] || 0;
  //   const maxSeats = event.event_seats || 0; // nombre total de places disponibles
  //   const newQty = Math.max(0, Math.min(maxSeats, currentQty + change));
  //   setTicketQuantities({ ...ticketQuantities, main: newQty });
  // };

  const handleQuantityChange = (change) => {
    const currentQty = ticketQuantities['main'] || 0;
    const newQty = Math.max(0, Math.min(event.event_seats, currentQty + change));
    setTicketQuantities({ main: newQty });
  };

  const selectedTickets = Object.entries(ticketQuantities)
    .filter(([, qty]) => qty > 0)
    .map(([_, quantity]) => ({
      ticketTypeId: 'main',
      ticketTypeName: 'Billet unique',
      quantity,
      price: event.event_price || 0, // prix de l'événement, 0 si gratuit
    }));

  // const totalAmount = selectedTickets.reduce((sum, t) => sum + t.price * t.quantity, 0);
  // const totalTickets = selectedTickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalTickets = ticketQuantities['main'] || 0;
  const totalAmount = totalTickets * event.event_price;


  const categoryColors = {
    Concert: 'bg-primary/10 text-primary border-primary/20',
    Conférence: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Sport: 'bg-green-500/10 text-green-600 border-green-500/20',
    Festival: 'bg-accent/10 text-accent border-accent/20',
    Autre: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} userData={formatUserData} isDisconnect={isDisconnect} isOnline={isOnline} />
      <main className="flex-1">
        {/* Back button */}
        <div className="container mx-auto px-4 py-6">
          <Link href="/"><Button variant="ghost" className="gap-2"><ArrowLeft className="w-4 h-4"/> Retour aux événements</Button></Link>
        </div>

        {/* Hero image */}
        <div className="relative h-[400px] overflow-hidden">
          <Image src={`/events/${event.event_image}`} alt={event.event_name} className="w-full h-full object-cover" fill />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"/>
          <Badge className={`absolute top-6 right-6 ${categoryColors[event.event_category]}`}>{event.event_category}</Badge>
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
          <div className={`grid grid-cols-1 ${event?.event_date > new Date() ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-4xl mx-auto'} gap-8`}>
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="p-8 shadow-card">
                  <h1 className="text-4xl font-bold mb-6">{event.event_name}</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-5 h-5 text-primary"/>
                      <div>
                        <p className="text-sm">Date</p>
                        <p className="font-medium text-foreground">{format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-5 h-5 text-primary"/>
                      <div>
                        <p className="text-sm">Heure</p>
                        <p className="font-medium text-foreground">{event.event_time.split(':').slice(0,2).join(':')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="w-5 h-5 text-accent"/>
                      <div>
                        <p className="text-sm">Lieu</p>
                        <p className="font-medium text-foreground">{event.event_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <User className="w-5 h-5 text-accent"/>
                      <div>
                        <p className="text-sm">Organisateur</p>
                        <p className="font-medium text-foreground">{event.event_organizer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">À propos de cet événement</h2>
                    <p className="text-muted-foreground leading-relaxed">{event.event_description}</p>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">Localisation</h2>
                    <p className="text-muted-foreground mb-4">{event.event_address}</p>
                    <div className="bg-secondary rounded-lg h-64 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground"/>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar booking */}
            {event?.event_date > new Date() && (
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24 shadow-card">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary" />
                    Sélection du billet
                  </h2>

                  <div className="border rounded-lg p-4 space-y-3 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Billet unique</h3>
                        <p className="text-sm text-muted-foreground">{event.event_seats} places disponibles</p>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        {event.event_price === 0 ? 'Gratuit' : `${event.event_price}€`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between bg-secondary rounded-lg p-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={totalTickets === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold w-12 text-center">{totalTickets}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleQuantityChange(1)}
                        disabled={totalTickets >= event.event_seats}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {totalTickets > 0 && (
                    <div className="bg-secondary rounded-lg p-4 mb-6 space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{totalAmount}€</span>
                      </div>
                    </div>
                  )}
                  <Button
                    className="relative w-full overflow-hidden gradient-primary shadow-glow transition-all duration-300
                              before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r
                              before:from-transparent before:via-white/30 before:to-transparent before:transition-transform
                              before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30
                              after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
                    size="lg"
                    onClick={() => {
                      if (totalTickets > 0) {
                        setTimeout(() => setBookingModalOpen(true), 100);
                      }
                    }}
                    disabled={totalTickets === 0}
                  >
                    <span className="relative z-10">Réserver maintenant</span>
                  </Button>
                </Card>
              </div>
            )}
          </div>

          {/* Similar Events */}
          {similarEvents?.event_date > new Date() && similarEvents?.length > 0 ? (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8">Événement(s) similaire(s)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarUpcoming.length > 0 ? similarUpcoming.map((simEvent, i) => (
                  <EventCard key={simEvent.event_id} event={simEvent} index={i} />
                )) : <p className="text-l mt-2 pl-9 text-muted-foreground">Aucun événement similaire</p>}
              </div>
            </div>
          ) : (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8">Événement(s) similaire(s)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarPast.length > 0 ? similarPast.map((simEvent, i) => (
                  <EventCard key={simEvent.event_id} event={simEvent} index={i} />
                )) : <p className="text-l mt-2 pl-9 text-muted-foreground">Aucun événement similaire</p>}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BookingModal event={event} user={user} userData={formatUserData} open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} selectedTickets={selectedTickets}/>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { props: { user: null, isDisconnect: true } };
  }
  session.user.name = null;
  return { props: { user: session.user, isDisconnect: false } };
}