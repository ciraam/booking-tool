import { signIn } from "next-auth/react";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAppDispatch } from '../store/hooks';
import { addUser, setUser } from '../store/userSlice';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Phone, UserPlus, X, Eye, EyeOff, LogIn, Key, SquareUser, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const LoginRegisterModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verifEmail, setVerifEmail] = useState('');
  const [verifPhone, setVerifPhone] = useState('');
  // const [formData, setFormData] = useState({
  //   firstname: '',
  //   lastname: '',
  //   email: '',
  //   phone: '',
  //   password: '',
  // });
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const modalType = (s) => { const type = ["Connexion", "Inscription", "Mot de passe oublié"]; return type[s] };

  // const handleChange = (field) => (e) => {
  //   setFormData(prev => ({ ...prev, [field]: e.target.value }));
  // };
  
  const connection = async () => {
    setLoading(true);

    const result = await signIn("user-login", {
      redirect: false,
      email,
      password,
    });
    if (result.error) {
      toast({
        title: 'Erreur',
        description: 'Mauvais email ou mot de passe',
        className: 'bg-red-500 text-white',
      });
    } else {
      router.push("/");
      toast({
        title: 'Connexion réussie !',
        className: 'bg-green-500 text-white',
      });
    }
    setLoading(false);
  };

  const fetchVerifEmail = async () => {
    try {
      const res = await fetch(`/api/users/verifEmail?email=${email}`);
      if (!res.ok) throw new Error('Email introuvable');
      const data = await res.json();
      setVerifEmail(data);
      return data;
    } catch (error) {
      setVerifEmail([]);
      return error;
    }
  };

  const fetchVerifPhone = async () => {
    try {
      const res = await fetch(`/api/users/verifPhone?phone=${phone}`);
      if (!res.ok) throw new Error('Email introuvable');
      const data = await res.json();
      setVerifPhone(data);
      return data;
    } catch (error) {
      setVerifPhone([]);
      return error;
    }
  };

  const newUser = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/users/newUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Impossible de créer votre compte');
      return res.json();
    },
    onSuccess: (user) => {
      toast({
        title: 'Compte créé !',
        description: `Un email de confirmation de compte vous a été envoyé à votre adresse email (${user.user_email})`, // faire l'envoi du mail de confirmation !!
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

  // const handlePhoneChange = useCallback((e) => {
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
  //   // if (value.startsWith("+33")) {
  //   //   value = value
  //   //     .replace(/\D/g, "")
  //   //     .replace(/^33/, "+33 ")
  //   //     .replace(/(\d{1})(\d{2})/g, "$1 $2")
  //   //     .trim();
  //   // } else if (value.startsWith("0")) {
  //   //   value = value
  //   //     .replace(/\D/g, "")
  //   //     .replace(/(\d{2})(?=\d)/g, "$1 ")
  //   //     .trim();
  //   // }
  //   setFormData({ ...formData, phone: value });
  // }, []);

  // Critères de validation
  const criteria = [
    {
      label: 'Au moins 12 caractères',
      test: (pwd) => pwd.length >= 12,
      color: 'bg-blue-500'
    },
    {
      label: '4 majuscules minimum',
      test: (pwd) => (pwd.match(/[A-Z]/g) || []).length >= 4,
      color: 'bg-green-500'
    },
    {
      label: '4 minuscules minimum',
      test: (pwd) => (pwd.match(/[a-z]/g) || []).length >= 4,
      color: 'bg-yellow-500'
    },
    {
      label: '2 chiffres minimum',
      test: (pwd) => (pwd.match(/[0-9]/g) || []).length >= 2,
      color: 'bg-orange-500'
    },
    {
      label: 'Un caractère spécial (!@#$...)',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      color: 'bg-purple-500'
    }
  ];

  // Calcule quels critères sont validés
  const validatedCriteria = criteria.map(c => c.test(password || ''));

  const handleNewUser = () => {
    if (firstname === '' || lastname === ''|| email === '' || phone === '' || password === '') {
      toast({
        title: 'Informations incomplètes',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }
    if(!phoneValidation(phone)) {
      toast({
        title: 'Numéro de téléphone invalide',
        description: 'Veuillez renseigner un numéro de téléphone valide',
        variant: 'destructive',
      });
      return;
    }
    fetchVerifPhone();
    if(verifPhone.length >= 1) {
      toast({
        title: 'Numéro de téléphone déjà enregistré',
        description: 'Veuillez renseigner un numéro de téléphone non utilisé',
        variant: 'destructive',
      });
      return;
    }
    fetchVerifEmail();
    if(verifEmail.length >= 1) {
      toast({
        title: 'Email déjà enregistré',
        description: 'Veuillez renseigner un email non utilisé',
        variant: 'destructive',
      });
      return;
    }

    dispatch(addUser({
      firstname: firstname,
      lastname: lastname,
      pseudo: pseudo? pseudo : '',
      email: email,
      phone: phone,
      created: new Date().toISOString(),
    }));

    const payload = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      password: password,
    };

    newUser.mutate(payload);
    setStep(1);
  };

  const handleConnect = () => {
    if (email === '' || password === '') {
      toast({
        title: 'Information incomplète',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }
    // dispatch(setUser({
    //   firstname: firstname,
    //   lastname: lastname,
    //   pseudo: pseudo,
    //   email: email,
    //   phone: phone,
    //   created: new Date().toISOString(),
    // }));

    connection();
    handleClose();
  };

  const handleNewPassword = () => {
    if (!email) {
      toast({
        title: 'Informations incomplètes',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }
    toast({
        title: 'Nouveau mot de passe envoyé (Simulation) !',
        description: `Un email contenant votre nouveau mot de passe généré vous a été envoyé à votre adresse email (${email})`, // faire l'envoie du mail avec le nouveau mdp généré
        className: 'bg-green-500 text-white',
      });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    // setFormData({ firstName: '', lastName: '', pseudo: '', email: '', phone: '' });
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhone('');
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-center text-3xl mb-4 pb-4 border-b">{modalType(step -1)}</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Connexion */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jean.dupont@exemple.fr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="text-gray-400 hover:text-gray-600" size={20} />
                      ) : (
                        <Eye className="text-gray-400 hover:text-gray-600" size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 justify-center">
                <Button variant="outline" onClick={() => {setStep(2)}} className="flex-1 max-w-[200px]">
                  <UserPlus className="text-black-400" size={20} />
                S'inscrire
              </Button>
              <Button variant="outline" onClick={() => {setStep(3)}} className="flex-1 max-w-[200px]">
                <Key className="text-black-400" size={20} />
                Mot de passe oublié ?
              </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Inscription */}
           {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
        {/* Prénom */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SquareUser className="text-gray-400" size={20} />
            </div>
            <Input
              id="firstName"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Jean"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SquareUser className="text-gray-400" size={20} />
            </div>
            <Input
              id="lastName"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Dupont"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-400" size={20} />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean.dupont@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="text-gray-400" size={20} />
            </div>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33612345678"
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      {/* Mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="text-gray-400" size={20} />
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Critères */}
        {password && (
          <div className="space-y-2 pt-2">
            {criteria.map((criterion, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  validatedCriteria[index] ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {validatedCriteria[index] ? <Check size={16} /> : <X size={16} />}
                <span className={validatedCriteria[index] ? 'font-medium' : ''}>
                  {criterion.label}
                </span>
              </div>
            ))}
          </div>
                    )}
                </div>
            </motion.div>
          )}

          {/* Step 3: Mot de passe oublié */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-secondary rounded-lg p-4 mb-4">
                <p className="justify-center text-m text-muted-foreground mb-2">Veuillez entrer votre email, afin de recevoir un nouveau mot de passe généré, auquel il est vivement conseillé de le modifier après connexion</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@example.com"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              </div>
            </motion.div>
          )}      
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          {step === 1 && (
            <div className="flex gap-3 w-full justify-center">
              <Button
                disabled={loading}
                className="flex-1 max-w-[370px] text-sm py-2 relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
                onClick={handleConnect}
                >
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                'Se connecter'
              )}
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="flex gap-3 w-full justify-center">
              <Button
                disabled={loading}
                className="flex-1 max-w-[370px] text-sm py-2 relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
                onClick={handleNewUser}
                >
                <UserPlus className="w-4 h-4 mr-2" />
                S'inscrire
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="flex gap-3 w-full justify-center">
              <Button
                disabled={loading}
                className="flex-1 max-w-[370px] text-sm py-2 relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
                onClick={handleNewPassword}
                >
                <Key className="w-4 h-4 mr-2" />
                Se souvenir (Simulation)
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};