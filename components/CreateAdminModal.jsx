import { useState, useEffect, useRef } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Pin, Search, Filter, MoreVertical, Edit, Trash2, Eye, Download, UserRoundCog, Clock, MapPin, Mail, Phone, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Plus, Upload, DollarSign, Image as ImageIcon } from 'lucide-react';

export function CreateAdminModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    pseudo: '',
    email: '',
    password: '',
    role: 'Moderator'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = ['Super Admin', 'Moderator', 'Support'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Remplacer par ton vrai appel API
    try {
      // const response = await fetch('/api/admins', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // if (!response.ok) throw new Error('Erreur création');
      
      console.log('Création admin:', formData);
      
      // Simule un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
      // Recharge les admins
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
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
            <Label htmlFor="password">Mot de passe *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="pr-10"
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
            <p className="text-xs text-gray-500">Minimum 8 caractères, avec majuscules et chiffres</p>
          </div>

          {/* Rôle */}
          {/* <div className="space-y-2">
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
          </div> */}

          {/* Role descriptions */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-blue-900">Permissions par rôle :</p>
            <ul className="text-xs text-blue-800 space-y-1 ml-4">
              <li>• <strong>Super Admin :</strong> Accès complet, gestion des admins</li>
              <li>• <strong>Moderator :</strong> Gestion des événements, utilisateurs et réservations</li>
              <li>• <strong>Support :</strong> Consultation et support utilisateurs uniquement</li>
            </ul>
          </div> */}

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
}