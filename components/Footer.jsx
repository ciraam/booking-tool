// "use client";
// import { Calendar, Mail, MapPin, Phone } from 'lucide-react';
// import { Link } from 'react-router-dom';

// export const Footer = () => {
//   return (
//     <footer className="bg-card border-t mt-20">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
//                 <Calendar className="w-6 h-6 text-primary-foreground" />
//               </div>
//               <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 SLC
//               </span>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Plateforme de réservation d'événements de l'association SLC. Découvrez et participez à nos activités associatives.
//             </p>
//           </div>

//           {/* Navigation */}
//           <div>
//             <h3 className="font-semibold mb-4">Navigation</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>
//                 <Link to="/" className="hover:text-primary transition-colors">
//                   Événements
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/reservations" className="hover:text-primary transition-colors">
//                   Mes Réservations
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/contact" className="hover:text-primary transition-colors">
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Catégories */}
//           <div>
//             <h3 className="font-semibold mb-4">Catégories</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>Concerts</li>
//               <li>Conférences</li>
//               <li>Sports</li>
//               <li>Festivals</li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="font-semibold mb-4">Contact</h3>
//             <ul className="space-y-3 text-sm text-muted-foreground">
//               <li className="flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 contact@slc-asso.fr
//               </li>
//               <li className="flex items-center gap-2">
//                 <Phone className="w-4 h-4" />
//                 +33 1 23 45 67 89
//               </li>
//               <li className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4" />
//                 Paris, France
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
//           <p>&copy; 2025 SLC. Tous droits réservés.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };
import Link from 'next/link';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SLC
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plateforme de réservation d'événements de l'association SLC. Découvrez et participez à nos activités associatives.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-primary transition-colors">
                  Mes Réservations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Concerts</li>
              <li>Conférences</li>
              <li>Sports</li>
              <li>Festivals</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@slc-asso.fr
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SLC. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
