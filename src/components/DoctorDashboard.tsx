import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Stethoscope, Clock, FileText, CheckCircle, History } from 'lucide-react';
import { Appointment } from '../types';

export default function DoctorDashboard() {
  const { doctors, patients, appointments, records, updateAppointmentStatus, addRecord } = useAppContext();
  
  // Mock login - select a doctor
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  
  // Consultation form
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');

  const today = new Date().toISOString().split('T')[0];
  
  const myAppointments = appointments.filter(a => a.doctorId === selectedDoctorId && a.date === today);
  const waitingPatients = myAppointments.filter(a => a.status === 'waiting' || a.status === 'called');
  
  const handleCallNext = () => {
    const nextAppt = waitingPatients.find(a => a.status === 'waiting');
    if (nextAppt) {
      updateAppointmentStatus(nextAppt.id, 'called');
      // In a real app, this would trigger a websocket event to the monitor
    }
  };

  const handleStartConsultation = (appt: Appointment) => {
    updateAppointmentStatus(appt.id, 'in-progress');
    setActiveAppointment(appt);
    setNotes('');
    setPrescription('');
  };

  const handleFinishConsultation = () => {
    if (!activeAppointment) return;
    
    addRecord({
      patientId: activeAppointment.patientId,
      doctorId: activeAppointment.doctorId,
      appointmentId: activeAppointment.id,
      notes,
      prescription
    });
    
    updateAppointmentStatus(activeAppointment.id, 'completed');
    setActiveAppointment(null);
  };

  const activePatient = activeAppointment ? patients.find(p => p.id === activeAppointment.patientId) : null;
  const activePatientRecords = activePatient ? records.filter(r => r.patientId === activePatient.id) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel do Médico</h1>
          <p className="text-gray-500 mt-1">Prontuário eletrônico e gestão de consultas.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Atuando como:</label>
          <select 
            value={selectedDoctorId} 
            onChange={e => setSelectedDoctorId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      {!activeAppointment ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock size={20} className="text-blue-500" />
                  Minha Fila de Espera
                </h2>
                <button 
                  onClick={handleCallNext}
                  disabled={!waitingPatients.some(a => a.status === 'waiting')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Chamar Próximo
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {waitingPatients.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                    <CheckCircle size={48} className="text-emerald-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Nenhum paciente na fila!</p>
                    <p>Sua fila de espera está vazia no momento.</p>
                  </div>
                ) : (
                  waitingPatients.sort((a, b) => a.time.localeCompare(b.time)).map(appt => {
                    const patient = patients.find(p => p.id === appt.patientId);
                    return (
                      <div key={appt.id} className={`p-6 flex items-center justify-between transition-colors ${appt.status === 'called' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${appt.status === 'called' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                            {patient?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{patient?.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <span>Agendado para: {appt.time}</span>
                              {appt.status === 'called' && (
                                <span className="text-blue-600 font-medium text-xs bg-blue-100 px-2 py-0.5 rounded-full">Chamado ao consultório</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          {appt.status === 'called' && (
                            <button
                              onClick={() => handleStartConsultation(appt)}
                              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                            >
                              Iniciar Atendimento
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Resumo do Dia</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Agendados</span>
                    <span className="font-bold text-gray-900">{myAppointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-700">Atendidos</span>
                    <span className="font-bold text-emerald-900">{myAppointments.filter(a => a.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-700">Na Fila</span>
                    <span className="font-bold text-blue-900">{waitingPatients.length}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Stethoscope size={20} className="text-blue-500" />
                  Prontuário Eletrônico
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  Em Atendimento
                </span>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evolução Clínica / Anotações</label>
                  <textarea 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={6} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Descreva as queixas, sintomas, exame físico e conduta..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prescrição Médica (Opcional)</label>
                  <textarea 
                    value={prescription}
                    onChange={e => setPrescription(e.target.value)}
                    rows={4} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Medicamentos, posologia, orientações..."
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      updateAppointmentStatus(activeAppointment.id, 'waiting');
                      setActiveAppointment(null);
                    }}
                    className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  >
                    Cancelar / Voltar para Fila
                  </button>
                  <button 
                    onClick={handleFinishConsultation}
                    disabled={notes.trim() === ''}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Finalizar Atendimento
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Dados do Paciente</h3>
              {activePatient && (
                <div className="space-y-3 text-sm">
                  <p><span className="text-gray-500">Nome:</span> <span className="font-medium text-gray-900">{activePatient.name}</span></p>
                  <p><span className="text-gray-500">CPF:</span> <span className="font-medium text-gray-900">{activePatient.cpf}</span></p>
                  <p><span className="text-gray-500">Nascimento:</span> <span className="font-medium text-gray-900">{new Date(activePatient.birthDate).toLocaleDateString('pt-BR')}</span></p>
                  <p><span className="text-gray-500">Telefone:</span> <span className="font-medium text-gray-900">{activePatient.phone}</span></p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <History size={18} className="text-gray-400" />
                Histórico Clínico
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {activePatientRecords.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Nenhum registro anterior encontrado.</p>
                ) : (
                  activePatientRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => {
                    const doc = doctors.find(d => d.id === record.doctorId);
                    return (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-2">{new Date(record.date).toLocaleDateString('pt-BR')} • {doc?.name}</p>
                        <p className="text-sm text-gray-800 mb-2">{record.notes}</p>
                        {record.prescription && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 font-medium mb-1">Prescrição:</p>
                            <p className="text-sm text-gray-700">{record.prescription}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
