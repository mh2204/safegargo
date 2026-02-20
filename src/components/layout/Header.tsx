import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Menu, X, Shield, Package, Globe, User, LogOut, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Booking", href: "/booking" },
    { name: "Tracking", href: "/tracking" },
    { name: "Contact", href: "/contact" },
  ];

  const getDashboardIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 mr-2" />;
      case 'assistant': return <Package className="h-4 w-4 mr-2" />;
      default: return <LayoutDashboard className="h-4 w-4 mr-2" />;
    }
  };

  const getDashboardLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin Panel';
      case 'assistant': return 'Assistant Panel';
      default: return 'Dashboard';
    }
  };

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'assistant': return '/assistant';
      default: return '/dashboard';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "py-3 bg-background/80 backdrop-blur-xl border-b border-white/5"
        : "py-6 bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden bg-white">
            <img
              src="logo.PNG"
              alt="SafeCargo Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Truck className="h-6 w-6 text-primary hidden" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Safe<span className="text-primary not-italic">Cargo</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === item.href
                ? "text-primary"
                : "text-slate-400 hover:text-white"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" className="text-slate-400 hover:text-white uppercase tracking-widest font-black text-xs">
                <Link to={getDashboardPath(profile?.role || '')}>
                  {getDashboardIcon(profile?.role || '')}
                  {getDashboardLabel(profile?.role || '')}
                </Link>
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest px-6 h-10">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-slate-400 hover:text-white uppercase tracking-widest font-black text-xs">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="btn-cyan h-10 px-6 text-xs font-black uppercase tracking-widest">
                <Link to="/booking">Book Now</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-b border-white/5 p-6 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-6 mb-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-lg font-black uppercase tracking-widest ${location.pathname === item.href
                  ? "text-primary font-bold"
                  : "text-slate-400"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Button asChild className="w-full btn-cyan h-12">
                  <Link to={getDashboardPath(profile?.role || '')} onClick={() => setIsMenuOpen(false)}>
                    {getDashboardLabel(profile?.role || '')}
                  </Link>
                </Button>
                <Button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} variant="outline" className="w-full">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full border-white/10 bg-white/5">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild className="w-full btn-cyan h-12">
                  <Link to="/booking" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;