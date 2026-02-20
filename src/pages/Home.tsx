import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Users, Shield, ArrowRight, CheckCircle, Zap, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen grain overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-cyan-400/80 tracking-wide uppercase">Next-Gen Logistics in Kenya</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter hero-text-glow leading-[0.9]">
              SAFE<span className="text-white">CARGO</span>
              <span className="block text-2xl md:text-4xl font-light tracking-widest mt-4 text-cyan-500/60 uppercase italic">
                Beyond Transport
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the future of freight. Secure, intelligent, and blazing fast logistics
              solutions tailored for the heart of East Africa.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button asChild size="lg" className="btn-cyan h-14 px-10 text-lg group">
                <Link to="/booking">
                  Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all">
                <Link to="/tracking">
                  Live Tracking
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Badge Strip */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm text-slate-500 uppercase tracking-widest">Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">99.9%</div>
            <div className="text-sm text-slate-500 uppercase tracking-widest">Safety Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">47</div>
            <div className="text-sm text-slate-500 uppercase tracking-widest">Counties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-slate-500 uppercase tracking-widest">Support</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding relative">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Our Core <span className="text-primary italic">Solutions</span>
              </h2>
              <p className="text-slate-400 text-lg">
                We've redesigned logistics from the ground up to provide unparalleled service quality.
              </p>
            </div>
            <Button variant="link" className="text-primary group text-lg p-0">
              View All Services <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card border-none">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Intelligent Parcel</CardTitle>
                <CardDescription className="text-slate-500 leading-relaxed">
                  Nano-tracking for every document and small package delivery.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Heavy Freight</CardTitle>
                <CardDescription className="text-slate-500 leading-relaxed">
                  Optimized bulk transportation for massive cargo needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Cross-Border</CardTitle>
                <CardDescription className="text-slate-500 leading-relaxed">
                  Seamless regional logistics across East African borders.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Elite Travel</CardTitle>
                <CardDescription className="text-slate-500 leading-relaxed">
                  Premium passenger transport with maximum safety standards.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <Badge variant="outline" className="text-primary border-primary/20 uppercase tracking-widest px-4 py-1">
                  Why SafeCargo
                </Badge>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  The Gold Standard in <br />
                  <span className="text-primary">African Logistics</span>
                </h3>
              </div>

              <div className="grid gap-8">
                {[
                  { icon: Zap, title: "Hyper-Speed", desc: "Optimized route planning for the fastest possible delivery." },
                  { icon: Shield, title: "Military-Grade Security", desc: "Your cargo is protected by our proprietary transit insurance." },
                  { icon: CheckCircle, title: "Verified Network", desc: "Every driver in our fleet is vetted with rigorous background checks." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1 text-white">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-[100px] -z-10" />
              <Card className="glass-card border-white/10 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="h-24 w-24 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-8 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary animate-pulse" />
                  Instant Booking
                </CardTitle>
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center gap-4 relative">
                      {step < 4 && <div className="absolute left-[15px] top-8 w-[2px] h-8 bg-white/5" />}
                      <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-black z-10">
                        {step}
                      </div>
                      <span className="text-slate-300 font-medium">
                        {step === 1 && "Secure Authentication"}
                        {step === 2 && "Precision Route Selection"}
                        {step === 3 && "Dynamic Quote Approval"}
                        {step === 4 && "Real-time Dispatch"}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-10 btn-cyan h-12">
                  Launch Dashboard
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden mb-20">
        <div className="absolute inset-0 bg-primary/10 skew-y-3 origin-center scale-110 -z-10" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            READY FOR THE <span className="text-primary italic">NEXT LEVEL?</span>
          </h3>
          <p className="text-xl mb-12 text-slate-400 font-light">
            Join the elite network of businesses and individuals who trust SafeCargo for their
            most critical transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="btn-cyan h-16 px-12 text-xl">
              <Link to="/booking">
                Start shipping now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-12 text-xl border-white/20 hover:bg-white/10 backdrop-blur-md">
              <Link to="/contact">
                Connect with us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-white/5 bg-black/50 text-center">
        <p className="text-slate-500 text-sm tracking-widest uppercase">
          © 2026 SafeCargo Transporters. Precision Logistics.
        </p>
      </footer>
    </div>
  );
};

export default Home;