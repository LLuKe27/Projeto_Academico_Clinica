import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, Calendar, Clock, CheckCircle, UserPlus, Activity } from 'lucide-react';

export default function ReceptionDashboard() {
  const { patients, doctors, appointments, addPatient, addAppointment, updateAppointmentStatus } = useAppContext();
  const [activeTab, setActiveTab] = React.useState<'queue' | 'patients' | 'appointments'>('queue');

  // Form states
  const [newPatient, setNewPatient] = React.useState({ name: '', cpf: '', birthDate: '', phone: '' });
  const [newAppt, setNewAppt] = React.useState({ patientId: '', doctorId: '', date: '', time: '' });

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.date === today);
  const waitingQueue = todaysAppointments.filter(a => a.status === 'waiting');

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient(newPatient);
    setNewPatient({ name: '', cpf: '', birthDate: '', phone: '' });
    alert('Paciente cadastrado com sucesso!');
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment(newAppt);
    setNewAppt({ patientId: '', doctorId: '', date: '', time: '' });
    alert('Agendamento realizado com sucesso!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recepção</h1>
          <p className="text-gray-500 mt-1">Gestão de pacientes, agendamentos e fila de espera.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Na Fila Hoje</p>
              <p className="text-2xl font-bold text-blue-900">{waitingQueue.length}</p>
            </div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
            <div className="bg-emerald-500 p-3 rounded-lg text-white">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">Agendados Hoje</p>
              <p className="text-2xl font-bold text-emerald-900">{todaysAppointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'queue' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Fila de Espera
          {activeTab === 'queue' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'patients' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Pacientes
          {activeTab === 'patients' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'appointments' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Agendamentos
          {activeTab === 'appointments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Fila de Espera Atual
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {todaysAppointments.filter(a => ['scheduled', 'waiting'].includes(a.status)).length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nenhum paciente na fila ou agendado para hoje.</div>
            ) : (
              todaysAppointments
                .filter(a => ['scheduled', 'waiting'].includes(a.status))
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(appt => {
                  const patient = patients.find(p => p.id === appt.patientId);
                  const doctor = doctors.find(d => d.id === appt.doctorId);
                  return (
                    <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${appt.status === 'waiting' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {patient?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient?.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{appt.time}</span> • <span>{doctor?.name} ({doctor?.specialty})</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {appt.status === 'scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, 'waiting')}
                            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors"
                          >
                            Registrar Chegada
                          </button>
                        )}
                        {appt.status === 'waiting' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            Aguardando
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <UserPlus size={20} className="text-blue-500" />
                Novo Paciente
              </h2>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input required type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input required type="text" value={newPatient.cpf} onChange={e => setNewPatient({...newPatient, cpf: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  <input required type="date" value={newPatient.birthDate} onChange={e => setNewPatient({...newPatient, birthDate: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input required type="text" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Cadastrar Paciente
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Pacientes Cadastrados</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                      <th className="p-4 font-medium">Nome</th>
                      <th className="p-4 font-medium">CPF</th>
                      <th className="p-4 font-medium">Telefone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">{p.name}</td>
                        <td className="p-4 text-gray-500">{p.cpf}</td>
                        <td className="p-4 text-gray-500">{p.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" />
                Novo Agendamento
              </h2>
              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <select required value={newAppt.patientId} onChange={e => setNewAppt({...newAppt, patientId: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="">Selecione um paciente</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Médico/Especialidade</label>
                  <select required value={newAppt.doctorId} onChange={e => setNewAppt({...newAppt, doctorId: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="">Selecione um médico</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input required type="date" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                  <input required type="time" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Agendar Consulta
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Todos os Agendamentos</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                      <th className="p-4 font-medium">Data/Hora</th>
                      <th className="p-4 font-medium">Paciente</th>
                      <th className="p-4 font-medium">Médico</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()).map(appt => {
                      const patient = patients.find(p => p.id === appt.patientId);
                      const doctor = doctors.find(d => d.id === appt.doctorId);
                      return (
                        <tr key={appt.id} className="hover:bg-gray-50">
                          <td className="p-4 text-gray-900 font-medium">{new Date(appt.date).toLocaleDateString('pt-BR')} às {appt.time}</td>
                          <td className="p-4 text-gray-600">{patient?.name}</td>
                          <td className="p-4 text-gray-600">{doctor?.name}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${appt.status === 'scheduled' ? 'bg-gray-100 text-gray-800' : 
                                appt.status === 'waiting' ? 'bg-amber-100 text-amber-800' : 
                                appt.status === 'called' ? 'bg-blue-100 text-blue-800' :
                                appt.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                                'bg-emerald-100 text-emerald-800'}`}>
                              {appt.status === 'scheduled' ? 'Agendado' : 
                               appt.status === 'waiting' ? 'Aguardando' : 
                               appt.status === 'called' ? 'Chamado' :
                               appt.status === 'in-progress' ? 'Em Atendimento' : 'Concluído'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
