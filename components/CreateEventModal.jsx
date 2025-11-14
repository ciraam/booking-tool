import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Pin, Search, Filter, MoreVertical, Edit, Trash2, Eye, Download, Calendar, Clock, MapPin, CalendarCog, Phone, Users, XCircle, AlertCircle, TrendingUp, TrendingDown, Plus, Upload, DollarSign, Image as ImageIcon } from 'lucide-react';

export function CreateEventModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    address: '',
    organizer: '',
    price: '',
    seats: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['Concert', 'Conférence', 'Festival', 'Sport', 'Théâtre', 'Exposition', 'Autre'];

  const categoryColors = {
    'Concert': 'bg-purple-100 text-purple-800 border-purple-200',
    'Conférence': 'bg-blue-100 text-blue-800 border-blue-200',
    'Festival': 'bg-pink-100 text-pink-800 border-pink-200',
    'Sport': 'bg-green-100 text-green-800 border-green-200',
    'Théâtre': 'bg-red-100 text-red-800 border-red-200',
    'Exposition': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Autre': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Remplacer par ton vrai appel API
    try {
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach(key => {
      //   formDataToSend.append(key, formData[key]);
      // });
      
      // const response = await fetch('/api/events', {
      //   method: 'POST',
      //   body: formDataToSend
      // });
      
      // if (!response.ok) throw new Error('Erreur création');
      
      console.log('Création événement:', formData);
      
      // Simule un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
      // Recharge les événements
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date non définie';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCog size={24} />
            Créer un nouvel événement
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un événement
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image de l'événement</Label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="event-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('event-image').click()}
                    className="gap-2"
                  >
                    <Upload size={20} />
                    Choisir une image
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, WEBP (max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Nom & Catégorie */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'événement *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Concert Rock Festival"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre événement..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Date & Heure */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Heure *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Lieu & Adresse */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Ville *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Paris"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 rue de la République, 75001 Paris"
                  required
                />
              </div>
            </div>

            {/* Organisateur */}
            <div className="space-y-2">
              <Label htmlFor="organizer">Organisateur *</Label>
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                placeholder="Nom de l'organisateur"
                required
              />
            </div>

            {/* Prix & Places */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€) *</Label>
                <div className="relative">
                  <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="pl-10 bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500">Mettre 0 pour un événement gratuit</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats">Nombre de places *</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  value={formData.seats}
                  onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                  placeholder="100"
                  required
                />
              </div>
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
                    Créer l'événement
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Aperçu en temps réel */}
          <div className="space-y-4">
            <div className="sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Aperçu</h3>
              </div>
              
              {/* Card Preview */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  {formData.category && (
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[formData.category] || 'bg-gray-100 text-gray-800'}`}>
                        {formData.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Titre */}
                  <h3 className="text-2xl font-bold text-gray-800">
                    {formData.name || 'Nom de l\'événement'}
                  </h3>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">{formatDate(formData.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">{formData.time || '--:--'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">{formData.location || 'Ville'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">{formData.seats || '0'} places</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {formData.description || 'La description de votre événement apparaîtra ici...'}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Organisé par</p>
                      <p className="text-sm font-medium text-gray-800">{formData.organizer || 'Organisateur'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Prix</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formData.price ? (parseFloat(formData.price) === 0 ? 'Gratuit' : `${formData.price}€`) : 'Gratuit'}
                      </p>
                    </div>
                  </div>

                  {/* Adresse */}
                  {formData.address && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Adresse</p>
                      <p className="text-sm text-gray-700">{formData.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info helper */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>Astuce :</strong> Cet aperçu vous montre comment votre événement apparaîtra aux utilisateurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}