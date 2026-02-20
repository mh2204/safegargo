import { useState } from "react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Shield, Truck, MapPin, Clock, Sparkles, Globe, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const About = () => {

  return (
    <div className="min-h-screen grain overflow-hidden">
      <Header />

      <main className="relative pt-20">
        {/* Abstract background elements */}
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[20%] h-[20%] bg-accent/10 rounded-full blur-[80px]" />

        {/* Hero Section */}
        <section className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-5xl text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/30 text-primary uppercase tracking-widest bg-primary/5">
              The SafeCargo Story
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 hero-text-glow leading-none">
              PIONEERING THE <br />
              <span className="text-white italic">FUTURE OF LOGISTICS</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Since our inception, SafeCargo has been dedicated to redefining how goods and people
              move across Kenya. We combine cutting-edge technology with an unwavering commitment
              to safety and reliability.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="section-padding relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card border-none p-4 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white tracking-tight">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center leading-relaxed font-light">
                    To provide safe, reliable, and hyper-efficient transportation services that
                    fuel economic growth and connect communities across East Africa.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none p-4 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white tracking-tight">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center leading-relaxed font-light">
                    To build the most advanced and trusted logistics infrastructure in the region,
                    setting a global benchmark for safety and innovation.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none p-4 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white tracking-tight">Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center leading-relaxed font-light">
                    Safety as a religion, transparency as a core principle, and continuous
                    innovation as our driving force in everything we do.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-20 bg-white/[0.02] border-y border-white/5 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl font-black text-center mb-16 tracking-tighter uppercase text-slate-500">Global Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center group">
                <div className="text-5xl font-black text-white mb-2 group-hover:text-primary transition-colors">10K+</div>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Deliveries</p>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-white mb-2 group-hover:text-primary transition-colors">50+</div>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Smart Fleet</p>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-white mb-2 group-hover:text-primary transition-colors">1K+</div>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Partners</p>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-white mb-2 group-hover:text-primary transition-colors">47</div>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Counties</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding relative z-10 mb-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">THE SAFECARGO <span className="text-primary italic">EDGE</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto font-light">Why we remain the preferred choice for Kenya's leading enterprises and individuals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { icon: Truck, title: "Modern Smart Fleet", desc: "AI-optimized vehicles equipped with advanced telemetry and safety sensors." },
                { icon: Users, title: "Expert Operators", desc: "Highly trained professionals who undergo continuous safety and service training." },
                { icon: MapPin, title: "Precision Network", desc: "A data-driven logistics network covering every corner of the Republic." },
                { icon: Clock, title: "Real-time Operations", desc: "24/7 command center monitoring every single transit in real-time." },
                { icon: Shield, title: "Full Indemnity", desc: "Comprehensive protection for your assets with our elite insurance partners." },
                { icon: Award, title: "Certified Quality", desc: "Adhering to the highest international standards of logistics management." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black/50 text-center relative z-10">
        <p className="text-slate-500 text-sm tracking-widest uppercase">
          © 2026 SafeCargo Transporters. Precision Logistics.
        </p>
      </footer>

    </div>
  );
};

export default About;