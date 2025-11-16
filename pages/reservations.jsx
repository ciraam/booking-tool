import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setBookings, removeBooking } from '../store/bookingSlice';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Calendar, MapPin, Ticket, X, Download, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns';
import { useToast } from '../hooks/use-toast';
import { PaginationControls } from '../components/PaginationControls.jsx';

export default function Reservations({ user, isDisconnect }) {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking.bookings);
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const { data: userData, isLoadingProfil } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'GET',
      });
      // if (!res.ok) throw new Error('Utilisateur introuvable');
      return res.json();
    },
    refetchInterval: 5000,
    enabled: !isDisconnect,
  });
  const formatUserData = userData? userData : ' ';
  // !isDisconnect && isLoadingProfil? <div>Récupération du profil...</div> : '';

  const paginateData = (data, page, perPage) => {
    if (!Array.isArray(data)) data = [];
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return {
      data: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / perPage),
      totalItems: data.length
    };
  };
  
  const { data: bookingUserData, refetch: fetchAllBookings, isLoading: isLoadingBooking } = useQuery({
    queryKey: ['booking', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${user?.id}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Réservations introuvables');
      return res.json();
    },
    // refetchInterval: 5000,
    enabled: !isDisconnect,
  });
  !isDisconnect && isLoadingBooking? <div>Récupération des réservations...</div> : '';
  const bookings = bookingUserData ? paginateData(bookingUserData, bookingsPage, itemsPerPage) : '';

  // fetch et remplir le store si vide
  // useQuery({
  //   queryKey: ['bookings'],
  //   queryFn: async () => {
  //     const res = await fetch('/api/bookings');
  //     if (!res.ok) throw new Error('Impossible de récupérer les réservations');
  //     return res.json();
  //   },
  //   enabled: bookings.length === 0,
  //   onSuccess: (data) => dispatch(setBookings(data)),
  // });
  
  const { data: bookingData, refetch: fetchBooking, isLoading: bookingLoading, isError: bookingError } = useQuery({
    queryKey: ['booking', searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/getBooking?id=${searchQuery}`);
      if (!res.ok) throw new Error('Réservation introuvable');
      return res.json();
    },
    enabled: false,
  });

  const { data: eventData, refetch: fetchEvent, isLoading: eventLoading, isError: eventError } = useQuery({
    queryKey: ['event', bookingData?.booking_event_id],
    queryFn: async () => {
      const res = await fetch(`/api/events/getEvent?id=${bookingData.booking_event_id}`);
      if (!res.ok) throw new Error('Événement introuvable');
      return res.json();
    },
    enabled: false,
  });

  const handleSearch = async (id) => {
    if (!id) {
      toast({
        title: 'Information incomplète',
        description: 'Veuillez remplir le champ',
        variant: 'destructive',
      });
      return;
    }
    const bookingD = await fetchBooking();
    if (bookingD?.data) {
      // attendre 0,5 seconde avant de lancer la requête de l'événement
      await new Promise((resolve) => setTimeout(resolve, 600));
      fetchEvent();
    } else {
      toast({
        title: 'Réservation introuvable',
        description: 'Veuillez saisir un ID conforme',
        variant: 'destructive',
      });
    }
  };

  const handleCancelClick = useCallback((id) => {
    setSelectedBookingId(id);
    setCancelDialogOpen(true);
  }, []);

  const handleConfirmCancel = async () => {
    if (selectedBookingId) {
      const response = await fetch(`/api/bookings/updateBooking?id=${selectedBookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ['booking_status']: 'cancelled' })
      });
      if (!response.ok) throw new Error('Erreur de sauvegarde');
      await response.json();
      dispatch(removeBooking(selectedBookingId));
      toast({
        title: 'Réservation annulée',
        description: 'Votre réservation a été annulée avec succès',
        className: 'bg-green-500 text-white',
      });
      await fetchAllBookings();
    }
    setCancelDialogOpen(false);
    setSelectedBookingId(null);
  };

  const BookingCard = ({ booking, index }) => {
    const bookingD = isDisconnect? bookingData : booking;
    const statusColors = {
      upcoming: 'bg-green-500/10 text-green-600 border-green-500/20',
      past: 'bg-muted text-muted-foreground border-border',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };

    const statusLabels = {
      upcoming: 'À venir',
      past: 'Passé',
      cancelled: 'Annulé',
    };

    const totalTickets = bookingD.booking_quantity;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="overflow-hidden shadow-card hover:shadow-hover transition-all">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
              <img
                src={`/events/${booking?.event_image}`}
                alt={booking?.event_name}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-3 right-3 ${statusColors[bookingD.booking_status]}`}>
                {statusLabels[bookingD.booking_status]}
              </Badge>
            </div>

            <div className="flex-1 p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{booking?.event_name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {format(new Date(booking?.event_date), 'EEEE d MMMM yyyy', { locale: fr })} à {booking?.event_time.split(':').slice(0,2).join(':')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{booking?.event_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-green-600" />
                    <span>
                      {totalTickets} billet{totalTickets > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Montant total</p>
                  <p className="text-2xl font-bold text-primary">{bookingD.booking_price != 0 ? bookingD.booking_price + '€': 'Gratuit'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Réservation #{bookingD.booking_id}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {bookingD.booking_status !== 'cancelled' && (
                  <Button variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" />   {/* à faire le dl dynamique du billet */}
                    Télécharger
                  </Button>
                  )}
                  {bookingD.booking_status === 'upcoming' && (
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleCancelClick(bookingD.booking_id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const upcomingBookings = Array.isArray(bookings?.data)
  ? bookings.data.filter(b => b.booking_status === 'upcoming')
  : [];
  const pastBookings = Array.isArray(bookings?.data)
  ? bookings.data.filter(b => b.booking_status === 'past')
  : [];
  const cancelledBookings = Array.isArray(bookings?.data)
  ? bookings.data.filter(b => b.booking_status === 'cancelled')
  : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} userData={formatUserData} isDisconnect={isDisconnect} isOnline={isOnline} />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Mes réservations</h1>
            <p className="text-muted-foreground">
              Gérez toutes vos réservations d'événements en un seul endroit
            </p>
          </motion.div>

          <div className={`flex flex-col items-center w-full px-4 ${!eventData || !isDisconnect ? 'justify-center min-h-[25vh]' : 'mt-6'}`}>
            {/* Barre de recherche + bouton */}
            <div className="w-full max-w-[800px] flex gap-2 p-2 glass rounded-2xl shadow-hover">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher votre réservation avec l'ID fourni..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 w-full bg-background/50 border border-gray-300 rounded-l-lg focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <Button
                onClick={() => handleSearch(searchQuery)}
                className="px-6 h-12 text-sm relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 rounded-r-lg
                          before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full
                          after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100">
                {bookingLoading || eventLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Rechercher'
                )}
              </Button>
            </div>

            {/* Résultat */}
            {eventData && (
              <div className="mt-6 w-full max-w-[1500px]">
                <BookingCard key={eventData.event_id} booking={eventData} index={1} />
              </div>
            )}
          </div>

          {!isDisconnect && (<Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="upcoming">À venir ({upcomingBookings.length || 0})</TabsTrigger>
              <TabsTrigger value="past">Passée{pastBookings.length > 1? 's' : ''} ({pastBookings.length || 0})</TabsTrigger>
              <TabsTrigger value="cancelled">Annulée{cancelledBookings.length > 1? 's' : ''} ({cancelledBookings.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingBookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune réservation à venir</h3>
                  <p className="text-muted-foreground">Explorez nos événements et réservez vos billets</p>
                </Card>
              ) : (
                upcomingBookings.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)
              )}
              {/* Pagination */}
              {upcomingBookings.length !==0 && (<PaginationControls
                currentPage={bookingsPage}
                totalPages={bookings.totalPages}
                totalItems={upcomingBookings.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setBookingsPage}
                onItemsPerPageChange={setItemsPerPage}
              />)}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastBookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune réservation passée</h3>
                  <p className="text-muted-foreground">Vos réservations passées apparaîtront ici</p>
                </Card>
              ) : (
                pastBookings.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)
              )}
              {/* Pagination */}
              {pastBookings.length !==0 && (<PaginationControls
                currentPage={bookingsPage}
                totalPages={bookings.totalPages}
                totalItems={pastBookings.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setBookingsPage}
                onItemsPerPageChange={setItemsPerPage}
              />)}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-6">
              {cancelledBookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <X className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune réservation annulée</h3>
                  <p className="text-muted-foreground">Vos réservations annulées apparaîtront ici</p>
                </Card>
              ) : (
                cancelledBookings.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)
              )}
              {/* Pagination */}
              {cancelledBookings.length !==0 && (<PaginationControls
                currentPage={bookingsPage}
                totalPages={bookings.totalPages}
                totalItems={cancelledBookings.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setBookingsPage}
                onItemsPerPageChange={setItemsPerPage}
              />)}
            </TabsContent>
          </Tabs>)}
        </div>
      </main>

      <Footer />

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler cette réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Votre réservation sera annulée et vous recevrez un email
              de confirmation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { props: { user: null, isDisconnect: true } };
  }
  session.user.name = null;
  return { props: { user: session.user, isDisconnect: false } };
}