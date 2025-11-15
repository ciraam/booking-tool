import { useState, useEffect, useRef } from 'react';
import { useToast } from '../hooks/use-toast.jsx';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Camera, Check, Loader2, Lock, SquareUser, X, EyeOff } from 'lucide-react';
import { Pin, Search, Filter, MoreVertical, Edit, Trash2, Eye, Download, UserRoundCog, Clock, MapPin, Mail, Phone, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Plus, Upload, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';

export function CreateAdminModal({ open, onClose, isCreate, admin_id, userData }) {
  const [formDataOrigin, setFormDataOrigin] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    pseudo: '',
    image: '',
    type: ''
  });
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    pseudo: '',
    email: '',
    password: '',
    role: '',
    type: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false)
  const { toast } = useToast();
  const [verifEmail, setVerifEmail] = useState('');

  const roles = ['Super Admin', 'Admin', 'Modérateur'];

  const fetchVerifEmail = async () => {
    try {
      const res = await fetch(`/api/admins/verifEmail?email=${formData.email}`);
      if (!res.ok) throw new Error('Email introuvable');
      const data = await res.json();
      setVerifEmail(data);
      return data;
    } catch (error) {
      setVerifEmail([]);
      return error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    fetchVerifEmail();
    if(verifEmail.length >= 1) {
      toast({
        title: 'Email déjà enregistré',
        description: 'Veuillez renseigner un email non utilisé',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Erreur création');
      // console.log('Création admin:', formData);
      // Simule un délai
      // await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const { data: adminData, refetch: fetchAdmins, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admin', admin_id],
    queryFn: async () => {
      setAdminsLoading(true);
      const res = await fetch(`/api/admins/${admin_id}`);
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setAdminsLoading(false);
      return data;
    },
    enabled: admin_id !== 0,
  });

  useEffect(() => {
    if (adminData) {
      setFormDataOrigin({
        firstname: adminData.admin_firstname || '',
        lastname: adminData.admin_lastname || '',
        pseudo: adminData.admin_pseudo || '',
        image: adminData.admin_image || '',
        type: adminData.admin_type || ''
      });
      setFormData({
        firstname: adminData.admin_firstname || '',
        lastname: adminData.admin_lastname || '',
        pseudo: adminData.admin_pseudo || '',
        image: adminData.admin_image || '',
        type: adminData.admin_type || ''
      });
      setShowModal(true);
    }
  }, [adminData, saved]);

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

  const handleBlur = async (field) => {
    const value = field === 'password' ? password : formData[field];
    
    const allValid = validatedCriteria.every(Boolean);
    if (field === 'password' && !allValid) {
      toast({
        title: 'Mot de passe trop faible',
        description: 'Merci de respecter tous les critères de sécurité',
        variant: 'destructive',
      });
      return;
    }
    // Ne sauvegarde que si la valeur a changé
    if (value === formDataOrigin[field]) return;

    if (value === 'type') console.log(formData.type);

    setSaving(prev => ({ ...prev, [field]: true }));
    setSaved(prev => ({ ...prev, [field]: false }));

    try {
      const fieldBd = `admin_${field}`;
      const response = await fetch(`/api/admins/${admin_id}`, {
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
      setFormData(prev => ({ ...prev, [field]: userData?.role[field] }));
    } finally {
      setSaving(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isCreate) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserRoundCog size={24} />
              Ajouter un administrateur
            </DialogTitle>
            <DialogDescription>
              Créez un nouveau compte administrateur avec des permissions spécifiques
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom *</Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                  placeholder="Sophie"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nom *</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                  placeholder="Martin"
                  required
                />
              </div>
            </div>

            {/* Pseudo */}
            <div className="space-y-2">
              <Label htmlFor="pseudo">Pseudo</Label>
              <Input
                id="pseudo"
                value={formData.pseudo}
                onChange={(e) => setFormData(prev => ({ ...prev, pseudo: e.target.value }))}
                placeholder="sophie_admin"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="sophie.admin@eventhub.com"
                required
              />
            </div>

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
            

            {/* Rôle */}
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Role descriptions */}
            <div className="bg-green-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-blue-900">Permissions par rôle :</p>
              <ul className="text-xs text-blue-800 space-y-1 ml-4">
                <li>• <strong>Super Admin :</strong> Accès complet, gestion des admins et consulation des logs en plus</li>
                <li>• <strong>Admin :</strong> Gestion des utilisateurs en plus</li>
                <li>• <strong>Modérateur :</strong> Gestion des événements, consultation des statistiques et des réservations uniquement</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Créer l'administrateur
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      showModal && (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRoundCog size={24} />
            Modifier un administrateur
          </DialogTitle>
          <DialogDescription>
            Possibilité de changer les permissions, mot de passe, etc
          </DialogDescription>
        </DialogHeader>

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

          {/* Pseudo & Email */}
          <div className="grid grid-cols-2 gap-4">
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
              value={adminData.admin_email}
              onChange={(value) => handleChange('email', value)}
              onBlur={() => handleBlur('email')}
              saving={saving.email}
              saved={saved.email}
              disabled
            />
          </div>

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

          {/* Rôle */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onBlur={() => handleBlur('type')}
              required
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Role descriptions */}
          <div className="bg-green-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-blue-900">Permissions par rôle :</p>
            <ul className="text-xs text-blue-800 space-y-1 ml-4">
              <li>• <strong>Super Admin :</strong> Accès complet, gestion des admins et consulation des logs en plus</li>
              <li>• <strong>Admin :</strong> Gestion des utilisateurs en plus</li>
              <li>• <strong>Modérateur :</strong> Gestion des événements, consultation des statistiques et des réservations uniquement</li>
            </ul>
          </div>

        {/* Info */}
        <div className="t-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Auto-sauvegarde :</strong> Sortir du champ enregistre automatiquement vos changements.
          </p>
        </div>
      </DialogContent>
    </Dialog>
    )
      
    );
  }
}

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