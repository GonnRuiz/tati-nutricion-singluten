import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { img } from '@/lib/utils'

export function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      toast({ title: 'Contraseña débil', description: 'La contraseña debe tener al menos 8 caracteres.', variant: 'destructive' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: 'Contraseñas no coinciden', description: 'Asegúrate de que ambas contraseñas sean iguales.', variant: 'destructive' });
      return;
    }
    if (!form.acceptTerms) {
      toast({ title: 'Términos y condiciones', description: 'Debes aceptar los términos y condiciones.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: '¡Cuenta creada!', description: 'Tu cuenta ha sido creada exitosamente.' });
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={img("/images/about-portrait.jpg")}
          alt="Nutricionista"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,124,89,0.8)] to-[rgba(58,99,71,0.85)]" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h2 className="font-display font-bold text-4xl mb-4">Únete a NutriVida</h2>
          <p className="text-[rgba(255,255,255,0.85)] text-lg max-w-md">
            Crea tu cuenta y comienza tu transformación hacia una vida más saludable con planes de nutrición personalizados.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-nutri-background p-6">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-card">
            <h2 className="font-display font-semibold text-2xl text-[#2D3436] mb-2">Crear Cuenta</h2>
            <p className="text-[#636E72] text-sm mb-8">
              Únete a NutriVida y comienza tu transformación
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
                  <input
                    type="text"
                    name="name"
                    placeholder="María García"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 234 567 890"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2BEC3] hover:text-nutri-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-[#B2BEC3] mt-1">Mínimo 8 caracteres, 1 mayúscula, 1 número</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">
                  Confirmar contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded border-[#D5DBDB] text-nutri-primary focus:ring-nutri-primary"
                />
                <span className="text-sm text-[#636E72]">
                  Acepto los <button type="button" className="text-nutri-primary hover:underline">términos y condiciones</button>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-semibold text-white gradient-primary-btn rounded-xl shadow-btn hover:shadow-btn-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#636E72] mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-nutri-primary font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
