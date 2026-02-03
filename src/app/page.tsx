// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">PicknDrop Link</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Envoyez vos colis partout au Cameroun et au Nigeria en quelques clics.
      </p>
      <Link 
        href="/expedition" 
        className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 transition-all"
      >
        Démarrer une expédition
      </Link>
    </div>
  );
}