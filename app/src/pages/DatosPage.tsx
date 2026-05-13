import { useState } from 'react';
import { Save, Camera } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { patientData } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { img } from '@/lib/utils'

export function DatosPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    phone: patientData.phone,
    address: patientData.address,
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSave = () => {
    toast({ title: 'Datos guardados', description: 'Tu información ha sido actualizada correctamente.' });
  };

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({ title: 'Error', description: 'Las contraseñas no coinciden.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Contraseña actualizada', description: 'Tu contraseña ha sido cambiada correctamente.' });
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl md:text-3xl text-[#2D3436] mb-8">
        Mis Datos Personales
      </h1>

      <div className="space-y-6 max-w-3xl">
        {/* Personal Info */}
        <ScrollReveal>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
            <h3 className="font-semibold text-lg text-[#2D3436] mb-6">Información Personal</h3>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <img
                  src={img("/images/testimonial-1.jpg")}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-nutri-primary text-white flex items-center justify-center shadow-md hover:bg-nutri-primary-dark transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-[#2D3436]">{patientData.name}</p>
                <p className="text-sm text-[#636E72]">Paciente</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Nombre completo</label>
                <input type="text" value={patientData.name} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Email</label>
                <input type="email" value={patientData.email} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Teléfono</label>
                <input type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Fecha de nacimiento</label>
                <input type="text" value={patientData.birthDate} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Género</label>
                <input type="text" value={patientData.gender} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Dirección</label>
                <input type="text" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all" />
              </div>
            </div>

            <button onClick={handleSave}
              className="mt-6 flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white gradient-primary-btn rounded-xl shadow-btn hover:shadow-btn-hover hover:scale-[1.02] transition-all">
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </ScrollReveal>

        {/* Health Data */}
        <ScrollReveal>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
            <h3 className="font-semibold text-lg text-[#2D3436] mb-6">Datos de Salud</h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Altura (cm)</label>
                <input type="text" value={patientData.height} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Peso inicial (kg)</label>
                <input type="text" value={patientData.initialWeight} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Peso objetivo (kg)</label>
                <input type="text" value={patientData.targetWeight} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">IMC</label>
                <div className="flex items-center gap-3">
                  <input type="text" value="27.5" disabled
                    className="flex-1 px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
                  <span className="px-3 py-1.5 rounded-full bg-[rgba(243,156,18,0.1)] text-amber-600 text-xs font-medium">
                    Sobrepeso
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Condiciones</label>
                <div className="flex flex-wrap gap-2">
                  {patientData.conditions.map((c) => (
                    <span key={c} className="px-3 py-1.5 rounded-full bg-[rgba(74,124,89,0.1)] text-nutri-primary text-xs font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Alergias</label>
                <input type="text" value={patientData.allergies} disabled
                  className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D5DBDB] rounded-xl text-[15px] text-[#636E72]" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Change Password */}
        <ScrollReveal>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
            <h3 className="font-semibold text-lg text-[#2D3436] mb-6">Cambiar Contraseña</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Contraseña actual</label>
                <input type="password" value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Nueva contraseña</label>
                <input type="password" value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Confirmar nueva contraseña</label>
                <input type="password" value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all" />
              </div>
              <button onClick={handlePasswordChange}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-nutri-primary border-2 border-nutri-primary rounded-xl hover:bg-nutri-primary hover:text-white transition-all">
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
