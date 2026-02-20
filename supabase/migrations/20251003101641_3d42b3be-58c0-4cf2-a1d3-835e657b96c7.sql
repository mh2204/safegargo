-- Update bookings RLS policies to include assistant permissions
-- Drop existing policies that need updating
DROP POLICY IF EXISTS "Admins and drivers can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;

-- Recreate policies with assistant included
CREATE POLICY "Admins, drivers, and assistants can view all bookings"
ON bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.role IN ('admin', 'driver', 'assistant')
  )
);

CREATE POLICY "Admins and assistants can update bookings"
ON bookings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.role IN ('admin', 'assistant')
  )
);

CREATE POLICY "Assistants can create bookings on behalf of customers"
ON bookings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.role = 'assistant'
  )
);

-- Update booking_status_history policies
DROP POLICY IF EXISTS "Admins and drivers can insert status history" ON booking_status_history;

CREATE POLICY "Admins, drivers, and assistants can insert status history"
ON booking_status_history
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.role IN ('admin', 'driver', 'assistant')
  )
);

-- Update profiles view policies
DROP POLICY IF EXISTS "Drivers can view all profiles" ON profiles;

CREATE POLICY "Drivers and assistants can view all profiles"
ON profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'driver') 
  OR has_role(auth.uid(), 'assistant')
  OR auth.uid() = user_id
);

-- Assistants can view available vehicles (same as drivers)
CREATE POLICY "Assistants can view all vehicles"
ON vehicles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.role = 'assistant'
  )
);