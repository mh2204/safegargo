import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Users, Building, Truck, MapPin, Clock, Shield, CreditCard, ArrowRight, Sparkles, Zap } from "lucide-react";

const Services = () => {

  const services = [
    {
      icon: Package,
      title: "Intelligent Parcel",
      description: "Fast and hyper-secure delivery of documents and small packages with real-time telemetry.",
      features: ["Nano-tracking precision", "Express 6-hour delivery", "Tamper-proof transit", "Digital chain of custody"],
      price: "KSh 250+",
      popular: false
    },
    {
      icon: Truck,
      title: "Heavy Freight",
      description: "Industrial-grade transportation for bulk goods and logistics operations across the region.",
      features: ["Full trailer capacity", "IoT-monitored conditions", "End-to-end management", "Bulk volume rates"],
      price: "KSh 2,500+",
      popular: true
    },
    {
      icon: Building,
      title: "Enterprise Supply",
      description: "Dedicated full-stack logistics partnerships for modern businesses and conglomerates.",
      features: ["API integration", "Custom fleet management", "Priority dispatching", "Unified billing systems"],
      price: "Custom Quote",
      popular: false
    },
    {
      icon: Users,
      title: "Elite Passenger",
      description: "Premium, safety-first passenger transport services for executives and groups.",
      features: ["Vetted expert drivers", "Luxury smart vehicles", "Route optimization", "Multi-point coordination"],
      price: "KSh 800+",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen grain overflow-hidden">
      <Header />

      <main className="relative pt-20">
        {/* Abstract background elements */}
        <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

        {/* Hero Section */}
        <section className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 hero-text-glow leading-none">
              PRECISION <br />
              <span className="text-white italic">LOGISTICS SERVICES</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light mb-12">
              Our service catalog is designed for speed, safety, and absolute transparency.
              Choose the solution that fits your scale.
            </p>
            <Button asChild size="lg" className="btn-cyan h-16 px-12 text-xl group">
              <Link to="/booking">
                Initialize Booking <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className={`glass-card border-none p-4 group relative overflow-hidden ${service.popular ? 'ring-1 ring-primary/40' : ''}`}>
                  {service.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-black text-[10px] font-black uppercase px-4 py-1.5 tracking-widest origin-bottom-left rotate-45 translate-x-[20px] translate-y-[-10px] shadow-lg">
                        Gold Standard
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <service.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Base Rate</div>
                        <div className="text-3xl font-black text-white">{service.price}</div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white mb-2">{service.title}</CardTitle>
                    <p className="text-slate-400 font-light leading-relaxed">{service.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-300 font-medium">
                          <Zap className="h-4 w-4 text-primary shrink-0 mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full h-12 btn-cyan bg-none border border-primary/20 hover:bg-primary/10">
                      <Link to="/booking">Select Service</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="section-padding relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-4xl font-black text-center mb-16 tracking-tighter uppercase">NATIONWIDE <span className="text-primary italic">PRECISION</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Metropolitan", desc: "Hyper-local delivery within Nairobi and Kiambu using our agile fleet.", features: ["6-hour turnaround", "Priority dispatching", "Live messenger chat"] },
                { title: "Inter-City", desc: "Connecting major Kenyan hubs with scheduled daily freight runs.", features: ["Daily schedules", "Consolidated freight", "Hub-to-hub tracking"] },
                { title: "Regional", desc: "Full-scale logistics across every county and selected border points.", features: ["Cross-county permits", "Insurance included", "Remote area access"] },
              ].map((region, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
                  <MapPin className="h-8 w-8 text-primary mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{region.title}</h3>
                  <p className="text-slate-400 font-light leading-relaxed mb-6">{region.desc}</p>
                  <div className="space-y-3">
                    {region.features.map((f, fi) => (
                      <div key={fi} className="flex items-center text-xs text-slate-500 uppercase tracking-widest font-black">
                        <ArrowRight className="h-3 w-3 text-primary mr-2" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding relative overflow-hidden mb-20 text-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/5" />
          <div className="container mx-auto max-w-4xl relative z-10 bg-background/50 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/5">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">CONFIGURED FOR <span className="text-primary italic">SUCCESS</span></h2>
            <p className="text-xl text-slate-400 mb-10 font-light">Join the thousands of enterprises that have optimized their logistics with SafeCargo.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="btn-cyan h-16 px-12">
                <Link to="/booking">Deploy Booking</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-12 bg-white/5 border-white/10">
                <Link to="/contact">Consultation</Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t border-white/5 bg-black/50 text-center relative z-10">
          <p className="text-slate-500 text-sm tracking-widest uppercase">
            © 2026 SafeCargo Transporters. Precision Logistics.
          </p>
        </footer>
      </main>

    </div>
  );
};

export default Services;