/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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

export default function App() {
  return (
    <div className="min-h-screen bg-[#060D1D] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans antialiased">
      {/* Fixed Header with Top Bar Contract */}
      <Header />

      {/* Main Content Sections */}
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

      {/* Quiet Footer */}
      <Footer />

      {/* Floating WhatsApp Action */}
      <FloatingWhatsApp />
    </div>
  );
}
