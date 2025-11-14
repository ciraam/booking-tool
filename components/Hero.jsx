'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { motion } from 'framer-motion';

export const Hero = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={'/hero-bg.jpg'}
          alt="Hero background"
          className="w-full h-full object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Découvrez les{' '}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                événements SLC
              </span>{' '}
              près de chez vous
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Association SLC : concerts, festivals, conférences, événements sportifs et activités associatives
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="flex gap-2 p-2 glass rounded-2xl shadow-hover">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher un événement par nom ou lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              {/* <Button className="h-12 px-8 gradient-primary shadow-glow">
                Rechercher
              </Button> */}
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 text-sm"
          >
            <span className="text-muted-foreground">Catégories populaires :</span>
            {['Concert', 'Festival', 'Sport', 'Conférence'].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {cat}
              </button>
            ))}
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};

