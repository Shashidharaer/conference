import { supabase } from './supabase'

interface FormData {
  relationship: string;
  selectedPackage: string;
  organizationName: string;
  website: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phoneArea: string;
  phoneNumber: string;
  altPhoneArea: string;
  altPhoneNumber: string;
  companyDescription: string;
  primaryContact: string;
  contactEmail: string;
  dietaryRestrictions: string[];
  adaRequirements: string[];
  travelSponsorship: string[];
  preferredAirport: string;
  consentsAccepted: boolean;
}

interface RegistrationResult {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export const submitRegistration = async (formData: FormData): Promise<RegistrationResult> => {
  try {
    // Transform form data to match database schema
    const registrationData = {
      relationship_with_credentia: formData.relationship,
      selected_package: formData.selectedPackage || '',
      organization_name: formData.organizationName,
      website: formData.website,
      address: {
        street: formData.street,
        street2: formData.street2,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country
      },
      phone: {
        area: formData.phoneArea,
        number: formData.phoneNumber
      },
      alternate_phone: {
        area: formData.altPhoneArea,
        number: formData.altPhoneNumber
      },
      // Sponsor/Vendor specific fields
      company_description: formData.companyDescription || '',
      primary_contact: formData.primaryContact || '',
      contact_email: formData.contactEmail || '',
      // Client specific fields
      dietary_restrictions: formData.dietaryRestrictions || [],
      ada_requirements: formData.adaRequirements || [],
      travel_sponsorship: formData.travelSponsorship || [],
      preferred_airport: formData.preferredAirport || '',
      consents_accepted: formData.consentsAccepted || false,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert([registrationData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Registration failed: ${error.message}`)
    }

    return {
      success: true,
      data: data[0],
      message: 'Registration submitted successfully!'
    }
  } catch (error: any) {
    console.error('Registration submission error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    }
  }
}

export const getRegistrations = async (): Promise<RegistrationResult> => {
  try {
    // Check if admin is authenticated (basic client-side check)
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'authenticated') {
      throw new Error('Unauthorized access. Please login as admin.');
    }

    // Add rate limiting check (reduced to 500ms for better UX)
    const lastFetch = localStorage.getItem('lastAdminFetch');
    const now = Date.now();
    if (lastFetch && (now - parseInt(lastFetch)) < 500) { // 0.5 second rate limit
      throw new Error('Please wait before fetching data again.');
    }
    localStorage.setItem('lastAdminFetch', now.toString());

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // Log the access attempt
      console.error('Database access error:', error);
      throw error;
    }

    // Log successful admin data access (don't wait for it to complete)
    logAdminAction('data_fetch', true).catch(console.warn);

    return { success: true, data }
  } catch (error: any) {
    console.error('Error fetching registrations:', error);

    // Log failed attempt (don't wait for it to complete)
    logAdminAction('data_fetch_failed', false, { error: error.message }).catch(console.warn);

    return { success: false, error: error.message }
  }
}

// Helper function to log admin actions
const logAdminAction = async (action: string, success: boolean, details?: any) => {
  try {
    // First check if the function exists by trying to call it
    const { error } = await supabase.rpc('log_admin_access', {
      action_type: action,
      success_flag: success,
      additional_details: details || {}
    });

    if (error) {
      console.warn('Admin logging function not available:', error.message);
    }
  } catch (error) {
    // Silently fail logging to not break main functionality
    console.warn('Failed to log admin action:', error);
  }
};
