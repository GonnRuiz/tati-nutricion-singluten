import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { blogPosts, categories } from '@/data/mockData';
import { img } from '@/lib/utils'

export function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="min-h-screen bg-nutri-background">
      {/* Header */}
      <div className="bg-white pt-12 pb-8">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center">
            <p className="text-sm text-[#B2BEC3] mb-2">
              <Link to="/" className="hover:text-nutri-primary transition-colors">Inicio</Link>
              {' / '}
              <span className="text-nutri-primary">Blog</span>
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-[#2D3436] mb-4">
              Blog & Novedades
            </h1>
            <p className="text-[#636E72] max-w-[600px] mx-auto">
              Descubre artículos sobre nutrición, recetas saludables y consejos para mejorar tu bienestar.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {/* Filters */}
        <ScrollReveal>
          <div className="mb-10">
            {/* Search */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2BEC3]" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#D5DBDB] rounded-xl text-[15px] focus:outline-none focus:border-nutri-primary focus:ring-2 focus:ring-[rgba(74,124,89,0.1)] transition-all"
              />
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-nutri-primary text-white'
                      : 'bg-white text-[#636E72] border border-[rgba(74,124,89,0.15)] hover:border-nutri-primary hover:text-nutri-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 100}>
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
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-[rgba(212,163,115,0.15)] text-nutri-secondary text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-[#B2BEC3] text-xs">{post.readTime} de lectura</span>
                    </div>
                    <h4 className="font-semibold text-lg text-[#2D3436] mb-2 group-hover:text-nutri-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-[#636E72] text-sm line-clamp-2 mb-4">{post.excerpt}</p>
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

        {paginatedPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#636E72] text-lg">No se encontraron artículos que coincidan con tu búsqueda.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-nutri-primary text-white'
                    : 'bg-white text-[#636E72] border border-[rgba(74,124,89,0.15)] hover:border-nutri-primary hover:text-nutri-primary'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
