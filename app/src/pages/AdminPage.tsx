import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, X, Save, FileText, Users, CalendarDays, Clock, CheckCircle, XCircle, User, Activity, Weight, Ruler, Heart, ClipboardList, FileText as FileDoc } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { blogPosts } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { img } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type AdminTab = 'articulos' | 'pacientes' | 'turnos';

interface ArticleForm {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  status: 'Publicado' | 'Borrador';
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  height: number;
  weight: number;
  imc: number;
  condition: string;
  lastVisit: string;
  plan: string;
  status: 'activo' | 'inactivo';
}

interface Appointment {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
}

interface WeightRecord { week: string; kg: number; }
interface Study { id: string; name: string; date: string; result: string; file: string; }
interface PlanMeal { time: string; name: string; description: string; calories: number; }

interface PatientPlan {
  name: string;
  calorieTarget: number;
  meals: PlanMeal[];
}

const CATEGORIES = ['Nutrición', 'Hábitos Saludables', 'Meal Prep', 'Recetas', 'Bienestar'];

const mockPatients: Patient[] = [
  { id: '1', name: 'Laura Martínez', email: 'laura@email.com', phone: '+54 11 2345 6789', age: 34, height: 165, weight: 72.5, imc: 26.6, condition: 'Celiaquía', lastVisit: '10/05/2026', plan: 'Sin Gluten', status: 'activo' },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@email.com', phone: '+54 11 3456 7890', age: 42, height: 178, weight: 88.0, imc: 27.8, condition: 'Sobrepeso, Celiaquía', lastVisit: '08/05/2026', plan: 'Antiinflamatorio', status: 'activo' },
  { id: '3', name: 'Ana Fernández', email: 'ana@email.com', phone: '+54 11 4567 8901', age: 28, height: 160, weight: 58.0, imc: 22.7, condition: 'Sensibilidad al gluten', lastVisit: '05/05/2026', plan: 'Sin Gluten', status: 'activo' },
  { id: '4', name: 'Martín López', email: 'martin@email.com', phone: '+54 11 5678 9012', age: 50, height: 175, weight: 95.0, imc: 31.0, condition: 'Diabetes tipo 2, Celiaquía', lastVisit: '28/04/2026', plan: 'Reducción + Sin Gluten', status: 'activo' },
  { id: '5', name: 'Sofía García', email: 'sofia@email.com', phone: '+54 11 6789 0123', age: 38, height: 168, weight: 63.0, imc: 22.3, condition: 'Ninguna', lastVisit: '20/04/2026', plan: 'Mantenimiento', status: 'inactivo' },
];

const mockWeightHistory: Record<string, WeightRecord[]> = {
  '1': [
    { week: 'Sem 1', kg: 75.0 }, { week: 'Sem 2', kg: 74.2 }, { week: 'Sem 3', kg: 73.8 },
    { week: 'Sem 4', kg: 73.1 }, { week: 'Sem 5', kg: 72.5 }, { week: 'Sem 6', kg: 71.9 },
  ],
  '2': [
    { week: 'Sem 1', kg: 91.0 }, { week: 'Sem 2', kg: 90.2 }, { week: 'Sem 3', kg: 89.5 },
    { week: 'Sem 4', kg: 88.8 }, { week: 'Sem 5', kg: 88.0 }, { week: 'Sem 6', kg: 87.5 },
  ],
};

const mockStudies: Record<string, Study[]> = {
  '1': [
    { id: 's1', name: 'Anticuerpos Transglutaminasa', date: '10/05/2026', result: 'Negativo (< 7 U/mL)', file: 'analisis-mayo-26.pdf' },
    { id: 's2', name: 'Hemograma Completo', date: '10/05/2026', result: 'Dentro de parámetros normales', file: 'analisis-mayo-26.pdf' },
    { id: 's3', name: 'Vitamina D', date: '12/02/2026', result: '28 ng/mL (bajo)', file: 'analisis-feb-26.pdf' },
  ],
};

