import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Loader2, Shield, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (profile?.role === 'admin') {
        navigate('/admin');
      } else if (profile?.role === 'assistant') {
        navigate('/assistant');
      } else {
        navigate('/dashboard');
      }
    }
  }, [loading, user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password } = authSchema.pick({ email: true, password: true }).parse(formData);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: error.message.includes("Invalid login credentials")
            ? "Vector credentials not recognized. Check your email and password."
            : error.message,
        });
        return;
      }

      toast({
        title: "Session Established",
        description: "Welcome back to the SafeCargo network.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse(formData);
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validatedData.fullName,
            phone: validatedData.phone,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Protocol Failure",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Account Initialized",
        description: "Verify your identity via the confirmation email sent to your address.",
      });

      setActiveTab("login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grain flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <Link to="/" className="flex flex-col items-center mb-10 group">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Truck className="h-10 w-10 text-primary" />
          </div>
          <span className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Safe<span className="text-primary not-italic">Cargo</span>
          </span>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-2">Logistical Intelligence</p>
        </Link>

        <Card className="glass-card border-none overflow-hidden p-2">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-black text-white tracking-tight uppercase">Base Access</CardTitle>
            <CardDescription className="text-slate-400 font-light">Secure gateway to SafeCargo dispatch and telemetry.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl h-12 mb-8">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-bold uppercase tracking-widest text-[10px]">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-bold uppercase tracking-widest text-[10px]">Registry</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Network Identifier</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 pl-11 rounded-xl focus-visible:ring-primary/40"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Auth Sequence</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 pl-11 rounded-xl focus-visible:ring-primary/40"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 btn-cyan text-sm font-black uppercase tracking-widest group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>Initialize Session <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 pl-11 rounded-xl focus-visible:ring-primary/40"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comms Line</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="e.g., 0712345678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 pl-11 rounded-xl focus-visible:ring-primary/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Net-Identity</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="email@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 pl-11 rounded-xl focus-visible:ring-primary/40"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pass-Code</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-700 pl-11 rounded-xl focus-visible:ring-primary/40"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 btn-cyan text-sm font-black uppercase tracking-widest mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Establish Protocol"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;