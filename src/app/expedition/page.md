'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserIcon as UserOutlineIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  ArrowUturnLeftIcon,
  PencilIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as SolidCheckCircleIcon,
  StarIcon,
  BoltIcon,
  GiftIcon,
} from '@heroicons/react/24/solid';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import SenderInfoStep from '@/components/expedition/SenderInfoStep';
import RecipientInfoStep from '@/components/expedition/RecipientInfoStep';
import PackageInfoStep from '@/components/expedition/PackageRegistration';
import RouteSelectionStep from '@/components/expedition/RouteExpedition';
import SignatureStep from '@/components/expedition/SignatureStep';
import PaymentStep from '@/components/expedition/PaymentStepExpedition';
import { CheckCircleIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import { ExpeditionFormData, AllExpeditionData } from '@/types/package';

const EXPEDITION_FORM_STORAGE_KEY = 'expedition_form_in_progress';


const STORAGE_KEY = 'shipping_form_temp_data_v2';


export default function ExpeditionPage() {
  const [user, setUser] = useState(null); // Leave as null for now (Guest Mode)


   const [formData, setFormData] = useState<ExpeditionFormData>({
    currentStep: 1,
    senderData: { /* ... initial empty values ... */ },
    recipientData: { /* ... initial empty values ... */ },
    packageData: { /* ... initial empty values ... */ },
    routeData: { /* ... initial empty values ... */ },
    signatureData: { signatureUrl: null },
    pricing: { basePrice: 0, travelPrice: 0, operatorFee: 0, totalPrice: 0 },
  });

  const renderStep = () => {
    switch (formData.currentStep) {
      case 1:
        return <SenderInfoStep 
                 initialData={formData.senderData} 
                 onContinue={(data) => setFormData({...formData, senderData: data, currentStep: 2})} 
                 currentUser={user} // Pass null, component handles "Sign up" notification
               />;
      case 2:
        return <RecipientInfoStep 
                 initialData={formData.recipientData}
                  onContinue={(data) => setFormData({...formData, recipientData: data, currentStep: 3})}
                  onBack={() => setFormData({...formData, currentStep: 1})}
                  currentUser={user}// Pass null, component handles "Sign up" notification
                />;
      case 3:
        return <PackageInfoStep 
                 initialData={formData.packageData}
                 onContinue={(data) => setFormData({...formData, packageData: data, currentStep: 4})}
                 onBack={() => setFormData({...formData, currentStep: 2})}
                 currentUser={user}
               />;
      case 4:
        return <RouteSelectionStep 
                 onContinue={(data) => setFormData({...formData, routeData: data, currentStep: 5})}
                 onBack={() => setFormData({...formData, currentStep: 3})}
                 currentUser={user}
               />;
               case 5:
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
        case 6:
          return <SignatureStep 
                   onContinue={(data) => setFormData({...formData, signatureData: data, currentStep: 6})}
                   onBack={() => setFormData({...formData, currentStep: 4})}
                   currentUser={user}
                 />;
        case 7:
        return <div>Success Screen Placeholder</div>;
      default:
        return null;
    }
  };
  return (
      <div className="min-h-screen bg-gray-50">
       <ProgressBar currentStep={formData.currentStep} />
       {renderStep()}
    </div>
  );
}
