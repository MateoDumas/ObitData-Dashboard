import { useLiveData } from '@/hooks/useLiveData';
import clsx from 'clsx';

export interface LiveIndicatorProps {
  className?: string;
  showText?: boolean;
}

export function LiveIndicator({ className, showText = true }: LiveIndicatorProps) {
  // Don't auto-connect just to show status
  const { isConnected, connectionStatus } = useLiveData({ autoConnect: false });

  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      text: 'En vivo',
      pulse: true,
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Conectando...',
      pulse: false,
    },
    disconnected: {
      color: 'bg-gray-400',
      text: 'Desconectado',
      pulse: false,
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      pulse: false,
    },
  };

  const config = statusConfig[connectionStatus];

  return (
    <div
      className={clsx(
        'live-indicator',
        'bg-gray-100 dark:bg-gray-800',
        className
      )}
    >
      <div
        className={clsx(
          'live-dot',
          config.color,
          config.pulse && 'animate-pulse'
        )}
      />
      {showText && (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {config.text}
        </span>
      )}
    </div>
  );
}
