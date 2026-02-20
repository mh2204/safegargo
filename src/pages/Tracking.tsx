import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, MapPin, Clock, User, Phone, Zap, ArrowRight, Activity, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MapboxMap from "@/components/MapboxMap";

interface BookingDetails {
  id: string;
  tracking_id: string;
  booking_type: 'passenger' | 'goods';
  pickup_location: string;
  delivery_location: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_latitude?: number;
  delivery_longitude?: number;
  status: 'pending' | 'dispatched' | 'delivered' | 'received';
  passenger_count?: number;
  goods_type?: string;
  special_instructions?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    phone?: string;
  };
}

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mapboxToken, setMapboxToken] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchToken = async () => {
      // Priority 1: Environment Variable
      const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (envToken) {
        setMapboxToken(envToken);
        return;
      }

      // Priority 2: Supabase Edge Function fallback
      const { data } = await supabase.functions.invoke('get-mapbox-token');
      if (data?.token) {
        setMapboxToken(data.token);
      }
    };
    fetchToken();
  }, []);

  const searchBooking = async () => {
    if (!trackingId.trim()) {
      toast({
        title: "Missing ID",
        description: "Please enter your SafeCargo tracking ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:customer_id (
            full_name,
            phone
          )
        `)
        .eq('tracking_id', trackingId.trim())
        .single();

      if (error || !data) {
        setBooking(null);
        toast({
          title: "ID Not Recognized",
          description: "We couldn't find a record for that ID. Please verify and try again.",
          variant: "destructive",
        });
        return;
      }

      setBooking(data as any);
    } catch (error: any) {
      toast({
        title: "System Error",
        description: "An error occurred during tracking. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5', icon: Clock, label: 'In Queue', desc: 'System verifying booking details.' };
      case 'dispatched': return { color: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5', icon: Activity, label: 'In Transit', desc: 'Asset is currently moving towards destination.' };
      case 'delivered': return { color: 'text-primary border-primary/20 bg-primary/5', icon: MapPin, label: 'At Destination', desc: 'Arrival confirmed at the target location.' };
      case 'received': return { color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5', icon: Zap, label: 'Completed', desc: 'Secure hand-off fulfilled successfully.' };
      default: return { color: 'text-slate-500 border-slate-500/20 bg-slate-500/5', icon: Package, label: 'Unknown', desc: '' };
    }
  };

  const statusInfo = booking ? getStatusInfo(booking.status) : null;

  return (
    <div className="min-h-screen grain overflow-hidden">
      <Header />

      <main className="relative pt-24 pb-20 px-6">
        {/* Background Elements */}
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 hero-text-glow uppercase">Real-time <span className="text-primary italic">Telemetry</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">Monitor your cargo or journey with precision data and real-time mapping.</p>
          </div>

          <Card className="glass-card border-none p-4 mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white mb-2">
                <Search className="h-6 w-6 text-primary" />
                Initialize Tracking
              </CardTitle>
              <CardDescription className="text-slate-400">Enter your unique SafeCargo ID to connect to the fleet telemetry.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchBooking()}
                  placeholder="e.g. SC-2026-X892"
                  className="flex-1 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-primary/40 rounded-xl"
                />
                <Button onClick={searchBooking} disabled={loading} className="btn-cyan h-14 px-10 text-lg group">
                  {loading ? (
                    <Clock className="h-6 w-6 animate-spin" />
                  ) : (
                    <>Establish Connection <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searched && !booking && !loading && (
            <div className="text-center p-12 glass-card border-none rounded-[2rem] animate-in fade-in slide-in-from-bottom-4">
              <Package className="h-16 w-16 text-slate-700 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">System Reset: ID Not Found</h3>
              <p className="text-slate-400 font-light max-w-md mx-auto">The tracking identity specified does not match any active protocols in our network. Please check your documentation.</p>
            </div>
          )}

          {booking && statusInfo && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Status & Intel */}
                <div className="lg:col-span-5 space-y-6">
                  <Card className="glass-card border-none p-4 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className={`${statusInfo.color} uppercase tracking-widest font-black text-xs px-3 py-1.5 border`}>
                          {statusInfo.label}
                        </Badge>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">LIVE FEED ACTIVE</span>
                      </div>
                      <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase mb-2">ID: {booking.tracking_id}</CardTitle>
                      <p className="text-slate-400 text-sm font-light leading-relaxed">{statusInfo.desc}</p>
                    </CardHeader>
                    <CardContent className="pt-6 border-t border-white/5 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Service Class</p>
                          <p className="text-white font-bold capitalize text-lg tracking-tight">{booking.booking_type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Manifest Date</p>
                          <p className="text-white font-bold text-lg tracking-tight">{new Date(booking.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="h-4 w-4 text-primary" />
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{booking.profiles?.full_name}</p>
                        </div>
                        <p className="text-xs text-slate-500 italic ml-7">{booking.profiles?.phone || 'Priority Customer'}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-none p-4">
                    <CardHeader>
                      <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Transit Log
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 relative">
                      {/* Vertical line connecting markers */}
                      <div className="absolute left-[29px] top-[40px] bottom-[40px] w-px bg-white/10 border-l border-dashed border-white/20" />

                      <div className="flex gap-4 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/40">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Origin Protocol</p>
                          <p className="text-white font-bold leading-tight">{booking.pickup_location}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/40">
                          <MapPin className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Target Coordinates</p>
                          <p className="text-white font-bold leading-tight">{booking.delivery_location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel: Map Deployment */}
                <div className="lg:col-span-7">
                  <Card className="glass-card border-none p-2 h-full min-h-[500px] overflow-hidden group">
                    {mapboxToken && booking.pickup_latitude && booking.pickup_longitude &&
                      booking.delivery_latitude && booking.delivery_longitude ? (
                      <div className="h-full rounded-2xl overflow-hidden grayscale-[0.2] transition-all group-hover:grayscale-0">
                        <MapboxMap
                          accessToken={mapboxToken}
                          pickupLat={booking.pickup_latitude}
                          pickupLng={booking.pickup_longitude}
                          deliveryLat={booking.delivery_latitude}
                          deliveryLng={booking.delivery_longitude}
                        />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-12">
                        <Globe className="h-20 w-20 text-white/5 mb-6 animate-spin-slow" />
                        <h4 className="text-xl font-bold text-slate-700 uppercase tracking-tighter">Satellite Visual Unavailable</h4>
                        <p className="text-sm text-slate-600 font-light mt-2">Connecting to orbital data feed...</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 hover:bg-white/5 text-slate-400 h-12 px-8 uppercase tracking-widest font-black text-xs">
                  Resync Data Feed
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black/50 text-center relative z-10">
        <p className="text-slate-500 text-sm tracking-widest uppercase">
          © 2026 SafeCargo Transporters. Orbital Logistical Intelligence.
        </p>
      </footer>
    </div>
  );
};

export default Tracking;