const mockPlans: Record<string, PatientPlan> = {
  '1': {
    name: 'Plan Sin Gluten',
    calorieTarget: 1600,
    meals: [
      { time: '8:00', name: 'Tostadas de pan sin gluten con palta y huevo', description: '2 rebanadas de pan libre de gluten, 1/2 palta, 1 huevo revuelto', calories: 380 },
      { time: '10:30', name: 'Mix de frutos secos', description: '30g de nueces y almendras + 1 manzana', calories: 180 },
      { time: '13:00', name: 'Pechuga de pollo con quinoa y verduras', description: '150g pollo a la plancha, 1 taza quinoa cocida, brócoli al vapor', calories: 450 },
      { time: '16:00', name: 'Yogur de coco con frutos rojos', description: '1 pote de yogur de coco sin TACC + frutos rojos', calories: 150 },
      { time: '20:00', name: 'Salmón al horno con espárragos', description: '150g salmón, espárragos asados, batata al horno', calories: 420 },
    ],
  },
};

const mockAppointments: Appointment[] = [
  { id: '1', patient: 'Laura Martínez', date: '15/05/2026', time: '10:00', type: 'Seguimiento', status: 'confirmada' },
  { id: '2', patient: 'Carlos Rodríguez', date: '16/05/2026', time: '11:00', type: 'Primera consulta', status: 'confirmada' },
  { id: '3', patient: 'Ana Fernández', date: '17/05/2026', time: '14:30', type: 'Seguimiento', status: 'pendiente' },
  { id: '4', patient: 'Martín López', date: '18/05/2026', time: '09:00', type: 'Express', status: 'pendiente' },
  { id: '5', patient: 'Sofía García', date: '12/05/2026', time: '16:00', type: 'Seguimiento', status: 'cancelada' },
];

