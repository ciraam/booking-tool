'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAppDispatch } from '../store/hooks';
import { addBooking } from '../store/bookingSlice';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, Ticket, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const BookingModal = ({ event, user, userData, open, onClose, selectedTickets }) => {
  const [step, setStep] = useState(1);
  const totalStep = event.event_price === 0 ? [1, 2, 3] : [1, 2, 3, 4];
  const [formData, setFormData] = useState({
    firstname: user? userData?.user_firstname : null,
    lastname: user? userData?.user_lastname : null,
    email: user? user?.email : null,
    phone: user? userData?.user_phone : null,
  });
  const [bookingId, setBookingId] = useState('');
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const totalAmount = selectedTickets.reduce((sum, t) => sum + t.price * t.quantity, 0);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Impossible de créer la réservation');
      return res.json();
    },
    onSuccess: (booking) => {
      toast({
        title: 'Réservation confirmée !',
        description: `Votre billet (#${booking.booking_id}) a été créé et envoyé par email (Simulation)`,
        className: 'bg-green-500 text-white',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        className: 'bg-red-500 text-white',
      });
    },
  });

  const dynamicButton = () => {
    if (totalStep.length === 3 && step === 2) {
      return (<><Check className="w-4 h-4 mr-2" />Confirmer la réservation</>);
    }
    if (totalStep.length === 4 && step === 3) {
      return (<><CreditCard className="w-4 h-4 mr-2" />Confirmer le paiement</>);
    }

    return (<>Suivant<ArrowRight className="w-4 h-4 ml-2" /></>);
  };

  const phoneValidation = (value) => {
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    if (value === null) {
      return false;
    }  else if (phoneRegex.test(value.replace(/ /g, ""))) {
      return true;
    } else {
      return false;
    }
  };  

  const handleNext = () => {
    if (step === 2 && totalStep.length === 4) {

    }
    if (step < totalStep.length) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // const handlePhoneChange = (e) => {
  //   let value = e.target.value;
  //   // Autoriser seulement chiffres, + et espaces
  //   value = value.replace(/[^\d+ ]/g, "");
  //   // Limite selon le préfixe
  //   if (value.startsWith("+33")) {
  //     value = value.slice(0, 16); // +33 6 12 34 56 78
  //   } else if (value.startsWith("0")) {
  //     value = value.slice(0, 14); // 06 12 34 56 78
  //   } else {
  //     value = value.slice(0, 16); // limite par défaut
  //   }
  //   // Formatage automatique
  //   if (value.startsWith("+33")) {
  //     value = value
  //       .replace(/\D/g, "")
  //       .replace(/^33/, "+33 ")
  //       .replace(/(\d{1})(\d{2})/g, "$1 $2")
  //       .trim();
  //   } else if (value.startsWith("0")) {
  //     value = value
  //       .replace(/\D/g, "")
  //       .replace(/(\d{2})(?=\d)/g, "$1 ")
  //       .trim();
  //   }
  //   setFormData({ ...formData, phone: value });
  // };
  
  const handleConfirmBooking = () => {
    if (!event) return;
    if(!phoneValidation(formData.phone)) {
      toast({
        title: 'Informations incomplètes',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone) {
      toast({
        title: 'Informations incomplètes',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }
    dispatch(addBooking({
      id: event.event_id,
      name: event.event_name,
      description: event.event_description,
      date: event.event_date,
      time: event.event_time,
      location: event.event_location,
      address: event.event_address,
      category: event.event_name,
      organizer: event.event_name,
      created: new Date().toISOString(),
      image: event.event_image,
      price: event.event_price,
      totalAmount,
      customerInfo: formData,
    }));

    const generatedId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    setBookingId(generatedId);
    setStep(totalStep.length);

    const payload = {
      booking_id: generatedId,
      booking_event_id: event.event_id,
      booking_user_id: user?.id || null,
      booking_user_firstname: formData.firstname,
      booking_user_lastname: formData.lastname,
      booking_user_email: formData.email,
      booking_user_phone: formData.phone,
      booking_price: selectedTickets[0].price,
      booking_quantity: selectedTickets[0].quantity,
    };

    mutation.mutate(payload);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    setBookingId('');
    onClose();
  };

  const handleViewBookings = () => {
    handleClose();
    router.push('/reservations');
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Réservation</DialogTitle>
        </DialogHeader>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-6">
          {totalStep.map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  s <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < totalStep.length && (
                <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-primary' : 'bg-secondary'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Récapitulatif */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-semibold text-lg mb-4">Récapitulatif de votre sélection</h3>
                <div className="bg-secondary rounded-lg p-4 space-y-3">
                  <div className="flex gap-4">
                    <img src={`/events/${event.event_image}`} alt={event.event_name} className="w-24 h-24 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-semibold">{event.event_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })} à {event.event_time.split(':').slice(0,2).join(':')}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.event_location}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {selectedTickets.map((ticket) => (
                  <div key={ticket.ticketTypeId} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{ticket.ticketTypeName}</p>
                      <p className="text-sm text-muted-foreground">Quantité: {ticket.quantity}</p>
                    </div>
                    <p className="font-semibold">{ticket.price * ticket.quantity}€</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{totalAmount}€</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Informations personnelles */}
           {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-lg mb-4">Vos informations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={user? userData?.user_firstname : formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={userData?.user_lastname || formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={userData?.user_phone || formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33612345678"
                  inputMode="numeric"
                  pattern="^\+?[0-9]{9,15}$"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Paiement */}
          {step === 3 && totalStep.length === 4 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-lg mb-4">Paiement</h3>
              <div className="bg-secondary rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-2">Montant total</p>
                <p className="text-3xl font-bold text-primary">{totalAmount}€</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input id="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <Input id="expiry" placeholder="MM/AA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                🔒 Paiement sécurisé (Simulation)
              </p>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === totalStep.length && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Réservation confirmée !</h3>
                <p className="text-muted-foreground">Votre numéro de réservation</p>
                <p className="text-xl font-mono font-bold text-primary mt-2">{bookingId}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-left">
                <h4 className="font-semibold mb-2">Détails de votre réservation</h4>
                <p className="text-sm text-muted-foreground">{event.event_name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: fr })} à {event.event_time.split(':').slice(0,2).join(':')}
                </p>
                <p className="text-sm font-semibold mt-2">{totalAmount}€</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Un email de confirmation avec {selectedTickets.quantity > 1 ? `vos billets` : `votre billet`} a été envoyé à {user?.email || formData.email}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          {step < totalStep.length && (
            <>
              <Button variant="outline" onClick={step === 1 ? handleClose : handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? 'Annuler' : 'Précédent'}
              </Button>
              <Button onClick={step === 3 && totalStep.length === 4 || step === 2 && totalStep.length === 3 ? handleConfirmBooking : handleNext} className="relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100">
                {dynamicButton()}
              </Button>
            </>
          )}
          {step === totalStep.length && (
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Télécharger le billet (Simulation)
              </Button>
              <Button onClick={handleViewBookings} className="gradient-primary flex-1">
                <Ticket className="w-4 h-4 mr-2" />
                Mes réservations
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};