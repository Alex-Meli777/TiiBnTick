/**
 * @file services/pdfService.ts
 */
import jsPDF from 'jspdf';
import OriginalQRCode from 'qrcode';

const APP_NAME = "PicknDrop Link";

export const pdfService = {
  generateBordereauPDF: async (
    allData: any, 
    trackingNumber: string, 
    totalPrice: number, 
    operatorFee: number, 
    selectedMethod: string
  ) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // --- HELPER FUNCTIONS ---
      const addSectionTitle = (title: string, posY: number) => {
        pdf.setFillColor(249, 115, 22); // Orange background
        pdf.rect(margin, posY, pageWidth - (margin * 2), 7, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(title.toUpperCase(), margin + 2, posY + 5);
        return posY + 12;
      };

      const addField = (label: string, value: string, x: number, y: number) => {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(100, 116, 139);
        pdf.text(label, x, y);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(30, 41, 59);
        pdf.text(value || 'N/A', x, y + 5);
      };

      // --- 1. HEADER ---
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(249, 115, 22);
      pdf.text(APP_NAME, margin, y);
      
      // QR Code in Top Right
      const qrDataURL = await OriginalQRCode.toDataURL(trackingNumber);
      pdf.addImage(qrDataURL, 'PNG', pageWidth - margin - 30, y - 10, 30, 30);

      y += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Logistique & Livraison Rapide', margin, y);
      
      y += 15;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y, pageWidth - margin, y);
      
      y += 10;
      addField('NUMÉRO DE SUIVI', trackingNumber, margin, y);
      addField('DATE D\'EXPÉDITION', new Date().toLocaleDateString('fr-FR'), margin + 60, y);
      addField('MODE DE PAIEMENT', selectedMethod.toUpperCase(), margin + 120, y);

      // --- 2. INTERVENANTS (Expéditeur & Destinataire) ---
      y = addSectionTitle('Informations de Livraison', y + 15);
      
      // Left Column: Sender
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(249, 115, 22);
      pdf.text('EXPÉDITEUR', margin, y);
      pdf.setTextColor(30, 41, 59);
      pdf.setFont('helvetica', 'normal');
      y += 6;
      pdf.text(allData.senderName, margin, y);
      y += 5;
      pdf.text(allData.senderPhone, margin, y);
      y += 5;
      pdf.setFontSize(8);
      pdf.text(allData.senderAddress, margin, y, { maxWidth: 70 });

      // Right Column: Recipient (Back to same Y)
      let recipientY = y - 16;
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(249, 115, 22);
      pdf.text('DESTINATAIRE', pageWidth / 2 + 10, recipientY);
      pdf.setTextColor(30, 41, 59);
      pdf.setFont('helvetica', 'normal');
      recipientY += 6;
      pdf.text(allData.recipientName, pageWidth / 2 + 10, recipientY);
      recipientY += 5;
      pdf.text(allData.recipientPhone, pageWidth / 2 + 10, recipientY);
      recipientY += 5;
      pdf.setFontSize(8);
      pdf.text(allData.recipientAddress, pageWidth / 2 + 10, recipientY, { maxWidth: 70 });

      y = Math.max(y, recipientY) + 15;

      // --- 3. DÉTAILS DU COLIS ---
      y = addSectionTitle('Détails de l\'Envoi', y);
      addField('DÉSIGNATION', allData.designation, margin, y);
      addField('POIDS', `${allData.weight} KG`, margin + 60, y);
      addField('VALEUR DÉCLARÉE', `${allData.declaredValue || 0} FCFA`, margin + 120, y);

      // Add Photo if exists
      if (allData.photo) {
        try {
          pdf.addImage(allData.photo, 'JPEG', pageWidth - margin - 40, y - 5, 40, 40);
        } catch (e) { console.error("Photo error"); }
      }

      // --- 4. FINANCES ---
      y += 25;
      y = addSectionTitle('Récapitulatif Financier', y);
      const row = (label: string, value: number) => {
        pdf.setFont('helvetica', 'normal');
        pdf.text(label, margin, y);
        pdf.text(`${value.toLocaleString()} FCFA`, pageWidth - margin - 30, y, { align: 'right' });
        y += 6;
      };

      row('Frais de base d\'expédition', allData.basePrice);
      row('Frais de transport (Distance)', allData.travelPrice);
      if (operatorFee > 0) row('Frais de service mobile', operatorFee);
      
      y += 2;
      pdf.setDrawColor(249, 115, 22);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth - 80, y, pageWidth - margin, y);
      y += 8;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL GÉNÉRAL', pageWidth - 80, y);
      pdf.text(`${totalPrice.toLocaleString()} FCFA`, pageWidth - margin, y, { align: 'right' });

      // --- 5. SIGNATURES ---
      y += 25;
      pdf.setFontSize(9);
      pdf.text('Signature Client', margin + 20, y);
      pdf.text('Signature Agent', pageWidth - margin - 40, y);
      
      if (allData.signatureUrl) {
         pdf.addImage(allData.signatureUrl, 'PNG', margin + 10, y + 5, 40, 15);
      }
      pdf.setDrawColor(200);
      pdf.line(margin, y + 25, margin + 60, y + 25);
      pdf.line(pageWidth - margin - 60, y + 25, pageWidth - margin, y + 25);

      // --- 6. FOOTER ---
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      const footerText = `Ce document fait office de preuve de dépôt. Merci d'utiliser ${APP_NAME}.`;
      pdf.text(footerText, pageWidth / 2, 285, { align: 'center' });

      pdf.save(`BORDEREAU_${trackingNumber}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    }
  }
};