export function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('articulos');
  const [articles, setArticles] = useState(blogPosts);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleForm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    slug: '',
    category: 'Nutrición',
    excerpt: '',
    content: '',
    status: 'Borrador',
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSubTab, setPatientSubTab] = useState<'info' | 'plan'>('info');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientForm, setPatientForm] = useState({
    name: '', email: '', phone: '', age: 30, height: 165, weight: 70,
    condition: '', plan: 'Sin Gluten',
  });

  const calcIMC = (w: number, h: number) => Math.round((w / ((h / 100) ** 2)) * 10) / 10;

  const addPatient = () => {
    const imc = calcIMC(patientForm.weight, patientForm.height);
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: patientForm.name,
      email: patientForm.email,
      phone: patientForm.phone,
      age: patientForm.age,
      height: patientForm.height,
      weight: patientForm.weight,
      imc,
      condition: patientForm.condition,
      lastVisit: new Date().toLocaleDateString('es-ES'),
      plan: patientForm.plan,
      status: 'activo',
    };
    setPatients([newPatient, ...patients]);
    setShowPatientForm(false);
    setPatientForm({ name: '', email: '', phone: '', age: 30, height: 165, weight: 70, condition: '', plan: 'Sin Gluten' });
    toast({ title: 'Paciente agregado', description: `${newPatient.name} fue registrado correctamente.` });
  };

  const togglePatientStatus = (id: string) => {
    setPatients(patients.map(p => p.id === id ? { ...p, status: p.status === 'activo' ? 'inactivo' : 'activo' } : p));
    toast({ title: 'Estado actualizado' });
  };

  const deletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
    toast({ title: 'Paciente eliminado', description: 'El paciente fue eliminado del sistema.' });
  };

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const imcCategory = (imc: number) => {
    if (imc < 18.5) return { label: 'Bajo peso', color: 'text-amber-600', bg: 'bg-[rgba(243,156,18,0.1)]' };
    if (imc < 25) return { label: 'Normal', color: 'text-green-600', bg: 'bg-[rgba(39,174,96,0.1)]' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-amber-600', bg: 'bg-[rgba(243,156,18,0.1)]' };
    return { label: 'Obesidad', color: 'text-red-500', bg: 'bg-[rgba(239,68,68,0.1)]' };
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle?.id) {
      setArticles(articles.map((a) =>
        a.id === editingArticle.id
          ? { ...a, title: form.title, slug: form.slug, category: form.category, excerpt: form.excerpt, content: form.content }
          : a
      ));
      toast({ title: 'Artículo actualizado', description: 'Los cambios han sido guardados correctamente.' });
    } else {
      const newArticle = {
        id: Date.now().toString(),
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        category: form.category,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        image: '/images/blog-article-1.jpg',
        excerpt: form.excerpt,
        content: form.content,
        readTime: '5 min',
      };
      setArticles([newArticle, ...articles]);
      toast({ title: 'Artículo creado', description: 'El artículo ha sido publicado correctamente.' });
    }
    setShowForm(false);
    setEditingArticle(null);
    setForm({ title: '', slug: '', category: 'Nutrición', excerpt: '', content: '', status: 'Borrador' });
  };

  const handleEdit = (article: typeof blogPosts[0]) => {
    setEditingArticle({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      status: 'Publicado',
    });
    setForm({
      title: article.title,
      slug: article.slug,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      status: 'Publicado',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
    toast({ title: 'Artículo eliminado', description: 'El artículo ha sido eliminado correctamente.' });
  };

  const handleNew = () => {
    setEditingArticle(null);
    setForm({ title: '', slug: '', category: 'Nutrición', excerpt: '', content: '', status: 'Borrador' });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-nutri-background">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(248,201,216,0.15)] px-6 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <h1 className="font-display font-semibold text-xl text-[#2D3436]">Panel de Administración</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#636E72]">Lic. Tatiana Castel</span>
            <img src={img("/images/about-portrait.jpg")} alt="Admin" className="w-9 h-9 rounded-full object-cover" />
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ScrollReveal>
            <div className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(248,201,216,0.2)] flex items-center justify-center">
                <FileText className="w-6 h-6 text-nutri-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D3436]">{articles.length}</p>
                <p className="text-sm text-[#636E72]">Artículos</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(39,174,96,0.1)] flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D3436]">{patients.length}</p>
                <p className="text-sm text-[#636E72]">Pacientes</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(185,243,229,0.3)] flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-nutri-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D3436]">12</p>
                <p className="text-sm text-[#636E72]">Consultas esta semana</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(243,156,18,0.1)] flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D3436]">1.2k</p>
                <p className="text-sm text-[#636E72]">Vistas este mes</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'articulos' as AdminTab, label: 'Artículos', icon: FileText },
            { id: 'pacientes' as AdminTab, label: 'Pacientes', icon: Users },
            { id: 'turnos' as AdminTab, label: 'Turnos', icon: CalendarDays },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'gradient-primary-btn text-white'
                  : 'text-[#636E72] bg-white hover:bg-[rgba(248,201,216,0.1)]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ARTICLES TAB */}
        {activeTab === 'articulos' && (
        <div className="bg-white rounded-2xl shadow-card">
          <div className="p-6 border-b border-[rgba(248,201,216,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-semibold text-lg text-[#2D3436]">Gestión de Artículos</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B2BEC3]" />
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-[#D5DBDB] rounded-xl text-sm focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all"
                />
              </div>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white gradient-primary-btn rounded-xl hover:scale-[1.02] transition-all"
              >
                <Plus className="w-4 h-4" />
                Nuevo Artículo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(248,201,216,0.15)]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Título</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Categoría</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Fecha</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Estado</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-[rgba(248,201,216,0.1)] hover:bg-[rgba(248,201,216,0.05)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={img(article.image)} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-sm text-[#2D3436]">{article.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-[rgba(185,243,229,0.3)] text-xs font-medium">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#636E72]">{article.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-[rgba(39,174,96,0.1)] text-green-600 text-xs font-medium">
                        Publicado
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(article)} className="p-2 rounded-lg text-[#636E72] hover:bg-[rgba(248,201,216,0.2)] hover:text-nutri-primary transition-all" title="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="p-2 rounded-lg text-[#636E72] hover:bg-red-50 hover:text-red-500 transition-all" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === 'pacientes' && (
        <div className="bg-white rounded-2xl shadow-card">
          <div className="p-6 border-b border-[rgba(248,201,216,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-semibold text-lg text-[#2D3436]">Mis Pacientes ({patients.length})</h2>
            <button onClick={() => setShowPatientForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white gradient-primary-btn rounded-xl hover:scale-[1.02] transition-all">
              <Plus className="w-4 h-4" />Agregar Paciente
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(248,201,216,0.15)]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Paciente</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Edad</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Peso</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">IMC</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Estado</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => {
                  const imcInfo = imcCategory(p.imc);
                  return (
                  <tr key={p.id} className="border-b border-[rgba(248,201,216,0.1)] hover:bg-[rgba(248,201,216,0.05)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[rgba(248,201,216,0.3)] flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm text-[#2D3436]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#636E72]">{p.age}</td>
                    <td className="px-6 py-4 text-sm text-[#636E72]">{p.weight} kg</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${imcInfo.bg} ${imcInfo.color}`}>{p.imc}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-[rgba(185,243,229,0.3)] text-xs font-medium">{p.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => togglePatientStatus(p.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${p.status === 'activo' ? 'bg-[rgba(39,174,96,0.1)] text-green-600 hover:bg-[rgba(243,156,18,0.1)] hover:text-amber-600' : 'bg-[rgba(243,156,18,0.1)] text-amber-600 hover:bg-[rgba(39,174,96,0.1)] hover:text-green-600'}`}>
                        {p.status === 'activo' ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedPatient(p); setPatientSubTab('info'); }}
                          className="p-2 rounded-lg text-[#636E72] hover:bg-[rgba(248,201,216,0.2)] hover:text-nutri-primary transition-all" title="Ver ficha">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePatient(p.id)}
                          className="p-2 rounded-lg text-[#636E72] hover:bg-red-50 hover:text-red-500 transition-all" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'turnos' && (
        <div className="bg-white rounded-2xl shadow-card">
          <div className="p-6 border-b border-[rgba(248,201,216,0.15)]">
            <h2 className="font-semibold text-lg text-[#2D3436]">Gestión de Turnos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(248,201,216,0.15)]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Paciente</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Fecha</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Hora</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Estado</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Acción</th>
                </tr>
              </thead>
              <tbody>
                {mockAppointments.map((a) => (
                  <tr key={a.id} className="border-b border-[rgba(248,201,216,0.1)] hover:bg-[rgba(248,201,216,0.05)] transition-colors">
                    <td className="px-6 py-4 font-medium text-sm text-[#2D3436]">{a.patient}</td>
                    <td className="px-6 py-4 text-sm text-[#636E72]">{a.date}</td>
                    <td className="px-6 py-4 text-sm text-[#636E72]">{a.time}</td>
                    <td className="px-6 py-4 text-sm text-[#636E72]">{a.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        a.status === 'confirmada' ? 'bg-[rgba(39,174,96,0.1)] text-green-600' :
                        a.status === 'pendiente' ? 'bg-[rgba(243,156,18,0.1)] text-amber-600' :
                        'bg-[rgba(239,68,68,0.1)] text-red-500'
                      }`}>
                        {a.status === 'confirmada' ? 'Confirmada' : a.status === 'pendiente' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {a.status === 'pendiente' && (
                          <>
                            <button className="p-2 rounded-lg text-green-600 hover:bg-[rgba(39,174,96,0.1)] transition-all" title="Confirmar">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-red-500 hover:bg-[rgba(239,68,68,0.1)] transition-all" title="Cancelar">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {a.status === 'confirmada' && (
                          <span className="text-xs text-[#B2BEC3] flex items-center gap-1"><Clock className="w-3 h-3" />En agenda</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm overflow-auto pt-10 pb-10">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-modal">
            {/* Header */}
            <div className="p-6 border-b border-[rgba(248,201,216,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[rgba(248,201,216,0.3)] flex items-center justify-center">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#2D3436]">{selectedPatient.name}</h3>
                  <p className="text-sm text-[#636E72]">{selectedPatient.email} · {selectedPatient.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-2 rounded-lg hover:bg-[#F7F5F0] transition-colors">
                <X className="w-5 h-5 text-[#636E72]" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="px-6 pt-4 flex gap-2">
              {[
                { id: 'info' as const, label: 'Ficha Clínica', icon: ClipboardList },
                { id: 'plan' as const, label: 'Plan Alimentario', icon: FileDoc },
              ].map((t) => (
                <button key={t.id} onClick={() => setPatientSubTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    patientSubTab === t.id ? 'gradient-primary-btn text-white' : 'text-[#636E72] hover:bg-[rgba(248,201,216,0.1)]'
                  }`}>
                  <t.icon className="w-4 h-4" />{t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* FICHA CLINICA */}
              {patientSubTab === 'info' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-[rgba(248,201,216,0.1)] rounded-xl text-center">
                      <Weight className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs text-[#636E72]">Peso actual</p>
                      <p className="text-lg font-bold text-[#2D3436]">{selectedPatient.weight} kg</p>
                    </div>
                    <div className="p-4 bg-[rgba(185,243,229,0.2)] rounded-xl text-center">
                      <Ruler className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs text-[#636E72]">Altura</p>
                      <p className="text-lg font-bold text-[#2D3436]">{selectedPatient.height} cm</p>
                    </div>
                    <div className="p-4 bg-[rgba(248,201,216,0.1)] rounded-xl text-center">
                      <Activity className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs text-[#636E72]">IMC</p>
                      <p className="text-lg font-bold text-[#2D3436]">{selectedPatient.imc}</p>
                      <span className={`text-xs font-medium ${imcCategory(selectedPatient.imc).color}`}>
                        {imcCategory(selectedPatient.imc).label}
                      </span>
                    </div>
                    <div className="p-4 bg-[rgba(185,243,229,0.2)] rounded-xl text-center">
                      <Heart className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs text-[#636E72]">Condición</p>
                      <p className="text-sm font-bold text-[#2D3436] truncate">{selectedPatient.condition}</p>
                    </div>
                  </div>

                  {/* Peso ideal estimado */}
                  <div className="bg-white border border-[rgba(248,201,216,0.2)] rounded-xl p-5">
                    <h4 className="font-semibold text-sm text-[#2D3436] mb-3">Cálculos Antropométricos</h4>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-[#636E72] text-xs">Peso ideal (IMC 22)</p>
                        <p className="font-semibold">{(22 * ((selectedPatient.height / 100) ** 2)).toFixed(1)} kg</p>
                      </div>
                      <div>
                        <p className="text-[#636E72] text-xs">Peso mínimo saludable (IMC 18.5)</p>
                        <p className="font-semibold">{(18.5 * ((selectedPatient.height / 100) ** 2)).toFixed(1)} kg</p>
                      </div>
                      <div>
                        <p className="text-[#636E72] text-xs">Peso máximo saludable (IMC 25)</p>
                        <p className="font-semibold">{(25 * ((selectedPatient.height / 100) ** 2)).toFixed(1)} kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Weight Evolution Chart */}
                  <div className="bg-white border border-[rgba(248,201,216,0.2)] rounded-xl p-5">
                    <h4 className="font-semibold text-sm text-[#2D3436] mb-4">Evolución de Peso</h4>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockWeightHistory[selectedPatient.id] || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(248,201,216,0.2)" />
                          <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#636E72' }} />
                          <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 12, fill: '#636E72' }} />
                          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(248,201,216,0.3)' }} />
                          <Line type="monotone" dataKey="kg" stroke="#c07a8e" strokeWidth={2} dot={{ fill: '#c07a8e', r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Studies */}
                  <div className="bg-white border border-[rgba(248,201,216,0.2)] rounded-xl p-5">
                    <h4 className="font-semibold text-sm text-[#2D3436] mb-4">Estudios y Análisis</h4>
                    <div className="space-y-3">
                      {(mockStudies[selectedPatient.id] || []).map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-[rgba(248,201,216,0.05)] rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-[#2D3436]">{s.name}</p>
                            <p className="text-xs text-[#636E72]">{s.date} · {s.result}</p>
                          </div>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-nutri-primary bg-[rgba(248,201,216,0.2)] rounded-lg hover:bg-[rgba(248,201,216,0.4)] transition-all">
                            <FileDoc className="w-3 h-3" />Ver
                          </button>
                        </div>
                      ))}
                      {(mockStudies[selectedPatient.id] || []).length === 0 && (
                        <p className="text-sm text-[#B2BEC3] text-center py-4">Sin estudios cargados</p>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-nutri-primary border-2 border-[rgba(248,201,216,0.3)] rounded-xl hover:bg-[rgba(248,201,216,0.1)] transition-all">
                        <Plus className="w-4 h-4" />Cargar nuevo estudio
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PLAN ALIMENTARIO */}
              {patientSubTab === 'plan' && (
                <div className="space-y-6">
                  {mockPlans[selectedPatient.id] ? (
                    (() => {
                      const plan = mockPlans[selectedPatient.id];
                      const totalCal = plan.meals.reduce((s, m) => s + m.calories, 0);
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-lg text-[#2D3436]">{plan.name}</h4>
                              <p className="text-sm text-[#636E72]">{totalCal} kcal / día · Objetivo: {plan.calorieTarget} kcal</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white gradient-primary-btn rounded-xl hover:scale-[1.02] transition-all">
                                <Edit className="w-4 h-4" />Editar plan
                              </button>
                            </div>
                          </div>

                          {/* Calorie progress */}
                          <div className="h-3 bg-[rgba(248,201,216,0.15)] rounded-full overflow-hidden">
                            <div className="h-full gradient-primary-btn rounded-full transition-all" style={{ width: `${Math.min((totalCal / plan.calorieTarget) * 100, 100)}%` }} />
                          </div>

                          {/* Meals */}
                          <div className="space-y-3">
                            {plan.meals.map((m, i) => (
                              <div key={i} className="p-4 bg-[rgba(248,201,216,0.05)] border border-[rgba(248,201,216,0.1)] rounded-xl">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="text-xs text-[#B2BEC3] font-medium">{m.time}</span>
                                    <h5 className="font-medium text-sm text-[#2D3436] mt-0.5">{m.name}</h5>
                                    <p className="text-xs text-[#636E72] mt-1">{m.description}</p>
                                  </div>
                                  <span className="text-xs font-medium text-nutri-primary bg-[rgba(248,201,216,0.15)] px-2 py-1 rounded-lg">{m.calories} kcal</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-center py-12">
                      <ClipboardList className="w-12 h-12 text-[#B2BEC3] mx-auto mb-3" />
                      <p className="text-[#636E72] mb-4">Este paciente aún no tiene un plan asignado</p>
                      <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-primary-btn rounded-xl mx-auto">
                        <Plus className="w-4 h-4" />Crear Plan Nutricional
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showPatientForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-modal">
            <div className="p-6 border-b border-[rgba(248,201,216,0.15)] flex items-center justify-between">
              <h3 className="font-semibold text-lg text-[#2D3436]">Nuevo Paciente</h3>
              <button onClick={() => setShowPatientForm(false)} className="p-2 rounded-lg hover:bg-[#F7F5F0] transition-colors">
                <X className="w-5 h-5 text-[#636E72]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Nombre completo</label>
                  <input type="text" value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Email</label>
                  <input type="email" value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Teléfono</label>
                  <input type="text" value={patientForm.phone} onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Edad</label>
                  <input type="number" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: +e.target.value })}
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Altura (cm)</label>
                  <input type="number" value={patientForm.height} onChange={(e) => setPatientForm({ ...patientForm, height: +e.target.value })}
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Peso (kg)</label>
                  <input type="number" value={patientForm.weight} onChange={(e) => setPatientForm({ ...patientForm, weight: +e.target.value })}
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Condición médica</label>
                  <input type="text" value={patientForm.condition} onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
                    placeholder="Ej: Celiaquía, Diabetes..."
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Plan</label>
                  <select value={patientForm.plan} onChange={(e) => setPatientForm({ ...patientForm, plan: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all">
                    <option>Sin Gluten</option>
                    <option>Antiinflamatorio</option>
                    <option>Reducción + Sin Gluten</option>
                    <option>Mantenimiento</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowPatientForm(false)} className="px-5 py-2.5 text-sm font-medium text-[#636E72] border border-[#D5DBDB] rounded-xl hover:bg-[#F7F5F0] transition-all">
                  Cancelar
                </button>
                <button onClick={addPatient} disabled={!patientForm.name}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white gradient-primary-btn rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50">
                  <Plus className="w-4 h-4" />Agregar Paciente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-modal">
            <div className="p-6 border-b border-[rgba(248,201,216,0.15)] flex items-center justify-between">
              <h3 className="font-semibold text-lg text-[#2D3436]">
                {editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-[#F7F5F0] transition-colors">
                <X className="w-5 h-5 text-[#636E72]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Título</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) });
                  }}
                  required
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Extracto</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Contenido</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(248,201,216,0.2)] transition-all resize-y font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm font-medium text-[#636E72] border border-[#D5DBDB] rounded-xl hover:bg-[#F7F5F0] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white gradient-primary-btn rounded-xl hover:scale-[1.02] transition-all"
                >
                  <Save className="w-4 h-4" />
                  {editingArticle ? 'Guardar Cambios' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
