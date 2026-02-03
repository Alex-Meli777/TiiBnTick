'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpeditionFormData, AllExpeditionData } from '@/types/package';
import { User, Package, MapPin, Pencil, CreditCard, CheckCircle } from 'lucide-react';

// Components
import SenderInfoStep from '@/components/expedition/SenderInfoStep';
import RecipientInfoStep from '@/components/expedition/RecipientInfoStep';
import PackageInfoStep from '@/components/expedition/PackageRegistration'; // Ensure this filename matches
import RouteSelectionStep from '@/components/expedition/RouteExpedition';
import SignatureStep from '@/components/expedition/SignatureStep';
import PaymentStep from '@/components/expedition/PaymentStepExpedition';

// PROGRESS BAR COMPONENT
const ShippingSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, icon: User, label: 'Expéditeur' },
    { id: 2, icon: User, label: 'Destinataire' },
    { id: 3, icon: Package, label: 'Colis' },
    { id: 4, icon: MapPin, label: 'Trajet' },
    { id: 5, icon: Pencil, label: 'Signature' },
    { id: 6, icon: CreditCard, label: 'Paiement' },
  ];

  return (
    <div className="flex justify-between max-w-4xl mx-auto mb-12 relative p-4">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
      {/* Animated Progress Line */}
      <motion.div 
        className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2"
        initial={{ width: '0%' }}
        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      {steps.map((s) => {
        const Icon = s.icon;
        const isActive = s.id <= currentStep;
        return (
          <div key={s.id} className="relative z-10 flex flex-col items-center">
            <motion.div 
              animate={{ 
                backgroundColor: isActive ? '#f97316' : '#fff',
                scale: s.id === currentStep ? 1.2 : 1 
              }}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-orange-500' : 'border-gray-300'}`}
            >
              <Icon size={18} color={isActive ? '#fff' : '#94a3b8'} />
            </motion.div>
            <span className={`text-xs mt-2 font-bold ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function ExpeditionPage() {
  const [user, setUser] = useState(null); // Guest mode
  
  const [formData, setFormData] = useState<ExpeditionFormData>({
    currentStep: 1,
    senderData: { senderName: '', senderPhone: '', senderEmail: '', senderCountry: '', senderRegion: '', senderCity: '', senderAddress: '', senderLieuDit: '' },
    recipientData: { recipientName: '', recipientPhone: '', recipientEmail: '', recipientCountry: '', recipientRegion: '', recipientCity: '', recipientAddress: '', recipientLieuDit: '' },
    packageData: { photo: null, designation: '', description: '', weight: '', length: '', width: '', height: '', isFragile: false, isPerishable: false, isLiquid: false, isInsured: false, declaredValue: '', transportMethod: '', logistics: 'standard', pickup: false, delivery: false },
    routeData: { departurePointId: null, arrivalPointId: null, departurePointName: '', arrivalPointName: '', distanceKm: 0 },
    signatureData: { signatureUrl: null },
    pricing: { basePrice: 0, travelPrice: 0, operatorFee: 0, totalPrice: 0 },
  });

  const renderStep = () => {
    switch (formData.currentStep) {
      case 1:
        return <SenderInfoStep 
          initialData={formData.senderData} 
          onContinue={(data) => setFormData({...formData, senderData: data, currentStep: 2})} 
          currentUser={user} 
        />;
      case 2:
        return <RecipientInfoStep 
          initialData={formData.recipientData}
          onContinue={(data) => setFormData({...formData, recipientData: data, currentStep: 3})}
          onBack={() => setFormData({...formData, currentStep: 1})}
        />;
      case 3:
        return <PackageInfoStep 
          initialData={formData.packageData}
          // Note: Capturing the price calculated by the component
          onContinue={(data, price) => setFormData({
            ...formData, 
            packageData: data, 
            pricing: { ...formData.pricing, basePrice: price }, 
            currentStep: 4
          })}
          onBack={() => setFormData({...formData, currentStep: 2})}
        />;
      case 4:
        return <RouteSelectionStep 
          onContinue={(data, price) => setFormData({
            ...formData, 
            routeData: data, 
            pricing: { ...formData.pricing, travelPrice: price }, 
            currentStep: 5
          })}
          onBack={() => setFormData({...formData, currentStep: 3})}
        />;
      case 5:
        return <SignatureStep 
          onSubmit={(url) => setFormData({...formData, signatureData: { signatureUrl: url }, currentStep: 6})}
          onBack={() => setFormData({...formData, currentStep: 4})}
        />;
      case 6:
        // Assemble data for Payment
        const fullDataForPayment: AllExpeditionData = {
          ...formData.senderData,
          ...formData.recipientData,
          ...formData.packageData,
          ...formData.routeData,
          ...formData.signatureData,
          basePrice: formData.pricing.basePrice,
          travelPrice: formData.pricing.travelPrice,
          photo: typeof formData.packageData.photo === 'string' ? formData.packageData.photo : null
        };
        return <PaymentStep 
          allData={fullDataForPayment}
          onBack={() => setFormData({...formData, currentStep: 5})}
          onPaymentFinalized={(finalPricing) => setFormData({...formData, pricing: finalPricing, currentStep: 7})}
          currentUser={user}
        />;
      case 7:
        return (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-green-600">Félicitations !</h2>
            <p>Votre colis est prêt à être expédié.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">Nouvelle Expédition</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto">
        
        {/* PROGRESS BAR */}
        <ShippingSteps currentStep={formData.currentStep} />

        {/* STEP CONTENT WITH TRANSITION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={formData.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}