import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { blogPosts } from '@/data/mockData';
import { img } from '@/lib/utils'

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-nutri-background">
      {/* Header */}
      <div className="bg-white pt-8 pb-6">
        <div className="max-w-[720px] mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#636E72] hover:text-nutri-primary text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Blog
          </Link>
        </div>
      </div>

      <article className="max-w-[720px] mx-auto px-6 py-8">
        <ScrollReveal>
          <span className="inline-block px-3 py-1 rounded-full bg-[rgba(212,163,115,0.15)] text-nutri-secondary text-xs font-medium mb-4">
            {post.category}
          </span>
          <h1 className="font-display font-bold text-3xl md:text-[42px] text-[#2D3436] leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[#636E72] mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} de lectura
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <img
            src={img(post.image)}
            alt={post.title}
            className="w-full rounded-2xl mb-8"
          />
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="prose prose-lg max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </ScrollReveal>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <ScrollReveal>
            <div className="mt-16 pt-8 border-t border-[rgba(74,124,89,0.1)]">
              <h3 className="font-display font-semibold text-xl text-[#2D3436] mb-6">
                Artículos Relacionados
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.slug}`}
                    className="flex gap-4 p-4 bg-white rounded-xl hover:shadow-card transition-all duration-300 group"
                  >
                    <img
                      src={img(rp.image)}
                      alt={rp.title}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <span className="text-xs text-nutri-secondary font-medium">{rp.category}</span>
                      <h4 className="font-semibold text-[#2D3436] group-hover:text-nutri-primary transition-colors text-sm mt-1">
                        {rp.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-[rgba(74,124,89,0.1)]">
          <div className="flex justify-between">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="text-left group"
              >
                <span className="text-xs text-[#B2BEC3]">Anterior</span>
                <p className="text-nutri-primary font-medium group-hover:underline text-sm max-w-[200px] truncate">
                  ← {prevPost.title}
                </p>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="text-right group"
              >
                <span className="text-xs text-[#B2BEC3]">Siguiente</span>
                <p className="text-nutri-primary font-medium group-hover:underline text-sm max-w-[200px] truncate">
                  {nextPost.title} →
                </p>
              </Link>
            ) : <div />}
          </div>
        </div>
      </article>
    </div>
  );
}
