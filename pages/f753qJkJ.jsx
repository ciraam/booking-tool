import { useState, useEffect } from 'react';
import { Grid3x3, List, ChevronLeft, ChevronRight, EyeOff } from 'lucide-react';
import { Pin, Search, Filter, MoreVertical, Edit, Trash2, Eye, Download, Calendar, Clock, MapPin, Mail, Phone, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Plus, Upload, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { getServerSession } from "next-auth/next";
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from "next/router";
import { useToast } from '../hooks/use-toast.jsx';
import { signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { Menu, X, Home, Users, Settings, LogOut, BarChart3, FileText, Bell, UserRoundCog, CalendarCog } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ProfileModal } from '../components/ProfileModal.jsx';
import { CreateEventModal } from '../components/CreateEventModal.jsx';
import { CreateAdminModal } from '../components/CreateAdminModal.jsx';
import { CreateUserModal } from '../components/CreateUserModal.jsx';
import { NotificationMenu } from '../components/NotificationMenu.jsx';
import { PaginationControls } from '../components/PaginationControls.jsx';
import { useInactivityTimer, InactivityWarning } from '../hooks/useInactivityTimer.jsx';

export default function AdminDashboard({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [createAdminModalOpen, setCreateAdminModalOpen] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const router = useRouter();
  const [notification, setNotifications] = useState([]);
  const [eventsPage, setEventsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [adminsPage, setAdminsPage] = useState(1);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [eventsViewMode, setEventsViewMode] = useState('grid'); // 'grid' or 'list'
  const [usersViewMode, setUsersViewMode] = useState('list');
  const [adminsViewMode, setAdminsViewMode] = useState('list');
  const [eventsLoading, setEventsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [isModalCreateAdmin, setIsModalCreateAdmin] = useState(true);
  const [admin_idModal, setAdmin_idModal] = useState(0);
  const [isModalCreateUser, setIsModalCreateUser] = useState(true);
  const [user_idModal, setUser_idModal] = useState(0);
  const [isModalCreateEvent, setIsModalCreateEvent] = useState(true);
  const [event_idModal, setEvent_idModal] = useState(0);
  const { toast } = useToast();
  
  const { mutate: updateStatus, isLoading, isError, error } = useMutation({
    mutationFn: async (status) => {
      if (!user?.id) throw new Error('User ID non disponible');
      // console.log('Envoi de la requête PATCH avec status:', status);
      const response = await fetch(`/api/admins/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_status: String(status) })
      });
      if (!response.ok) {
        const errorData = await response.text();
        // console.error('Erreur response:', errorData);
        throw new Error('Erreur de status');
      }
      const data = await response.json();
      // console.log('Réponse reçue:', data);
      return data;
    },
    onSuccess: (data) => {
      // console.log('Mutation réussie:', data);
    },
    onError: (error) => {
      console.error('Erreur lors de la mutation:', error);
    }
  });
  
  useEffect(() => {
    if (user?.id) {
      updateStatus('online');
    }
  }, [user?.id]);

  const { 
    showWarning, 
    timeRemaining, 
    formattedTime, 
    resetTimer 
  } = useInactivityTimer({
    inactivityTimeout: 15 * 60 * 1000, // 15 minutes 15 * 60 * 1000
    warningTime: (2 * 60 * 1000) - 22000, // 1 minute 1 * 60 * 1000,
    onLogout: async () => {
      updateStatus('offline');
      signOut();
      router.push("/");
    }
  });


  const { data: userData, isLoadingProfil } = useQuery({
    queryKey: ['admin', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/admins/${user?.id}`, {
        method: 'GET',
      });
      // if (!res.ok) throw new Error('Utilisateur introuvable');
      return res.json();
    },
    refetchInterval: 5000,
  });
  const formatUserData = userData? userData : ' ';

  const handleDeconnection = () => {
    updateStatus('offline');
    signOut();
    router.push("/Zvx4T7e6");
  };

  const {data: eventsData, refetch: fetchEvents, isLoading: isLoadingEvents} = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      setEventsLoading(true);
      const res = await fetch(`/api/events`);
      if (!res.ok) throw new Error('Erreur lors du chargement des événements');
      setEventsLoading(false);
      return res.json();
    },
  });

  const {data: bookingsData, refetch: fetchBookings, isLoading: isLoadingBookings} = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      setBookingsLoading(true);
      const res = await fetch(`/api/bookings/getAllBookings`);
      if (!res.ok) throw new Error('Erreur lors du chargement des réservations');
      setBookingsLoading(false);
      return res.json();
    },
  });

 const {data: usersData, refetch: fetchUsers, isLoading: isLoadingUsers} = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      setUsersLoading(true);
      const res = await fetch(`/api/users`);
      if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
      setUsersLoading(false);
      return res.json();
    },
  });

 const {data: adminsData, refetch: fetchAdmins, isLoading: isLoadingAdmins} = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      setAdminsLoading(true);
      const res = await fetch(`/api/admins`);
      if (!res.ok) throw new Error('Erreur lors du chargement des administrateurs');
      setAdminsLoading(false);
      return res.json();
    },
  });

  const {data: notificationsData, refetch: fetchNotifications, isLoading: isLoadingNotifications} = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      setNotificationsLoading(true);
      const res = await fetch(`/api/notifications/admin/${user.id}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des notifications');
      setNotificationsLoading(false);
      return res.json();
    },
    refetchInterval: 15000, // 🔁 toutes les 15 secondes
  });

  const {data: logsData, refetch: fetchLogs, isLoading: isLoadingLogs} = useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      setLogsLoading(true);
      const res = await fetch(`/api/logs`);
      if (!res.ok) throw new Error('Erreur lors du chargement des administrateurs');
      setLogsLoading(false);
      return res.json();
    },
    refetchInterval: 15000, // 🔁 toutes les 15 secondes
  });

  // Mock data - Tu remplaceras par tes vrais appels API
  const stats = [
    { label: 'Utilisateurs totaux', value: '1,234', change: '+12%', positive: true, icon: Users },
    { label: 'Événements actifs', value: '48', change: '+8', positive: true, icon: CalendarCog },
    { label: 'Réservations ce mois', value: '892', change: '+23%', positive: true, icon: Pin },
    { label: 'Revenus totaux', value: '12,450€', change: '-3%', positive: false, icon: TrendingUp },
  ];

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'events', label: 'Événements', icon: CalendarCog },
    { id: 'bookings', label: 'Réservations', icon: Pin },
    ...(userData?.admin_type !== "Modérateur" ? [{ id: 'users', label: 'Utilisateurs', icon: Users }] : []),
    ...(userData?.admin_type === "Super Admin" ? [{ id: 'admins', label: 'Administrateurs', icon: UserRoundCog }] : []),
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
    ...(userData?.admin_type === "Super Admin" ? [{ id: 'reports', label: 'Logs d\'activité', icon: FileText }] : []),
    // { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      online: 'bg-green-100 text-green-800',
      offline: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Actif',
      inactive: 'Inactif',
      sketch: 'Brouillon',
      confirmed: 'Confirmée',
      pending: 'En attente',
      cancelled: 'Annulée',
      online: 'En ligne',
      offline: 'Hors ligne',
      past: 'Passée',
      private: 'Privé',
      public: 'Public'
    };
    return texts[status] || status;
  };

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

  const events = paginateData(eventsData, eventsPage, itemsPerPage);
  const bookings = paginateData(bookingsData, bookingsPage, itemsPerPage);
  const users = paginateData(usersData, usersPage, itemsPerPage);
  const admins = paginateData(adminsData, adminsPage, itemsPerPage);
  const notifications = paginateData(notificationsData, notificationsPage, itemsPerPage);
  const logs = paginateData(logsData, logsPage, itemsPerPage);

  const unreadCount = notificationsData?.filter(n => n.notification_read === 'no').length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, notification_read: "yes" } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, notification_read: "yes" }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.notification_id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNewEvent = () => {
    setIsModalCreateEvent(true);
    setCreateEventModalOpen(true);
  };

  const handleNewAdmin = () => {
    setIsModalCreateAdmin(true);
    setCreateAdminModalOpen(true);
  };

  const handleNewUser = () => {
    setIsModalCreateUser(true);
    setCreateUserModalOpen(true);
  };

  const handleToggleStatusEvent = async (event_id, event_status) => {
    if (event_status === 'private' || event_status === 'sketch') {
      try {
        const fieldBd = `event_status`;
        const value = `public`;
        const response = await fetch(`/api/events/${event_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [fieldBd]: String(value) })
        });
        if (!response.ok) throw new Error('Erreur de sauvegarde');
        await response.json();
        toast({
          title: 'Votre événement est désormais public',
          description: 'La modification a été sauvegardée',
          className: 'bg-green-500 text-white',
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: 'Erreur lors de la sauvegarde',
          description: 'Restauration de la modification',
          variant: 'destructive',
        });
      }
    } else {
      try {
        const fieldBd = `event_status`;
        const value = `private`;
        const response = await fetch(`/api/events/${event_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [fieldBd]: String(value) })
        });
        if (!response.ok) throw new Error('Erreur de sauvegarde');
        await response.json();
        toast({
          title: 'Votre événement est désormais privé',
          description: 'La modification a été sauvegardée',
          className: 'bg-green-500 text-white',
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: 'Erreur lors de la sauvegarde',
          description: 'Restauration de la modification',
          variant: 'destructive',
        });
      }
    }
    fetchEvents();
  };

  const handleModifyEvent = (event_id) => {
    setEvent_idModal(event_id);
    setIsModalCreateEvent(false);
    setCreateEventModalOpen(true);
  };

  const handleRemoveEvent = async (event_id) => {
    const response = await fetch(`/api/events/${event_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur de suppression');
      await response.json();
      fetchAdmins();
  };

  const handleRemoveBooking = async (booking_id) => {
    const response = await fetch(`/api/bookings/${booking_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur de suppression');
      await response.json();
      fetchAdmins();
  };

  const handleModifyUser = (user_id) => {
    setUser_idModal(user_id);
    setIsModalCreateUser(false);
    setCreateUserModalOpen(true);
  };

  const handleRemoveUser = async (user_id) => {
    const response = await fetch(`/api/users/${user_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur de suppression');
      await response.json();
      fetchAdmins();
  };

  const handleModifyAdmin = (admin_id) => {
    setAdmin_idModal(admin_id);
    setIsModalCreateAdmin(false);
    setCreateAdminModalOpen(true);
  };

  const handleRemoveAdmin = async (admin_id) => {
    const response = await fetch(`/api/admins/${admin_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur de suppression');
      await response.json();
      fetchAdmins();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen && <h1 className="text-xl font-bold">Interface bman</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{menuItems.find(item => item.id === activeTab)?.label}</h3>
              <p className="text-sm text-gray-500 mt-1">Gérez votre plateforme d'événements</p>
            </div>
            {showWarning && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-sm text-yellow-700">
                  ⚠️ Déconnexion pour inactivité dans {formattedTime}
                </p>
              </div>
            )}
            {/* <InactivityWarning 
              timeRemaining={timeRemaining}
              formattedTime={formattedTime}
              onStayActive={resetTimer}
            /> */}

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-96 p-0">
                  <NotificationMenu
                    notifications={notificationsData ? notificationsData : []}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onDelete={deleteNotification}
                    onClearAll={clearAll}
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button
                  variant="outline"
                   className="flex items-center gap-3 px-5 py-6 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition rounded-xl"
                 >
                   <div className="flex items-center gap-3">
                     <div className="text-right">
                       <p className="text-sm font-medium text-gray-800">{userData?.admin_pseudo? userData?.admin_pseudo : userData?.admin_firstname + ' ' + userData?.admin_lastname}</p>
                       <p className="text-xs text-gray-500">{user?.email}</p>
                     </div>
                     <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                       {<img src={`/profiles/${userData?.admin_image}`} alt={`Image du profil de ${userData?.admin_firstname}`} className="w-full h-full rounded-full object-cover"/> || userData?.admin_firstname?.[0]?.toUpperCase()}
                     </div>
                   </div>
                 </Button>            
                 </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                   Voir le profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeconnection}>
                   Se déconnecter
                </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Icon size={24} className={stat.positive ? 'text-green-600' : 'text-red-600'} />
                        </div>
                        <span className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={handleNewEvent} className="flex flex-col items-center gap-2 h-auto py-6">
                    <CalendarCog size={24} />
                    <span>Nouvel événement</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6">
                    <Users size={24} />
                    <span>Ajouter utilisateur</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6">
                    <Download size={24} />
                    <span>Exporter données</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6">
                    <FileText size={24} />
                    <span>Rapport mensuel</span>
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Événements populaires</h3>
                  <div className="space-y-4">
                    {events.data.slice(0, 3).map((event) => (
                      <div key={event.event_id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          {event.event_image ? (
                            <img
                              src={'/events/'+event.event_image}
                              alt="Image événement"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                              {event.event_name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{event.event_name}</p>
                          <p className="text-sm text-gray-500">{event.event_seats}/{event.event_seats_start} places réservées</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">{Math.round((event.event_seats/event.event_seats_start))}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Réservations récentes</h3>
                  <div className="space-y-4">
                    {bookings.data.slice(0, 3).map((booking) => (
                      <div key={booking.booking_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                        <div>
                          <p className="font-medium text-gray-800">{booking.booking_user_firstname} {booking.booking_user_lastname}</p>
                          <p className="text-sm text-gray-500">{booking.event.event_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{booking.booking_price}€</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(booking.booking_status)}`}>
                            {getStatusText(booking.booking_status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Rechercher un événement..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={eventsViewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setEventsViewMode('grid')}
                    >
                      <Grid3x3 size={20} />
                    </Button>
                    <Button
                      variant={eventsViewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setEventsViewMode('list')}
                    >
                      <List size={20} />
                    </Button>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter size={20} />
                    Filtres
                  </Button>
                  <Button onClick={handleNewEvent} className="gap-2">
                    <CalendarCog size={20} />
                    Nouvel événement
                  </Button>
                </div>
              </div>

              {/* Events Grid */}
              {eventsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : eventsViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.data.map((event) => (
                  <div key={event.event_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                      {event.event_image ? (<img src={'/events/'+event.event_image}  alt="Image événement" className="w-full h-full object-cover"/>) : ''}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.event_status)}`}>
                          {getStatusText(event.event_status)}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button onClick={() => handleToggleStatusEvent(event.event_id, event.event_status)} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition">
                            {event.event_status === 'public' ? <Eye size={20} /> : <EyeOff size={20} />}
                          </button>
                          <button onClick={() => handleModifyEvent(event.event_id)} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition">
                            <Edit size={20} />
                          </button>
                          <button onClick={() => handleRemoveEvent(event.event_id)} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition text-red-600">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{event.event_category}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-3 text-lg">{event.event_name}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(event.event_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{event.event_location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Réservations</p>
                          <p className="font-semibold text-gray-800">{event.event_seats}/{event.event_seats_start}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(event.event_seats/event.event_seats_start)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{Math.round((event.event_seats/event.event_seats_start))}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                // Vue liste (table)
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Événement</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Lieu</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Places</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {events.data.map((event) => (
                          <tr key={event.event_id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                  {event.event_image ? (<img src={'/events/'+event.event_image}  alt="Image événement" className="w-full h-full object-cover rounded-lg"/>) : ''}
                                </div>
                                <span className="font-medium text-gray-900">{event.event_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{event.event_category}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{new Date(event.event_date).toLocaleDateString('fr-FR')}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{event.event_location}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{event.event_seats}/{event.event_seats_start}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(event.event_status)}`}>
                                {getStatusText(event.event_status)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleToggleStatusEvent(event.event_id, event.event_status)} className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                                  {event.event_status === 'public' ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button onClick={() => handleModifyEvent(event.event_id)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                  <Edit size={18} />
                                </button>
                                <button onClick={() => handleRemoveEvent(event.event_id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <PaginationControls
                currentPage={eventsPage}
                totalPages={events.totalPages}
                totalItems={events.totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setEventsPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Rechercher une réservation..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter size={20} />
                    Filtres
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download size={20} />
                    Exporter (Simulation)
                  </Button>
                </div>
              </div>

              {bookingsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                /* Bookings Table */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Événement</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Billets</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          {user.id === 1 && <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.data.map((booking) => (
                          <tr key={booking.booking_id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking.booking_id}</td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{booking.booking_user_firstname} {booking.booking_user_lastname}</p>
                                <p className="text-xs text-gray-500">{booking.booking_user_email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{booking.event.event_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{booking.booking_quantity}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.booking_price}€</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.booking_created).toLocaleDateString('fr-FR')}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.booking_status)}`}>
                                {getStatusText(booking.booking_status)}
                              </span>
                            </td>
                            {user.id === 1 && <td className="px-6 py-4">
                              <button onClick={() => handleRemoveBooking(booking.booking_id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600">
                                <Trash2 size={18} />
                              </button>
                            </td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <PaginationControls
                currentPage={bookingsPage}
                totalPages={bookings.totalPages}
                totalItems={bookings.totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setBookingsPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={usersViewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setUsersViewMode('grid')}
                    >
                      <Grid3x3 size={20} />
                    </Button>
                    <Button
                      variant={usersViewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setUsersViewMode('list')}
                    >
                      <List size={20} />
                    </Button>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter size={20} />
                    Filtres
                  </Button>
                  {userData.admin_type !== "Modérateur" && (<Button onClick={() => handleNewUser()} className="gap-2">
                    <Users size={20} />
                    Nouvel utilisateur
                  </Button>)}
                </div>
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : usersViewMode === 'grid' ? (
                /* Users Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.data.map((user) => (
                    <div key={user.user_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            {user.user_image ? (
                              <img
                                src={user.user_image}
                                alt="Image de profil"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                                {user.user_firstname?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{user.user_firstname} {user.user_lastname}</h3>
                            {/* <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(user.status)}`}>
                              {getStatusText(user.status)}
                            </span> */}
                          </div>
                        </div>
                        {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <MoreVertical size={18} />
                        </button> */}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} />
                          <span className="truncate">{user.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={16} />
                          <span>{user.user_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>Inscrit le {new Date(user.user_created).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Réservations</p>
                          <p className="text-lg font-semibold text-gray-800">{user.bookings}</p>
                        </div>
                        {userData.admin_type !== "Modérateur" && (<div className="flex gap-2">
                          {/* <button className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                            <Eye size={18} />
                          </button> */}
                          <button onClick={() => handleModifyUser(user.user_id)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleRemoveUser(user.user_id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Users List */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Inscrit le</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Réservations</th>
                          {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Statut</th> */}
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.data.map((user) => (
                          <tr key={user.user_id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                  {user.user_image ? (
                                    <img
                                      src={`/profiles/${user.user_image}`}
                                      alt="Image de profil"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                                      {user.user_firstname?.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-900">{user.user_firstname} {user.user_lastname}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.user_email}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.user_phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{new Date(user.user_created).toLocaleDateString('fr-FR')}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.bookings}</td>
                            {/* <td className="px-6 py-4">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                                {getStatusText(user.status)}
                              </span>
                            </td> */}
                            <td className="px-6 py-4">
                              {userData.admin_type !== "Modérateur" && (<div className="flex gap-2">
                                {/* <button className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                                  <Eye size={18} />
                                </button> */}
                                <button onClick={() => handleModifyUser(user.user_id)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                  <Edit size={18} />
                                </button>
                                <button onClick={() => handleRemoveUser(user.user_id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600">
                                  <Trash2 size={18} />
                                </button>
                              </div>)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <PaginationControls
                currentPage={usersPage}
                totalPages={users.totalPages}
                totalItems={users.totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setUsersPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === 'admins' && user?.id === 1 && (
            <div className="space-y-6">
              {/* Admin Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <UserRoundCog size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Admins</p>
                      <p className="text-2xl font-bold text-gray-800">{adminsData.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">En ligne</p>
                      <p className="text-2xl font-bold text-gray-800">{adminsData.filter(a => a.status === 'online').length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Settings size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rôles actifs</p>
                      <p className="text-2xl font-bold text-gray-800">3</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and View Toggle */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Rechercher un administrateur..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={adminsViewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setAdminsViewMode('grid')}
                    >
                      <Grid3x3 size={20} />
                    </Button>
                    <Button
                      variant={adminsViewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setAdminsViewMode('list')}
                    >
                      <List size={20} />
                    </Button>
                  </div>
                  <Button onClick={handleNewAdmin} className="gap-2">
                    <UserRoundCog size={20} />
                    Ajouter un administrateur
                  </Button>
                </div>
              </div>

              {adminsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : adminsViewMode === 'grid' ? (
                /* Admins Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {admins.data.map((admin) => (
                    <div key={admin.admin_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            {admin.admin_image ? (
                              <img
                                src={`/profiles/${admin.admin_image}`}
                                alt="Image de profil"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                                {admin.admin_firstname?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {admin.admin_pseudo ? admin.admin_pseudo : admin.admin_firstname + ' ' + admin.admin_lastname}
                            </h3>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              {admin.admin_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} />
                          <span className="truncate">{admin.admin_email}</span>
                        </div>
                        {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>Dernière connexion: {admin.lastLogin}</span>
                        </div> */}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${admin.admin_status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span className={`text-xs font-medium ${admin.admin_status === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
                            {getStatusText(admin.admin_status)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {userData.admin_type === "Super Admin" && (
                            <button onClick={() => handleModifyAdmin(admin.admin_id)} className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                              <Edit size={18} />
                            </button>
                          )}

                          {admin.admin_id !== 1 && ( 
                            <button onClick={() => handleRemoveAdmin(admin.admin_id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600">
                              <Trash2 size={18} />
                            </button>
                          )}
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Admins Table */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Administrateur</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                          {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Dernière connexion</th> */}
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {admins.data.map((admin) => (
                          <tr key={admin.admin_id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                  {admin.admin_image ? (
                                    <img
                                      src={`/profiles/${admin.admin_image}`}
                                      alt="Image de profil"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                                      {admin.admin_firstname?.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-900">{admin.admin_pseudo ? `${admin.admin_pseudo} (${admin.admin_firstname} ${admin.admin_lastname})` : admin.admin_firstname + ' ' + admin.admin_lastname}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{admin.admin_email}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                {admin.admin_type}
                              </span>
                            </td>
                            {/* <td className="px-6 py-4 text-sm text-gray-600">{admin.lastLogin}</td> */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${admin.admin_status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <span className={`text-xs font-medium ${admin.admin_status === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
                                  {getStatusText(admin.admin_status)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {userData.admin_type === "Super Admin" && (
                                <button onClick={() => handleModifyAdmin(admin.admin_id)} className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                                  <Edit size={18} />
                                </button>
                                )}
                                {admin.admin_id !== 1 && (
                                  <button onClick={() => handleRemoveAdmin(admin.admin_id)} className="p-2 hover:bg-red-50 rounded-lg transition text-red-600">
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <PaginationControls
                currentPage={adminsPage}
                totalPages={admins.totalPages}
                totalItems={admins.totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setAdminsPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Time Period Selector */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Aujourd'hui</Button>
                  <Button size="sm">7 jours</Button>
                  <Button variant="outline" size="sm">30 jours</Button>
                  <Button variant="outline" size="sm">90 jours</Button>
                  <Button variant="outline" size="sm">Année</Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Icon size={24} className={stat.positive ? 'text-green-600' : 'text-red-600'} />
                        </div>
                        <span className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Réservations par jour</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[65, 78, 90, 70, 85, 95, 88].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition cursor-pointer"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500">J{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Catégories populaires</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Concerts', value: 45, color: 'bg-blue-500' },
                      { name: 'Conférences', value: 30, color: 'bg-purple-500' },
                      { name: 'Festivals', value: 15, color: 'bg-green-500' },
                      { name: 'Sport', value: 10, color: 'bg-orange-500' },
                    ].map((category, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{category.name}</span>
                          <span className="text-sm text-gray-600">{category.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${category.color} h-2 rounded-full transition-all`}
                            style={{ width: `${category.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Revenus mensuels</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download size={16} />
                    Exporter
                  </Button>
                </div>
                <div className="h-64 flex items-end justify-between gap-3">
                  {[
                    { month: 'Jan', value: 8500 },
                    { month: 'Fév', value: 9200 },
                    { month: 'Mar', value: 10800 },
                    { month: 'Avr', value: 9800 },
                    { month: 'Mai', value: 11200 },
                    { month: 'Jun', value: 12450 },
                  ].map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg hover:from-green-600 hover:to-green-500 transition cursor-pointer"
                          style={{ height: `${(data.value / 12450) * 240}px` }}
                        ></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {data.value}€
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports/Logs Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Rechercher dans les logs..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Tous les types</option>
                    <option>Réservations</option>
                    <option>Événements</option>
                    <option>Utilisateurs</option>
                    <option>Admin</option>
                  </select>
                  <Button variant="outline" className="gap-2">
                    <Download size={20} />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* Super Admin Section - Actions des admins */}
              {user?.id === 1 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <UserRoundCog size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Actions des administrateurs</h3>
                      <p className="text-sm text-gray-600">Inaccesible des {adminsData.length -1 || ''} autres administrateurs</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    {logs.data.map((log, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          log.severity === 'high' ? 'bg-red-500' :
                          log.severity === 'medium' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{log.logs_admin_firstname} {log.logs_admin_lastname}</span>
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">{log.logs_admin_type}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(log.logs_created).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {/* <p className="text-sm font-medium text-gray-700">{log.action}</p> */}
                          <p className="text-xs text-gray-500 mt-1">{log.logs_description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Pagination */}
              <PaginationControls
                currentPage={logsPage}
                totalPages={logs.totalPages}
                totalItems={logs.totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setLogsPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}

          {/* Settings Tab */}
          {/* {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings size={20} />
                    Paramètres généraux
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de la plateforme
                      </label>
                      <input
                        type="text"
                        defaultValue="EventHub"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        defaultValue="contact@eventhub.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuseau horaire
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Europe/Paris (GMT+1)</option>
                        <option>Europe/London (GMT+0)</option>
                        <option>America/New_York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell size={20} />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Nouvelles réservations', checked: true },
                      { label: 'Nouveaux utilisateurs', checked: true },
                      { label: 'Modifications d\'événements', checked: false },
                      { label: 'Alertes système', checked: true },
                      { label: 'Rapports hebdomadaires', checked: true },
                    ].map((setting, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                        <span className="text-sm text-gray-700">{setting.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={setting.checked} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Sécurité
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Authentification à deux facteurs</p>
                        <p className="text-xs text-gray-500">Sécurisez votre compte</p>
                      </div>
                      <Button variant="outline" size="sm">Activer</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Sessions actives</p>
                        <p className="text-xs text-gray-500">2 appareils connectés</p>
                      </div>
                      <Button variant="outline" size="sm">Gérer</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Changer le mot de passe</p>
                        <p className="text-xs text-gray-500">Dernière modification il y a 3 mois</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 size={20} />
                    Plateforme
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mode maintenance
                      </label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Désactiver temporairement la plateforme</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup automatique
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Quotidien</option>
                        <option>Hebdomadaire</option>
                        <option>Mensuel</option>
                      </select>
                    </div>
                    <Button variant="destructive" className="w-full gap-2">
                      <Trash2 size={20} />
                      Effacer le cache
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Annuler</Button>
                <Button className="gap-2">
                  <CheckCircle size={20} />
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          )} */}
        </div>
      </main>
      
      {/* Create Event Modal */}
      <CreateEventModal open={createEventModalOpen} onClose={() => {setCreateEventModalOpen(false); setEvent_idModal(0); fetchEvents()}} isCreate={isModalCreateEvent} event_id={event_idModal} userData={userData} />

      {/* Create Admin Modal */}
      <CreateAdminModal open={createAdminModalOpen} onClose={() => {setCreateAdminModalOpen(false); setAdmin_idModal(0); fetchAdmins()}} isCreate={isModalCreateAdmin} admin_id={admin_idModal} userData={userData} />

      {/* Create User Modal */}
      <CreateUserModal open={createUserModalOpen} onClose={() => {setCreateUserModalOpen(false); setUser_idModal(0); fetchUsers()}} isCreate={isModalCreateUser} user_id={user_idModal} userData={userData} />

      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} user={user} userData={formatUserData} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  session.user.name = null;

  return { props: { user: session.user } };
}