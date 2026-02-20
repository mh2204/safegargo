import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Users, Car, BarChart3, Clock, MapPin, Phone, User, Trash2, Home as HomeIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  tracking_id: string;
  customer_id: string;
  booking_type: 'passenger' | 'goods';
  pickup_location: string;
  delivery_location: string;
  status: 'pending' | 'dispatched' | 'delivered' | 'received';
  passenger_count?: number;
  goods_type?: string;
  special_instructions?: string;
  created_at: string;
  vehicle_id?: string;
  driver_id?: string;
  estimated_cost?: number;
  profiles?: {
    full_name: string;
    phone?: string;
  } | null;
  vehicles?: {
    id: string;
    vehicle_type: string;
    license_plate: string;
    profiles?: {
      full_name: string;
    };
  } | null;
}

interface Vehicle {
  id: string;
  vehicle_type: string;
  license_plate: string;
  capacity: number;
  is_available: boolean;
  driver_id?: string;
  profiles?: {
    full_name: string;
    phone?: string;
  } | null;
}

interface Driver {
  id: string;
  full_name: string;
  phone?: string;
  role: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: "",
    license_plate: "",
    capacity: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      navigate("/auth");
      return;
    }
    if (profile.role !== 'admin') {
      navigate("/dashboard");
      return;
    }
    fetchBookings();
    fetchVehicles();
    fetchDrivers();
  }, [loading, profile, navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:customer_id (
            full_name,
            phone
          ),
          vehicles:vehicle_id (
            id,
            vehicle_type,
            license_plate,
            profiles:driver_id (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data as any) || []);
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

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profiles:driver_id (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching vehicles",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, role')
        .eq('role', 'driver');

      if (error) throw error;
      setDrivers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching drivers",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: 'pending' | 'dispatched' | 'delivered' | 'received') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addVehicle = async () => {
    if (!newVehicle.vehicle_type || !newVehicle.license_plate || !newVehicle.capacity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all vehicle details.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([{
          vehicle_type: newVehicle.vehicle_type,
          license_plate: newVehicle.license_plate,
          capacity: parseInt(newVehicle.capacity),
        }]);

      if (error) throw error;

      toast({
        title: "Vehicle Added",
        description: "New vehicle has been added successfully.",
      });

      setNewVehicle({ vehicle_type: "", license_plate: "", capacity: "" });
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: "Error Adding Vehicle",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const assignVehicleAndDriver = async (bookingId: string, vehicleId: string, driverId?: string) => {
    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          vehicle_id: vehicleId,
          driver_id: driverId,
          status: 'dispatched'
        })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      // Update vehicle availability
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ is_available: false })
        .eq('id', vehicleId);

      if (vehicleError) throw vehicleError;

      toast({
        title: "Assignment Successful",
        description: "Vehicle and driver have been assigned to the booking.",
      });

      setAssignmentDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings();
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: "Assignment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const releaseVehicle = async (bookingId: string, vehicleId: string) => {
    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          vehicle_id: null,
          driver_id: null,
          status: 'pending'
        })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ is_available: true })
        .eq('id', vehicleId);

      if (vehicleError) throw vehicleError;

      toast({
        title: "Vehicle Released",
        description: "Vehicle has been released and is now available.",
      });

      fetchBookings();
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: "Release Failed",
        description: error.message,
        variant: "destructive",
      });
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

  if (loading) {
    return null;
  }
  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage bookings, vehicles, drivers, and operations</p>
          </div>
          <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2">
            <Link to="/">
              <HomeIcon className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Drivers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Bookings</CardTitle>
                <CardDescription>Manage customer bookings, assign vehicles, and update status</CardDescription>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No bookings found</div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">
                                  {booking.tracking_id}
                                </Badge>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <Badge variant="secondary">
                                  {booking.booking_type === 'passenger' ? (
                                    <><Users className="h-3 w-3 mr-1" /> Passenger</>
                                  ) : (
                                    <><Package className="h-3 w-3 mr-1" /> Goods</>
                                  )}
                                </Badge>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{booking.profiles?.full_name}</span>
                                  {booking.profiles?.phone && (
                                    <>
                                      <Phone className="h-4 w-4 text-muted-foreground ml-2" />
                                      <span>{booking.profiles.phone}</span>
                                    </>
                                  )}
                                </div>

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

                                {booking.booking_type === 'passenger' && booking.passenger_count && (
                                  <div className="text-sm text-muted-foreground">
                                    {booking.passenger_count} passenger(s)
                                  </div>
                                )}

                                {booking.booking_type === 'goods' && booking.goods_type && (
                                  <div className="text-sm text-muted-foreground">
                                    Goods: {booking.goods_type}
                                  </div>
                                )}

                                {booking.vehicle_id && booking.vehicles && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Vehicle:</span>
                                    <span>{booking.vehicles.vehicle_type} - {booking.vehicles.license_plate}</span>
                                    {booking.vehicles.profiles && (
                                      <span>| Driver: {booking.vehicles.profiles.full_name}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {booking.vehicle_id ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => releaseVehicle(booking.id, booking.vehicle_id!)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Release Vehicle
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setAssignmentDialogOpen(true);
                                  }}
                                >
                                  <Car className="h-3 w-3 mr-1" />
                                  Assign Vehicle
                                </Button>
                              )}
                              <Select
                                value={booking.status}
                                onValueChange={(value) => updateBookingStatus(booking.id, value as 'pending' | 'dispatched' | 'delivered' | 'received')}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="dispatched">Dispatched</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="received">Received</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Vehicle</CardTitle>
                  <CardDescription>Register a new vehicle to the fleet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Input
                      id="vehicle_type"
                      value={newVehicle.vehicle_type}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, vehicle_type: e.target.value }))}
                      placeholder="e.g., Van, Truck, Bus"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_plate">License Plate</Label>
                    <Input
                      id="license_plate"
                      value={newVehicle.license_plate}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, license_plate: e.target.value }))}
                      placeholder="e.g., KCA 123A"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newVehicle.capacity}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, capacity: e.target.value }))}
                      placeholder="Maximum capacity"
                    />
                  </div>

                  <Button onClick={addVehicle} className="w-full">
                    Add Vehicle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fleet Overview</CardTitle>
                  <CardDescription>Current vehicles in the fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{vehicle.vehicle_type}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.license_plate}</div>
                          <div className="text-sm text-muted-foreground">Capacity: {vehicle.capacity}</div>
                          {vehicle.profiles && (
                            <div className="text-sm text-muted-foreground">
                              Driver: {vehicle.profiles.full_name}
                            </div>
                          )}
                        </div>
                        <Badge variant={vehicle.is_available ? "secondary" : "destructive"}>
                          {vehicle.is_available ? "Available" : "In Use"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Driver</CardTitle>
                  <CardDescription>Register a new driver to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <DriverRegistrationForm onDriverAdded={fetchDrivers} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Drivers List</CardTitle>
                  <CardDescription>Manage registered drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {drivers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No drivers registered</p>
                    ) : (
                      drivers.map((driver) => (
                        <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{driver.full_name}</div>
                            <div className="text-sm text-muted-foreground">{driver.phone || 'No phone'}</div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                      <p className="text-2xl font-bold">{vehicles.length}</p>
                    </div>
                    <Car className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available Vehicles</p>
                      <p className="text-2xl font-bold">
                        {vehicles.filter(v => v.is_available).length}
                      </p>
                    </div>
                    <Car className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Vehicle Assignment Dialog */}
        <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Vehicle & Driver</DialogTitle>
              <DialogDescription>
                Select a vehicle and driver for booking {selectedBooking?.tracking_id}
              </DialogDescription>
            </DialogHeader>
            <VehicleAssignmentForm
              vehicles={vehicles.filter(v => v.is_available)}
              drivers={drivers}
              onAssign={(vehicleId, driverId) =>
                selectedBooking && assignVehicleAndDriver(selectedBooking.id, vehicleId, driverId)
              }
              onCancel={() => setAssignmentDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

// Vehicle Assignment Form Component
interface VehicleAssignmentFormProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  onAssign: (vehicleId: string, driverId?: string) => void;
  onCancel: () => void;
}

const VehicleAssignmentForm = ({ vehicles, drivers, onAssign, onCancel }: VehicleAssignmentFormProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");

  const handleSubmit = () => {
    if (!selectedVehicle) return;
    onAssign(selectedVehicle, selectedDriver || undefined);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vehicle">Select Vehicle *</Label>
        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicle_type} - {vehicle.license_plate} (Capacity: {vehicle.capacity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="driver">Select Driver (Optional)</Label>
        <Select value={selectedDriver} onValueChange={setSelectedDriver}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a driver" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.full_name} {driver.phone && `- ${driver.phone}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedVehicle}>
          Assign
        </Button>
      </div>
    </div>
  );
};

// Driver Registration Form Component
interface DriverRegistrationFormProps {
  onDriverAdded: () => void;
}

const DriverRegistrationForm = ({ onDriverAdded }: DriverRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .rpc('create_driver_profile', {
          _email: formData.email,
          _password: formData.password,
          _full_name: formData.fullName,
          _phone: formData.phone || null
        });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        throw new Error(result.error || 'Failed to create driver account');
      }

      toast({
        title: "Driver Added",
        description: "Driver account has been created successfully.",
      });

      setFormData({ email: "", password: "", fullName: "", phone: "" });
      onDriverAdded();
    } catch (error: any) {
      toast({
        title: "Error Adding Driver",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter driver's full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter driver's email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create password for driver"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="e.g., 0712345678"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Adding Driver..." : "Add Driver"}
      </Button>
    </form>
  );
};

export default AdminDashboard;