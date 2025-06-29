import { supabase } from './supabase';
import { AdoptionApplication } from '../types/adoption';

/**
 * Submit an adoption application to Supabase
 */
export const submitAdoptionApplication = async (
  application: AdoptionApplication
): Promise<{ success: boolean; data?: AdoptionApplication; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('User authentication error:', userError);
      return { 
        success: false, 
        error: 'Authentication error. Please sign in to submit an application.' 
      };
    }

    // Prepare application data
    const applicationData = {
      ...application,
      user_id: user?.id || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Submitting application data:', applicationData);

    // Insert application into Supabase
    const { data, error } = await supabase
      .from('adoption_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) {
      console.error('Error submitting adoption application:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to submit application. Please try again.' 
      };
    }

    // Send confirmation email
    await sendAdoptionConfirmationEmail(application);

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error submitting adoption application:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
};

/**
 * Send a confirmation email for an adoption application
 * This is a mock implementation - in production, you would use a real email service
 */
const sendAdoptionConfirmationEmail = async (application: AdoptionApplication): Promise<void> => {
  try {
    console.log('Sending adoption confirmation email to:', application.email);
    
    // In a real implementation, you would use an email service like Resend, EmailJS, or Postmark
    // For now, we'll just log the email content
    
    const emailSubject = '🐾 Thanks for Your Adoption Request!';
    const emailBody = `
      Dear ${application.full_name},
      
      Thank you for applying to adopt ${application.pet_name || 'a pet'} through PawBackHome!
      
      We've received your application and our team will review it shortly. Here's a summary of your application:
      
      Pet: ${application.pet_name || 'Not specified'}
      Your Name: ${application.full_name}
      Contact Email: ${application.email}
      Phone: ${application.phone}
      
      We'll be in touch soon to discuss next steps in the adoption process.
      
      Warm regards,
      The PawBackHome Team
      🏡 "Send every paw back home."
    `;
    
    console.log('Email subject:', emailSubject);
    console.log('Email body:', emailBody);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Adoption confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send adoption confirmation email:', error);
    // Don't fail the application if email fails
  }
};

/**
 * Get user's adoption applications
 */
export const getUserAdoptionApplications = async (): Promise<{ 
  data?: AdoptionApplication[]; 
  error?: string 
}> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching adoption applications:', error);
      return { error: 'Failed to fetch adoption applications' };
    }

    return { data: data as AdoptionApplication[] };
  } catch (error) {
    console.error('Error fetching adoption applications:', error);
    return { error: 'Failed to fetch adoption applications' };
  }
};