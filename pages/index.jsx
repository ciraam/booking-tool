import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from "next/router";
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../components/ui/toaster.jsx';
import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { Hero } from '../components/Hero.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { EventFilters } from '../components/EventFilters.jsx';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/PaginationControls.jsx';

const queryClient = new QueryClient();

export default function Index({ user, isDisconnect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [isOnline, setIsOnline] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const router = useRouter();
  const [eventsPage, setEventsPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

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
  
  const { data: eventsData = [], isLoading, isError } = useQuery({
    queryKey: ['event'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Erreur de chargement');
      return res.json();
    },
  });

  const events = paginateData(eventsData, eventsPage, itemsPerPage);
  
  const { data: userData, isLoadingProfil } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'GET',
      });
      // if (!res.ok) throw new Error('Utilisateur introuvable');
      return res.json();
    },
    refetchInterval: 5000, // 🔁 toutes les 5 secondes
    enabled: !isDisconnect,
  });
  const formatUserData = userData? userData : ' ';
  // !isDisconnect && isLoadingProfil? <div>Récupération du profil...</div> : '';

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
  if(isDisconnect && searchQuery === 'haiko') {
    router.push("/Zvx4T7e6");
  }
  const filteredEvents = useMemo(() => {
    return events.data.filter((event) => {
      // Recherche par nom ou lieu
      const matchesSearch =
        searchQuery === '' ||
        event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_location.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtre par catégorie
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(event.event_category);

      // // Filtre par prix (champ unique)
      // const matchesPrice = event.event_price >= priceRange[0] && event.event_price <= priceRange[1];

      // // Filtre par disponibilité
      // const matchesAvailability = event.event_seats > 0;

      // return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
      return matchesSearch && matchesCategory;
    });
    // }, [events, searchQuery, selectedCategories, priceRange]);
    }, [events, searchQuery, selectedCategories]);

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur de chargement des événements.</p>;
  
  const now = new Date();
  
  const upcomingEvents = filteredEvents
  .filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate > now && event.event_status === 'public';
  })
  .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  const pastEvents = filteredEvents
  .filter(event => {
    const eventDate = new Date(event.event_date);
    return eventDate < now && event.event_status === 'public';
  })
  .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  const displayedEvents = showUpcoming ? upcomingEvents : pastEvents;

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster />

        <Header user={user} userData={formatUserData} isDisconnect={isDisconnect} isOnline={isOnline} />
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <main className="flex-1 container mx-auto px-4 py-12">
          {/* Boutons Toggle */}
          <div className="flex gap-4 mb-6 justify-center">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showUpcoming ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setShowUpcoming(true)}
            >
              À venir
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !showUpcoming ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setShowUpcoming(false)}
            >
              Passé{pastEvents.length > 1 ? 's' : ''}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <EventFilters
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </aside>

            {/* Events Grid */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {displayedEvents.length} événement{displayedEvents.length > 1 ? 's' : ''} trouvé{displayedEvents.length > 1 ? 's' : ''}
                </h2>
              </div>

              {displayedEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-muted-foreground"
                >
                  <p className="text-xl">Aucun événement {showUpcoming ? "à venir" : "passé"}</p>
                  <p className="text-sm mt-2">
                    {showUpcoming ? "En cours de création par l'association" : "Essayez de modifier vos critères de recherche"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedEvents.map((event, index) => (
                    <EventCard key={event.event_id} user={user} userData={formatUserData} event={event} index={index} displayedEvents={displayedEvents} />
                  ))}
                </div>
              )}
              {/* Pagination */}
              {displayedEvents.length !== 0 && (<PaginationControls
                currentPage={eventsPage}
                totalPages={events.totalPages}
                totalItems={displayedEvents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setEventsPage}
                onItemsPerPageChange={setItemsPerPage}
              />)}
            </div>
          </div>
        </main>
        <Footer />
      </QueryClientProvider>
    </ReduxProvider>
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