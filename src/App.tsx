/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import ReceptionDashboard from './components/ReceptionDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import WaitingRoomMonitor from './components/WaitingRoomMonitor';
import { Role } from './types';
import { Activity, Users, MonitorPlay, LogOut } from 'lucide-react';

function AppContent() {
  const [role, setRole] = useState<Role>(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <Activity size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Clínica Popular Saúde</h1>
          <p className="text-xl text-gray-500">Sistema Integrado de Gestão e Prontuário</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <button 
            onClick={() => setRole('reception')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all text-left flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recepção</h2>
            <p className="text-gray-500">Gestão de pacientes, agendamentos e controle da fila de espera.</p>
          </button>

          <button 
            onClick={() => setRole('doctor')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:emerald-200 transition-all text-left flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Médico</h2>
            <p className="text-gray-500">Prontuário eletrônico, histórico clínico e chamadas de pacientes.</p>
          </button>

          <button 
            onClick={() => setRole('monitor')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:purple-200 transition-all text-left flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MonitorPlay size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Painel de Fila</h2>
            <p className="text-gray-500">Monitor para sala de espera com chamadas visuais e sonoras.</p>
          </button>
        </div>
      </div>
    );
  }

  // If monitor, don't show the standard app shell
  if (role === 'monitor') {
    return (
      <div className="relative">
        <button 
          onClick={() => setRole(null)}
          className="absolute top-4 right-4 z-50 bg-gray-800/50 hover:bg-gray-700 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
          title="Sair do modo monitor"
        >
          <LogOut size={20} />
        </button>
        <WaitingRoomMonitor />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRole(null)}>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <Activity size={18} />
            </div>
            <span className="font-bold text-gray-900 text-lg">Clínica Popular Saúde</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
              Módulo: {role === 'reception' ? 'Recepção' : 'Médico'}
            </span>
            <button 
              onClick={() => setRole(null)}
              className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {role === 'reception' && <ReceptionDashboard />}
        {role === 'doctor' && <DoctorDashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
