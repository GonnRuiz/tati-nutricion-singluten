import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Video, ClipboardList, TrendingUp, ChevronLeft, ChevronRight, Star, BookOpen, Mail, Phone } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { blogPosts, testimonials } from '@/data/mockData';
import { img } from '@/lib/utils'

/* ─────────── HERO ─────────── */
function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-72px)] gradient-hero flex items-center">
      <div className="max-w-[1280px] mx-auto px-6 py-16 lg:py-0">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
          {/* Text */}
          <div>
            <div
              className="inline-block px-4 py-1.5 rounded-full bg-[rgba(74,124,89,0.1)] text-nutri-primary text-sm font-medium uppercase tracking-wider mb-6"
              style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              Nutrición Personalizada & Profesional
            </div>
            <h1
              className="font-display font-bold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#2D3436] max-w-[540px]"
              style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 150ms both' }}
            >
              Transforma tu salud a través de la nutrición
            </h1>
            <p
              className="text-lg text-[#636E72] max-w-[480px] mt-5"
              style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 300ms both' }}
            >
              Planes de alimentación personalizados, seguimiento profesional y el acompañamiento que necesitas para alcanzar tus objetivos de salud.
            </p>
            <div
              className="flex flex-wrap gap-4 mt-8"
              style={{ animation: 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 450ms both' }}
            >
              <Link
                to="/login"
                className="flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white gradient-primary-btn rounded-xl shadow-btn hover:shadow-btn-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Calendar className="w-4 h-4" />
                Reserva tu Consulta
              </Link>
              <button
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-7 py-3 text-sm font-semibold text-nutri-primary border-2 border-nutri-primary rounded-xl hover:bg-nutri-primary hover:text-white transition-all duration-250"
              >
                Conoce los Servicios
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Stats */}
            <div
              className="flex flex-wrap gap-8 md:gap-12 mt-12"
              style={{ animation: 'fade-in 0.6s ease 600ms both' }}
            >
              {[
                { value: '500+', label: 'Pacientes Atendidos' },
                { value: '8+', label: 'Años de Experiencia' },
                { value: '98%', label: 'Satisfacción' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-bold text-[28px] text-nutri-primary">{stat.value}</div>
                  <div className="text-[13px] text-[#636E72]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Image */}
          <ScrollReveal delay={200} direction="scale">
            <div className="animate-float">
              <img
                src={img("/images/hero-main.jpg")}
                alt="Nutricionista profesional"
                className="w-full rounded-[20px] shadow-[0_20px_60px_rgba(74,124,89,0.15)]"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────── SERVICIOS ─────────── */
function ServicesSection() {
  const services = [
    {
      icon: Video,
      image: '/images/service-consultation.jpg',
      title: 'Consultas Online',
      description: 'Sesiones virtuales personalizadas donde evaluamos tu estado nutricional, revisamos tus objetivos y diseñamos un plan a tu medida.',
      link: 'Agendar consulta',
    },
    {
      icon: ClipboardList,
      image: '/images/service-plan.jpg',
      title: 'Planes de Alimentación',
      description: 'Menús semanales diseñados específicamente para ti, considerando tus gustos, estilo de vida y objetivos de salud.',
      link: 'Ver ejemplo',
    },
    {
      icon: TrendingUp,
      image: '/images/service-tracking.jpg',
      title: 'Seguimiento y Ajustes',
      description: 'Monitoreo de tu progreso con ajustes periódicos a tu plan. Comunicación directa para resolver dudas en el camino.',
      link: 'Conocer más',
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(74,124,89,0.1)] text-nutri-primary text-sm font-medium uppercase tracking-wider mb-4">
            Servicios
          </span>
          <h2 className="font-display font-semibold text-3xl md:text-[42px] text-[#2D3436] mb-4">
            Una solución completa para tu bienestar
          </h2>
          <p className="text-[#636E72] max-w-[600px] mx-auto">
            Ofrezco un acompañamiento integral en tu proceso de mejora de hábitos alimentarios.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 150}>
              <div className="bg-white border border-[rgba(74,124,89,0.08)] rounded-2xl p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
                <service.icon className="w-12 h-12 text-nutri-primary mb-4" strokeWidth={1.5} />
                <img
                  src={img(service.image)}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-xl mb-5"
                />
                <h3 className="font-display font-semibold text-2xl text-[#2D3436] mb-3">{service.title}</h3>
                <p className="text-[#636E72] text-sm leading-relaxed mb-4">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-nutri-primary font-medium text-sm group-hover:gap-2 transition-all">
                  {service.link} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── SOBRE MÍ ─────────── */
function AboutSection() {
  return (
    <section id="sobre-mi" className="py-20 bg-nutri-background">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 items-center">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-[200px] h-[200px] rounded-full bg-nutri-accent-leaf -z-10" />
              <img
                src={img("/images/about-portrait.jpg")}
                alt="Dra. María González"
                className="w-full max-w-[500px] rounded-[20px] shadow-[0_16px_48px_rgba(74,124,89,0.12)]"
              />
            </div>
          </ScrollReveal>

          <div>
            <ScrollReveal>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(74,124,89,0.1)] text-nutri-primary text-sm font-medium uppercase tracking-wider mb-4">
                Sobre Mí
              </span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="font-display font-semibold text-3xl md:text-[42px] text-[#2D3436] mb-5">
                Hola, soy Dra. María González
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="space-y-4 text-[#636E72] leading-relaxed">
                <p>
                  Soy nutricionista dedicada con más de 8 años de experiencia ayudando a personas a transformar su relación con la comida y alcanzar sus objetivos de salud.
                </p>
                <p>
                  Mi enfoque se basa en la evidencia científica combinada con un trato humano y empático. Creo firmemente que la alimentación saludable no se trata de restricciones, sino de encontrar un equilibrio sostenible.
                </p>
                <p>
                  Me especializo en nutrición clínica, control de peso saludable y manejo de condiciones metabólicas. Cada persona es única, y por eso cada plan que diseño es completamente personalizado.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-3 mt-7">
                {['Lic. en Nutrición', 'Diplomado en Nutrición Clínica', 'Miembro de la Asociación de Nutricionistas'].map((badge) => (
                  <span key={badge} className="px-3 py-1.5 rounded-full bg-[rgba(212,163,115,0.15)] text-nutri-secondary text-xs font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3 mt-8 text-sm font-semibold text-white gradient-primary-btn rounded-xl shadow-btn hover:shadow-btn-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Calendar className="w-4 h-4" />
                Reserva una Consulta
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── PROCESO ─────────── */
function ProcessSection() {
  const steps = [
    { num: 1, title: 'Reserva', desc: 'Agenda tu consulta inicial a través de nuestro portal online.', icon: Calendar },
    { num: 2, title: 'Evaluación', desc: 'Analizamos tu historial, hábitos y objetivos de salud.', icon: ClipboardList },
    { num: 3, title: 'Plan', desc: 'Recibes tu plan de alimentación personalizado.', icon: BookOpen },
    { num: 4, title: 'Seguimiento', desc: 'Monitoreamos tu progreso y ajustamos el plan.', icon: TrendingUp },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(74,124,89,0.1)] text-nutri-primary text-sm font-medium uppercase tracking-wider mb-4">
            Proceso
          </span>
          <h2 className="font-display font-semibold text-3xl md:text-[42px] text-[#2D3436] mb-4">
            Tu camino hacia una mejor salud
          </h2>
          <p className="text-[#636E72]">Un proceso simple y efectivo en 4 pasos</p>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-nutri-accent-leaf" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 200}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-nutri-primary text-white flex items-center justify-center font-bold text-xl mb-4 relative z-10">
                    {step.num}
                  </div>
                  <h4 className="font-semibold text-lg text-[#2D3436] mb-2">{step.title}</h4>
                  <p className="text-[#636E72] text-sm">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── TESTIMONIOS ─────────── */
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-20" style={{ background: 'linear-gradient(180deg, #FFF8EE 0%, #F7F5F0 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(74,124,89,0.1)] text-nutri-primary text-sm font-medium uppercase tracking-wider mb-4">
            Testimonios
          </span>
          <h2 className="font-display font-semibold text-3xl md:text-[42px] text-[#2D3436]">
            Lo que dicen mis pacientes
          </h2>
        </ScrollReveal>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full shrink-0 px-0 md:px-[15%]">
                  <div className="bg-white rounded-2xl p-8 shadow-card max-w-2xl mx-auto">
                    <div className="text-nutri-accent-leaf text-4xl mb-4">"</div>
                    <p className="text-[#2D3436] text-lg leading-relaxed mb-6">{t.text}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-[rgba(74,124,89,0.1)]">
                      <img src={img(t.image)} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-[#2D3436]">{t.name}</div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-nutri-secondary text-nutri-secondary" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-nutri-primary text-nutri-primary flex items-center justify-center hover:bg-nutri-primary hover:text-white transition-all hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo((current + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-nutri-primary text-nutri-primary flex items-center justify-center hover:bg-nutri-primary hover:text-white transition-all hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-nutri-primary w-8' : 'bg-[rgba(74,124,89,0.25)]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── BLOG PREVIEW ─────────── */
function BlogPreviewSection() {
  const previewPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(74,124,89,0.1)] text-nutri-primary text-sm font-medium uppercase tracking-wider mb-4">
            Blog
          </span>
          <h2 className="font-display font-semibold text-3xl md:text-[42px] text-[#2D3436] mb-4">
            Consejos y Novedades
          </h2>
          <p className="text-[#636E72]">Artículos sobre nutrición, recetas y estilo de vida saludable</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 150}>
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="overflow-hidden">
                    <img
                      src={img(post.image)}
                      alt={post.title}
                      className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-[rgba(212,163,115,0.15)] text-nutri-secondary text-xs font-medium mb-3">
                      {post.category}
                    </span>
                    <h4 className="font-semibold text-lg text-[#2D3436] mb-2 group-hover:text-nutri-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-[#636E72] text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#B2BEC3]">{post.date}</span>
                      <span className="text-nutri-primary font-medium flex items-center gap-1">
                        Leer más <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-nutri-primary border-2 border-nutri-primary rounded-xl hover:bg-nutri-primary hover:text-white transition-all duration-250"
          >
            Ver todos los artículos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────── CTA / CONTACTO ─────────── */
function CTASection() {
  return (
    <section id="contacto" className="py-20 bg-nutri-background">
      <div className="max-w-[1280px] mx-auto px-6">
        <ScrollReveal direction="scale">
          <div className="gradient-cta rounded-3xl p-10 md:p-16 text-center">
            <h2 className="font-display font-semibold text-2xl md:text-4xl text-white mb-4">
              ¿Listo para comenzar tu transformación?
            </h2>
            <p className="text-[rgba(255,255,255,0.85)] text-lg max-w-[500px] mx-auto mb-8">
              Agenda tu primera consulta y da el primer paso hacia una vida más saludable.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-nutri-primary bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-nutri-cream transition-colors duration-200"
            >
              <Calendar className="w-5 h-5" />
              Reservar Consulta Ahora
            </Link>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-[rgba(255,255,255,0.8)] text-sm">
                <Mail className="w-4 h-4" />
                info@nutrivida.com
              </div>
              <div className="flex items-center gap-2 text-[rgba(255,255,255,0.8)] text-sm">
                <Phone className="w-4 h-4" />
                +1 234 567 890
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────── LANDING PAGE ─────────── */
export function LandingPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <CTASection />
    </>
  );
}
