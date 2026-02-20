-- Create enum types for booking and user management
CREATE TYPE public.booking_type AS ENUM ('goods', 'passenger');
CREATE TYPE public.goods_type AS ENUM ('parcel', 'bulk', 'corporate');
CREATE TYPE public.booking_status AS ENUM ('pending', 'dispatched', 'delivered', 'received');
CREATE TYPE public.user_role AS ENUM ('customer', 'admin', 'driver');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT NOT NULL UNIQUE,
  vehicle_type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  driver_id UUID REFERENCES public.profiles(id),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  booking_type booking_type NOT NULL,
  goods_type goods_type,
  passenger_count INTEGER,
  pickup_location TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  delivery_location TEXT NOT NULL,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  status booking_status NOT NULL DEFAULT 'pending',
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.profiles(id),
  estimated_cost DECIMAL(10, 2),
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking status history table for tracking
CREATE TABLE public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  status booking_status NOT NULL,
  updated_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and drivers can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('admin', 'driver')
    )
  );

-- Create RLS policies for vehicles
CREATE POLICY "Admins can manage vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Drivers can view assigned vehicles" ON public.vehicles
  FOR SELECT USING (
    driver_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for bookings
CREATE POLICY "Customers can view their own bookings" ON public.bookings
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'customer'
    )
  );

CREATE POLICY "Admins and drivers can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('admin', 'driver')
    )
  );

CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- Create RLS policies for booking status history
CREATE POLICY "Anyone can view booking status history for their bookings" ON public.booking_status_history
  FOR SELECT USING (
    booking_id IN (
      SELECT b.id FROM public.bookings b
      JOIN public.profiles p ON b.customer_id = p.id
      WHERE p.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('admin', 'driver')
    )
  );

CREATE POLICY "Admins and drivers can insert status history" ON public.booking_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('admin', 'driver')
    )
  );

-- Create function to generate tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id() 
RETURNS TEXT AS $$
BEGIN
  RETURN 'SC' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-generate tracking ID
CREATE OR REPLACE FUNCTION public.set_tracking_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_id IS NULL OR NEW.tracking_id = '' THEN
    NEW.tracking_id = generate_tracking_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_tracking_id
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_tracking_id();

-- Create trigger to log status changes
CREATE OR REPLACE FUNCTION public.log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_history (booking_id, status, updated_by)
    VALUES (NEW.id, NEW.status, 
      COALESCE(
        (SELECT id FROM public.profiles WHERE user_id = auth.uid()),
        NEW.customer_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER log_status_change
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.log_booking_status_change();