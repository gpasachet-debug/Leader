/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsStrip } from './components/StatsStrip';
import { ServicesSection } from './components/ServicesSection';
import { RucCalendarTool } from './components/RucCalendarTool';
import { WhyUsSection } from './components/WhyUsSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';
import { RegimeQuiz } from './components/RegimeQuiz';
import { SunatAlertSection } from './components/SunatAlertSection';
import { ConsultationForm } from './components/ConsultationForm';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ClientDocumentUpload } from './components/ClientDocumentUpload';
import { FloatingUploadButton } from './components/FloatingUploadButton';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Allow URL hash like #enviar-archivos, #admin or #panel to open the modals seamlessly
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#enviar-archivos' || hash === '#documentos') {
        setIsUploadModalOpen(true);
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#admin' || hash === '#panel' || hash === '#leader-admin') {
        setIsAdminModalOpen(true);
        history.replaceState(null, '', window.location.pathname);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="min-h-screen bg-[#060D1D] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans antialiased">
      {/* Fixed Header with Top Bar Contract */}
      <Header onOpenUpload={() => setIsUploadModalOpen(true)} />

      {/* Main Content Sections - Pure Informational & Service Flow */}
      <main>
        {/* Hero Section with Jorge Pasache */}
        <Hero />

        {/* 4 Pillars Strip */}
        <StatsStrip />

        {/* 6 Core Services */}
        <ServicesSection />

        {/* Urgent Vencimientos Campaign & Interactive RUC Tool */}
        <RucCalendarTool />

        {/* Why Leader / "Más que números, somos tu aliado" */}
        <WhyUsSection />

        {/* Target Segments (MYPES, Empresas, Comerciantes, Independientes) */}
        <TargetAudienceSection />

        {/* Interactive Tax Regime Selector / Quiz */}
        <RegimeQuiz />

        {/* Actualidad Tributaria SUNAT Emergencias */}
        <SunatAlertSection />

        {/* Contact & Consultation Form with WhatsApp generator */}
        <ConsultationForm />
      </main>

      {/* Quiet Footer with Admin Portal trigger */}
      <Footer
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Floating Action 1: Client Document Reception Button (Bottom Left) */}
      <FloatingUploadButton onOpen={() => setIsUploadModalOpen(true)} />

      {/* Floating Action 2: WhatsApp Chat (Bottom Right) */}
      <FloatingWhatsApp />

      {/* Floating Document Reception Portal Modal (For Clients) */}
      <ClientDocumentUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Floating Admin Portal Modal (For Leader Advisors & Jorge Pasache) */}
      <AdminPortal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
