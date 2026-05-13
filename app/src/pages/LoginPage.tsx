import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { img } from '@/lib/utils'

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({ title: '¡Bienvenido!', description: 'Has iniciado sesión correctamente.' });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Error de inicio de sesión',
          description: 'Email o contraseña incorrectos.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al iniciar sesión.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={img("/images/hero-main.jpg")}
          alt="Nutricionista"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,124,89,0.8)] to-[rgba(58,99,71,0.85)]" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h2 className="font-display font-bold text-4xl mb-4">Bienvenido de vuelta</h2>
          <p className="text-[rgba(255,255,255,0.85)] text-lg max-w-md">
            Continúa tu camino hacia una vida más saludable. Accede a tu portal de paciente para revisar tu plan, agendar consultas y monitorear tu progreso.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-nutri-background p-6">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-card">
            <h2 className="font-display font-semibold text-2xl text-[#2D3436] mb-2">Iniciar Sesión</h2>
            <p className="text-[#636E72] text-sm mb-8">Accede a tu portal de paciente</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D5DBDB] text-nutri-primary focus:ring-nutri-primary"
                  />
                  <span className="text-[#636E72]">Recordarme</span>
                </label>
                <button type="button" className="text-nutri-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-semibold text-white gradient-primary-btn rounded-xl shadow-btn hover:shadow-btn-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(74,124,89,0.1)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#B2BEC3]">o</span>
              </div>
            </div>

            <Link
              to="/registro"
              className="block w-full py-3 text-sm font-semibold text-[#636E72] text-center rounded-xl hover:bg-[rgba(74,124,89,0.08)] hover:text-nutri-primary transition-all duration-200"
            >
              Crear cuenta nueva
            </Link>

            <div className="mt-6 p-4 bg-nutri-background rounded-xl">
              <p className="text-xs text-[#636E72] text-center mb-2">Credenciales de demo:</p>
              <p className="text-xs text-[#B2BEC3] text-center">Paciente: paciente@demo.com / demo123</p>
              <p className="text-xs text-[#B2BEC3] text-center">Admin: admin@nutrivida.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
