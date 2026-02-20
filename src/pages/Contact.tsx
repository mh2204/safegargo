import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, Globe, Shield, MessageSquare, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields Missing",
        description: "Full transmission requires name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate high-tech submission
    setTimeout(() => {
      toast({
        title: "Transmission Received",
        description: "Our logistics consultants will analyze your inquiry and respond shortly.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen grain overflow-hidden">
      <Header />

      <main className="relative pt-24 pb-20 px-6">
        {/* Background Gradients */}
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 hero-text-glow uppercase">Direct <span className="text-primary italic">Intelligence</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">Bridge the gap between your needs and our logistical capabilities. Connect with our central command.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Intel Panel: Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-none p-4">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white tracking-tight uppercase">Base Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  {[
                    { icon: MapPin, title: "Headquarters", lines: ["Nairobi CBD, Precision Zone", "Level 14, SafeCargo Tower", "Kenya"] },
                    { icon: Phone, title: "Comms Hub", lines: ["+254 700 123 456", "+254 20 123 4567"] },
                    { icon: Mail, title: "Digital Channel", lines: ["intel@safecargo.co.ke", "ops@safecargo.co.ke"] },
                    { icon: Clock, title: "Operational Window", lines: ["MON-FRI: 0600 - 2000 HRS", "SAT-SUN: 0800 - 1800 HRS"] },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{item.title}</h4>
                        {item.lines.map((line, li) => (
                          <p key={li} className="text-white font-medium text-sm leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-none bg-primary/5 p-4 border border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-primary tracking-tight flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    Priority Support
                  </CardTitle>
                  <CardDescription className="text-slate-400">Available 24/7 for critical logistics failures or urgent cargo redirection.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-all">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Response Unit</p>
                      <p className="text-2xl font-black text-white tracking-tighter italic">+254 700 ALERT</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submission Portal: Contact Form */}
            <Card className="lg:col-span-3 glass-card border-none p-6">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Protocol Initialization</CardTitle>
                <CardDescription className="text-slate-400">Specify your requirements below. Our automated routing system will direct your message to the relevant department.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-black text-slate-500 uppercase tracking-widest">Identify Yourself</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Full Name / Entity"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 rounded-xl focus-visible:ring-primary/40"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-widest">Comm Network Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="name@domain.com"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 rounded-xl focus-visible:ring-primary/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-black text-slate-500 uppercase tracking-widest">V-Mobile Sequence</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+254 XXX XXX XXX"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 rounded-xl focus-visible:ring-primary/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs font-black text-slate-500 uppercase tracking-widest">Packet Classification</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Subject of inquiry"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 rounded-xl focus-visible:ring-primary/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-black text-slate-500 uppercase tracking-widest">Payload Information</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Type your message here..."
                      rows={6}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-700 rounded-2xl focus-visible:ring-primary/40 pt-4"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-16 btn-cyan text-lg font-black uppercase tracking-widest group" disabled={loading}>
                    {loading ? (
                      <Clock className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Execute Transmission <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black/50 text-center relative z-10">
        <p className="text-slate-500 text-sm tracking-widest uppercase">
          © 2026 SafeCargo Transporters. Precision Logistics Network.
        </p>
      </footer>

    </div>
  );
};

export default Contact;