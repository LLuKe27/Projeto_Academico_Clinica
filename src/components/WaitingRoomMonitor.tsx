import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Volume2 } from 'lucide-react';

export default function WaitingRoomMonitor() {
  const { appointments, patients, doctors } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.date === today);
  
  // Find recently called patients
  const calledAppointments = todaysAppointments
    .filter(a => a.status === 'called')
    // In a real app, we'd sort by a 'calledAt' timestamp. Here we just take the first few.
    .slice(0, 4);

  const lastCalled = calledAppointments[0];
  const previousCalled = calledAppointments.slice(1);

  // Next in line
  const waitingAppointments = todaysAppointments
    .filter(a => a.status === 'waiting')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 p-6 flex justify-between items-center border-b border-gray-700 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold">+</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Clínica Popular Saúde</h1>
        </div>
        <div className="text-right">
          <p className="text-4xl font-mono font-bold text-blue-400">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-gray-400 text-lg">
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Panel - Now Calling */}
        <div className="flex-1 p-12 flex flex-col justify-center items-center relative">
          {lastCalled ? (
            <div className="w-full max-w-4xl text-center animate-pulse-slow">
              <div className="mb-8 flex justify-center">
                <div className="bg-emerald-500/20 text-emerald-400 px-6 py-2 rounded-full text-xl font-medium tracking-widest uppercase flex items-center gap-3 border border-emerald-500/30">
                  <Volume2 size={24} />
                  Chamada Atual
                </div>
              </div>
              
              <h2 className="text-[6rem] leading-none font-bold text-white mb-8 tracking-tight">
                {patients.find(p => p.id === lastCalled.patientId)?.name}
              </h2>
              
              <div className="inline-block bg-blue-600 rounded-3xl px-12 py-6 shadow-2xl shadow-blue-900/50">
                <p className="text-2xl text-blue-100 mb-2 uppercase tracking-wider font-medium">Dirija-se à</p>
                <p className="text-6xl font-bold text-white">
                  {doctors.find(d => d.id === lastCalled.doctorId)?.room}
                </p>
                <p className="text-xl text-blue-200 mt-4">
                  {doctors.find(d => d.id === lastCalled.doctorId)?.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-32 h-32 border-4 border-gray-700 rounded-full border-t-blue-500 animate-spin mx-auto mb-8"></div>
              <h2 className="text-3xl font-medium">Aguardando próximas chamadas...</h2>
            </div>
          )}
        </div>

        {/* Sidebar - Queue */}
        <div className="w-[450px] bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Previous Calls */}
          {previousCalled.length > 0 && (
            <div className="p-6 border-b border-gray-700 bg-gray-800/50">
              <h3 className="text-gray-400 uppercase tracking-wider font-semibold text-sm mb-4">Últimas Chamadas</h3>
              <div className="space-y-3">
                {previousCalled.map(appt => {
                  const patient = patients.find(p => p.id === appt.patientId);
                  const doctor = doctors.find(d => d.id === appt.doctorId);
                  return (
                    <div key={appt.id} className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center border border-gray-600/50">
                      <div>
                        <p className="font-bold text-lg text-gray-200">{patient?.name}</p>
                        <p className="text-sm text-gray-400">{doctor?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">{doctor?.room}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next in Line */}
          <div className="p-6 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-gray-400 uppercase tracking-wider font-semibold text-sm mb-4">Próximos da Fila</h3>
            <div className="space-y-4 flex-1">
              {waitingAppointments.length === 0 ? (
                <p className="text-gray-500 italic">Nenhum paciente na fila.</p>
              ) : (
                waitingAppointments.map((appt, index) => {
                  const patient = patients.find(p => p.id === appt.patientId);
                  return (
                    <div key={appt.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <p className="font-medium text-lg text-gray-300">{patient?.name}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Ticker Footer */}
      <div className="bg-blue-600 text-white p-3 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          <span className="mx-4">•</span> Mantenha seus dados cadastrais atualizados na recepção.
          <span className="mx-4">•</span> Em caso de sintomas gripais, solicite uma máscara.
          <span className="mx-4">•</span> O tempo de espera pode variar de acordo com a especialidade.
          <span className="mx-4">•</span> Agradecemos a preferência pela Clínica Popular Saúde.
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
