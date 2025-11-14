import Link from 'next/link';
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname } from 'next/navigation';
import { Calendar, Menu, X, CircleUserRound } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginRegisterModal } from './LoginRegisterModal.jsx';
import { ProfileModal } from './ProfileModal.jsx';
import { useRouter } from "next/router";

export const Header = ({ user, userData, isDisconnect, isOnline }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginRegisterModalOpen, setLoginRegisterModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { label: 'Événements', path: '/' },
    { label: 'Mes réservations', path: '/reservations' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => pathname === path;

  if(user?.role === "admin") router.push("/f753qJkJ");

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-glow transition-transform group-hover:scale-110">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SLC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
          {/* Si l'utilisateur est connecté */}
          {!isDisconnect && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-3 px-5 py-6 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{userData?.user_pseudo? userData?.user_pseudo : userData?.user_firstname + ' ' + userData?.user_lastname}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                      {<img src={userData?.user_image} alt={`Image du profil de ${userData?.user_firstname}`} className="w-full h-full rounded-full object-cover"/> || userData?.user_firstname?.[0]?.toUpperCase()}
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
                <DropdownMenuItem onClick={() => signOut()}>
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isDisconnect && (<div className="hidden md:block">
            <Button
              className="relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
              onClick={() => setLoginRegisterModalOpen(true)}
            >
              Se connecter / S'inscrire
            </Button>
          </div>)}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path} // ✅ href au lieu de to
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* Si l'utilisateur est connecté */}
              {!isDisconnect && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-3 px-3 py-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">{user?.pseudo}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                          {userData?.user_image || user?.pseudo?.[0]?.toUpperCase() || "U"}
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
                    <DropdownMenuItem onClick={() => signOut()}>
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {isDisconnect && (<div className="hidden md:block">
                <Button
                  className="relative overflow-hidden gradient-primary shadow-glow transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full after:absolute after:inset-0 after:bg-black/30 after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
                  onClick={() => setLoginRegisterModalOpen(true)}
                >
                  Se connecter / S'inscrire
                </Button>
              </div>)}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginRegisterModal open={loginRegisterModalOpen} onClose={() => setLoginRegisterModalOpen(false)} />
      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} user={user} userData={userData} />
    </header>
  );
};