/**
 * @file app/layout.tsx
 * @description The ONLY place where <html> and <body> should exist.
 */
import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <NotificationProvider>
            {/* Navbar is optional here, depending on if you want it on every page */}
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}