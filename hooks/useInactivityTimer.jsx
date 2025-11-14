import { useState, useEffect, useRef } from 'react';

export const useInactivityTimer = ({
  warningTime = 1 * 60 * 1000,
  inactivityTimeout = 15 * 60 * 1000,
  onLogout
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  const timersRef = useRef({
    inactivity: null,
    warning: null,
    countdown: null
  });
  
  const onLogoutRef = useRef(onLogout);
  
  // Garder la ref à jour
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  useEffect(() => {
    const clearTimers = () => {
      if (timersRef.current.inactivity) {
        clearTimeout(timersRef.current.inactivity);
        timersRef.current.inactivity = null;
      }
      if (timersRef.current.warning) {
        clearTimeout(timersRef.current.warning);
        timersRef.current.warning = null;
      }
      if (timersRef.current.countdown) {
        clearInterval(timersRef.current.countdown);
        timersRef.current.countdown = null;
      }
    };

    const startCountdown = () => {
      setShowWarning(true);
      
      // Calculer le temps restant jusqu'à la déconnexion
      const countdownDuration = inactivityTimeout - warningTime;
      setTimeRemaining(countdownDuration);

      timersRef.current.countdown = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    };

    const handleLogout = async () => {
      clearTimers();
      if (onLogoutRef.current) {
        await onLogoutRef.current();
      }
    };

    const resetTimers = () => {      
      clearTimers();
      setShowWarning(false);
      setTimeRemaining(null);

      // Timer pour l'alerte - se déclenche après warningTime d'inactivité
      timersRef.current.warning = setTimeout(() => {
        startCountdown();
      }, warningTime);

      // Timer pour la déconnexion - se déclenche après inactivityTimeout d'inactivité
      timersRef.current.inactivity = setTimeout(() => {
        handleLogout();
      }, inactivityTimeout);
    };

    const events = ['mousedown','mousemove','keypress','scroll','touchstart','click'];

    resetTimers();

    events.forEach((event) => {
      window.addEventListener(event, resetTimers, { passive: true });
    });


    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });
      clearTimers();
    };
  }, [warningTime, inactivityTimeout]);

  // Formater le temps
  const formatTime = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    showWarning,
    timeRemaining,
    formattedTime: formatTime(timeRemaining)
  };
};

// Composant d'alerte d'inactivité, à voir poour le modifier en login
export const InactivityWarning = ({ timeRemaining, formattedTime, onStayActive }) => {
  if (!timeRemaining) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-3 mr-4">
            <svg 
              className="w-6 h-6 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Inactivité détectée
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Vous serez déconnecté dans :
        </p>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-red-600">
            {formattedTime}
          </div>
        </div>
        
        <button
          onClick={onStayActive}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Je suis toujours là
        </button>
      </div>
    </div>
  );
};