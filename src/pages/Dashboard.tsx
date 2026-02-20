import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock, MapPin, User, Plus, Eye, Home as HomeIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  tracking_id: string;
  booking_type: 'passenger' | 'goods';
  pickup_location: string;
  delivery_location: string;
  status: 'pending' | 'dispatched' | 'delivered' | 'received';
  passenger_count?: number;
  goods_type?: string;
  special_instructions?: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, user, loading } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    // Redirect admins to admin dashboard
    if (profile?.role === 'admin') {
      navigate("/admin");
      return;
    }

    fetchBookings();
  }, [loading, user, profile, navigate]);

  const fetchBookings = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'dispatched': return 'bg-blue-500';
      case 'delivered': return 'bg-orange-500';
      case 'received': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your booking is being processed';
      case 'dispatched': return 'Your item is on the way';
      case 'delivered': return 'Your item has been delivered';
      case 'received': return 'Delivery confirmed and completed';
      default: return '';
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, {profile?.full_name}</h1>
            <p className="text-muted-foreground">Track your deliveries and manage your bookings</p>
          </div>
          <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2">
            <Link to="/">
              <HomeIcon className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Deliveries</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => ['pending', 'dispatched'].includes(b.status)).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'received').length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Bookings</h2>
              <Button asChild>
                <Link to="/booking">
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Link>
              </Button>
            </div>

            {dataLoading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first booking to get started</p>
                  <Button asChild>
                    <Link to="/booking">Create Booking</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-mono">
                              {booking.tracking_id}
                            </Badge>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="secondary">
                              {booking.booking_type === 'passenger' ? 'Passenger' : 'Goods'}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">From:</span>
                              <span>{booking.pickup_location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">To:</span>
                              <span>{booking.delivery_location}</span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {getStatusDescription(booking.status)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-muted-foreground mt-1">{profile?.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <p className="text-sm text-muted-foreground mt-1">{profile?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{profile?.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Dashboard;