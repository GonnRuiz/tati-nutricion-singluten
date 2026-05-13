import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, X, Save, FileText, Users, CalendarDays } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { blogPosts } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { img } from '@/lib/utils'

interface ArticleForm {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  status: 'Publicado' | 'Borrador';
}

const CATEGORIES = ['Nutrición', 'Hábitos Saludables', 'Meal Prep', 'Recetas', 'Bienestar'];

export function AdminPage() {
  const { toast } = useToast();
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

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <header className="bg-white border-b border-[rgba(74,124,89,0.08)] px-6 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <h1 className="font-display font-semibold text-xl text-[#2D3436]">Panel de Administración</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#636E72]">Dra. María González</span>
            <img src={img("/images/about-portrait.jpg")} alt="Admin" className="w-9 h-9 rounded-full object-cover" />
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ScrollReveal>
            <div className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(74,124,89,0.1)] flex items-center justify-center">
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
                <p className="text-2xl font-bold text-[#2D3436]">48</p>
                <p className="text-sm text-[#636E72]">Pacientes</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(212,163,115,0.15)] flex items-center justify-center">
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

        {/* Articles section */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="p-6 border-b border-[rgba(74,124,89,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-semibold text-lg text-[#2D3436]">Gestión de Artículos</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B2BEC3]" />
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-[#D5DBDB] rounded-xl text-sm focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(74,124,89,0.08)]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Título</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Categoría</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Fecha</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Estado</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#636E72]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-[rgba(74,124,89,0.05)] hover:bg-[rgba(74,124,89,0.02)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={img(article.image)} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-sm text-[#2D3436]">{article.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-[rgba(212,163,115,0.15)] text-nutri-secondary text-xs font-medium">
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
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 rounded-lg text-[#636E72] hover:bg-[rgba(74,124,89,0.1)] hover:text-nutri-primary transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 rounded-lg text-[#636E72] hover:bg-red-50 hover:text-red-500 transition-all"
                          title="Eliminar"
                        >
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
      </div>

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-modal">
            <div className="p-6 border-b border-[rgba(74,124,89,0.08)] flex items-center justify-between">
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
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
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
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436] mb-1.5">Contenido</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all resize-y font-mono text-sm"
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
