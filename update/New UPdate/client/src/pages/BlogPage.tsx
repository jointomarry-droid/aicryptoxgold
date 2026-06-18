import { Card } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Cryptocurrency Market Trends',
    excerpt: 'Learn how to analyze crypto market trends and make informed trading decisions.',
    category: 'Crypto News',
    author: 'John Doe',
    date: '2026-06-15',
  },
  {
    id: 2,
    title: 'Gold Investment Guide for Beginners',
    excerpt: 'A comprehensive guide to starting your gold investment journey.',
    category: 'Gold Investment',
    author: 'Jane Smith',
    date: '2026-06-14',
  },
  {
    id: 3,
    title: 'Silver Market Analysis Q2 2026',
    excerpt: 'Detailed analysis of silver market performance in the second quarter.',
    category: 'Silver Investment',
    author: 'Mike Johnson',
    date: '2026-06-13',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-lg text-foreground/70 mb-12">
            Latest insights and analysis on cryptocurrency and precious metals
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-card border-border p-6 hover:border-accent/50 transition-colors">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{post.title}</h3>
                <p className="text-foreground/70 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
