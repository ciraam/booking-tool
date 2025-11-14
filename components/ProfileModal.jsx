import { useState, useEffect, useRef } from 'react';
import { useToast } from '../hooks/use-toast.jsx';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Mail, Phone, Camera, Check, Loader2, Lock, SquareUser, X, Eye, EyeOff } from 'lucide-react';

export function ProfileModal({ open, onClose, user, userData }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formDataOrigin, setFormDataOrigin] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    pseudo: '',
    image: ''
  });
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    pseudo: '',
    image: ''
  });
  const { toast } = useToast();
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});

  useEffect(() => {
    if(user?.role === 'user') {
      if (userData) {
        setFormDataOrigin({
          firstname: userData.user_firstname || '',
          lastname: userData.user_lastname || '',
          phone: userData.user_phone || '',
          pseudo: userData.user_pseudo || '',
          image: userData.user_image || ''
        });
        setFormData({
          firstname: userData.user_firstname || '',
          lastname: userData.user_lastname || '',
          phone: userData.user_phone || '',
          pseudo: userData.user_pseudo || '',
          image: userData.user_image || ''
        });
        setPreview(userData.user_image || null);
      }
    } else if(user?.role === 'admin') {
      if (userData) {
        setFormDataOrigin({
          firstname: userData.admin_firstname || '',
          lastname: userData.admin_lastname || '',
          pseudo: userData.admin_pseudo || '',
          image: userData.admin_image || ''
        });
        setFormData({
          firstname: userData.admin_firstname || '',
          lastname: userData.admin_lastname || '',
          pseudo: userData.admin_pseudo || '',
          image: userData.admin_image || ''
        });
        setPreview(userData.admin_image || null);
      }
    }
    
  }, [userData, saved, open]);

  const fetchVerifPhone = async (phone) => {
    try {
      const res = await fetch(`/api/users/verifPhone?phone=${phone}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data;
    } catch (error) {
      return [];
    }
  };

  const phoneValidation = (value) => {
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    if (!value) return false;
    return phoneRegex.test(value.replace(/ /g, ""));
  };

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

  // Fonction pour sauvegarder un champ dans la BDD
  const handleBlur = async (field) => {
    const value = field === 'password' ? password : formData[field];

    // Validation téléphone
    if (field === "phone") {
      if (!phoneValidation(value)) {
        toast({
          title: 'Numéro de téléphone invalide',
          description: 'Veuillez renseigner un numéro de téléphone valide',
          variant: 'destructive',
        });
        return;
      }
      
      const verifPhone = await fetchVerifPhone(value);
      // ✅ Vérifie que le téléphone trouvé n'est pas celui de l'utilisateur actuel et s'il est déjà enregistré par autrui
      if (verifPhone.length >= 1 && verifPhone[0].user_id !== user.id) {
        toast({
          title: 'Numéro de téléphone déjà enregistré',
          description: 'Veuillez renseigner un numéro de téléphone non utilisé',
          variant: 'destructive',
        });
        return;
      }
    }

    // Ne sauvegarde que si la valeur a changé
    if (value === formDataOrigin[field]) return;

    setSaving(prev => ({ ...prev, [field]: true }));
    setSaved(prev => ({ ...prev, [field]: false }));

    try {
      const fieldBd = `${user?.role}_${field}`;
      const response = await fetch(`/api/${user?.role}s/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldBd]: String(value) })
      });
      if (!response.ok) throw new Error('Erreur de sauvegarde');
      await response.json();

      setSaved(prev => ({ ...prev, [field]: true }));
      toast({
        title: 'Modification effectuée',
        description: 'Votre modification a été sauvegardée',
        className: 'bg-green-500 text-white',
      });

      setTimeout(() => {
        setSaved(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur lors de la sauvegarde',
        description: 'Restauration du champs modifié',
        variant: 'destructive',
      });
      setFormData(prev => ({ ...prev, [field]: user?.role[field] }));
    } finally {
      setSaving(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Déclenche le clic sur l'input file
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Fonction upload d'image (dans ProfileModal)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Vérifie le type de fichier côté client
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Fichier invalide',
        description: 'Formats acceptés : JPG, PNG, WEBP, GIF',
        variant: 'destructive',
      });
      return;
    }

    // ✅ Vérifie la taille (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: 'Fichier trop volumineux',
        description: `Taille maximale : 2MB (votre fichier : ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        variant: 'destructive',
      });
      return;
    }

    // ✅ Crée un aperçu local immédiatement
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setSaving(prev => ({ ...prev, image: true }));

    try {
      // ✅ Envoie le fichier
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const resUpload = await fetch(`/api/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!resUpload.ok) {
        const errorData = await resUpload.json();
        throw new Error(errorData.message || "Erreur d'upload");
      }

      const data = await resUpload.json();
      const imageUrl = data.fileUrl; // Ex: /profiles/user-123-1234567890.jpg

      // ✅ Met à jour en BDD
      const fieldBdImage = `${user?.role}_image`;
      const resUpdate = await fetch(`/api/${user?.role}s/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldBdImage]: imageUrl })
      });

      if (!resUpdate.ok) throw new Error('Erreur mise à jour BDD');

      // ✅ Met à jour le state local
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setPreview(imageUrl);

      toast({
        title: 'Image mise à jour',
        description: 'Votre photo de profil a été modifiée',
        className: 'bg-green-500 text-white',
      });

      setSaved(prev => ({ ...prev, image: true }));
      setTimeout(() => {
        setSaved(prev => ({ ...prev, image: false }));
      }, 2000);
    } catch (err) {
      console.error('Erreur upload:', err);
      toast({
        title: "Erreur lors de l'upload",
        description: err.message || "Une erreur est survenue",
        variant: 'destructive',
      });
      // ✅ Restaure l'ancienne image
      setPreview(user.image || null);
    } finally {
      setSaving(prev => ({ ...prev, image: false }));
    }
  };

  if (!open || !user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile de {formDataOrigin.pseudo || `${formDataOrigin.firstname} ${formDataOrigin.lastname}`}</DialogTitle>
          <DialogDescription>
            Consultez ou modifiez vos informations personnelles
          </DialogDescription>
        </DialogHeader>

        {/* Photo de profil */}
        <div className="flex flex-col items-center my-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                formDataOrigin.firstname?.[0]?.toUpperCase() || "U"
              )}
            </div>
            
            {/* ✅ Bouton cliquable avec onClick */}
            <button
              type="button"
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-blue-700"
            >
              {saving.image ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </button>

            {/* Input caché */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Membre depuis le {new Date(user.created).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">
          {/* Prénom & Nom */}
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              label="Prénom"
              icon={<SquareUser size={18} />}
              value={formData.firstname}
              onChange={(value) => handleChange('firstname', value)}
              onBlur={() => handleBlur('firstname')}
              saving={saving.firstname}
              saved={saved.firstname}
            />
            <EditableField
              label="Nom"
              icon={<SquareUser size={18} />}
              value={formData.lastname}
              onChange={(value) => handleChange('lastname', value)}
              onBlur={() => handleBlur('lastname')}
              saving={saving.lastname}
              saved={saved.lastname}
            />
          </div>

          {/* Téléphone ou Pseudo & Email */}
          {user.role === 'user' && (<div className="grid grid-cols-2 gap-4">
            <EditableField
              label="Téléphone"
              icon={<Phone size={18} />}
              type="tel"
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
              onBlur={() => handleBlur('phone')}
              saving={saving.phone}
              saved={saved.phone}
            />
            <EditableField
              label="Email"
              icon={<Mail size={18} />}
              type="email"
              value={user?.email}
              onChange={(value) => handleChange('email', value)}
              onBlur={() => handleBlur('email')}
              saving={saving.email}
              saved={saved.email}
              disabled
            />
          </div>)}
          {user.role === 'admin' && (<div className="grid grid-cols-2 gap-4">
            <EditableField
              label="Pseudo"
              icon={<SquareUser size={18} />}
              value={formData.pseudo}
              onChange={(value) => handleChange('pseudo', value)}
              onBlur={() => handleBlur('pseudo')}
              saving={saving.pseudo}
              saved={saved.pseudo}
            />
            <EditableField
              label="Email"
              icon={<Mail size={18} />}
              type="email"
              value={user?.email}
              onChange={(value) => handleChange('email', value)}
              onBlur={() => handleBlur('email')}
              saving={saving.email}
              saved={saved.email}
              disabled
            />
          </div>)}

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
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
                className="w-full pl-10 pr-10 py-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                onBlur={() => handleBlur('password')}
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
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Auto-sauvegarde :</strong> Sortir du champ enregistre automatiquement vos changements.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

// Composant de champ éditable
function EditableField({ label, icon, type = 'text', value, onChange, onBlur, saving, saved, disabled }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
          }`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {saving && <Loader2 size={18} className="text-blue-600 animate-spin" />}
          {saved && <Check size={18} className="text-green-600" />}
        </div>
      </div>
    </div>
  );
}