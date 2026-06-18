import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-foreground/70 mb-12">
            Get in touch with our team for support or inquiries
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <Mail className="w-6 h-6 text-accent mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                <p className="text-foreground/70">support@aimarketrates.com</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <Phone className="w-6 h-6 text-accent mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-foreground/70">+1 (555) 123-4567</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <MapPin className="w-6 h-6 text-accent mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Address</h3>
                <p className="text-foreground/70">123 Financial Street, New York, NY 10001</p>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background border-border"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your message"
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="btn-gold w-full">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
