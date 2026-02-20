import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingNotificationRequest {
  bookingId: string;
  newStatus: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, newStatus }: BookingNotificationRequest = await req.json();
    
    console.log('Sending notification for booking:', bookingId, 'with status:', newStatus);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get booking details with customer info
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles!bookings_customer_id_fkey (
          full_name,
          user_id
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError);
      throw new Error('Booking not found');
    }

    // Get customer email from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
      booking.profiles.user_id
    );

    if (userError || !userData?.user?.email) {
      console.error('Error fetching user email:', userError);
      throw new Error('Customer email not found');
    }

    const customerEmail = userData.user.email;
    const customerName = booking.profiles.full_name;

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const statusMessages: Record<string, string> = {
      pending: 'Your booking has been received and is pending assignment.',
      assigned: 'A driver has been assigned to your booking.',
      in_progress: 'Your booking is now in progress.',
      completed: 'Your booking has been completed.',
      cancelled: 'Your booking has been cancelled.',
    };

    const emailBody = `
      <h2>Booking Status Update</h2>
      <p>Dear ${customerName},</p>
      <p>${statusMessages[newStatus] || 'Your booking status has been updated.'}</p>
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Tracking ID:</strong> ${booking.tracking_id}</li>
        <li><strong>Status:</strong> ${newStatus.replace('_', ' ').toUpperCase()}</li>
        <li><strong>Pickup:</strong> ${booking.pickup_location}</li>
        <li><strong>Delivery:</strong> ${booking.delivery_location}</li>
      </ul>
      <p>Thank you for choosing our service!</p>
    `;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafeCargo <notifications@yourdomain.com>',
        to: [customerEmail],
        subject: `Booking ${booking.tracking_id} - Status Update`,
        html: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error('Failed to send email');
    }

    const emailData = await emailResponse.json();
    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-booking-notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
