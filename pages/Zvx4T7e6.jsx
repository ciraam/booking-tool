import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useToast } from '../hooks/use-toast.jsx';
import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn("admin-login", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (result?.error) {
      const errorMessage = "Identifiants admin incorrects";
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Connexion réussie !',
        description: 'Redirection en cours...',
        className: 'bg-green-500 text-white',
      });
      router.push("/f753qJkJ");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Connexion Admin
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Accédez à votre tableau de bord administrateur
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="admin@exemple.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
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

            {/* Remember & Forgot */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition">
                  Mot de passe oublié ?
                </a>
              </div>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">🔑 Identifiants de démo :</p>
            <p className="text-xs text-blue-700">Email : admin@example.com</p>
            <p className="text-xs text-blue-700">Mot de passe : admin123</p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>Accès réservé aux administrateurs uniquement</p>
            {/* <p className="mt-2">
              Besoin d'aide ?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Contactez le support
              </a>
            </p> */}
          </div>
        </div>
      </div>

      {/* Right side - Image/Brand */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">
              Panneau d'Administration
            </h1>
            <Link href="/" className="hover:text-primary transition-colors">
              Retourner vers le site partie utilisateur
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-white opacity-5 rounded-full"></div>
      </div>
    </div>
  );
}