export interface ValidationError {
  field: string;
  message: string;
}

export interface FormData {
  relationship: string;
  // Package selection for sponsors/vendors
  selectedPackage: string;
  // Basic info
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
  // Sponsor/Vendor specific fields
  companyDescription: string;
  primaryContact: string;
  contactEmail: string;
  // Conference preferences (for clients)
  dietaryRestrictions: string[];
  adaRequirements: string[];
  travelSponsorship: string[];
  preferredAirport: string;
  consentsAccepted: boolean;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Optional field
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validatePhone = (area: string, number: string): boolean => {
  const areaRegex = /^\d{3}$/;
  const numberRegex = /^\d{7}$/;
  return areaRegex.test(area) && numberRegex.test(number);
};

export const validateZipCode = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

export const validateOrganizationName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5 && address.trim().length <= 200;
};

export const validateCity = (city: string): boolean => {
  return city.trim().length >= 2 && city.trim().length <= 50;
};

export const validateState = (state: string): boolean => {
  return state.trim().length >= 2 && state.trim().length <= 50;
};

export const validateStep1 = (formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.relationship) {
    errors.push({
      field: 'relationship',
      message: 'Please select your relationship with Credentia'
    });
  }

  // Package selection validation for sponsors and vendors
  if (['sponsor', 'vendor'].includes(formData.relationship) && !formData.selectedPackage) {
    errors.push({
      field: 'selectedPackage',
      message: 'Please select a package'
    });
  }

  return errors;
};

export const validateStep2 = (formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Organization Name validation
  if (!formData.organizationName.trim()) {
    errors.push({
      field: 'organizationName',
      message: 'Organization name is required'
    });
  } else if (!validateOrganizationName(formData.organizationName)) {
    errors.push({
      field: 'organizationName',
      message: 'Organization name must be between 2 and 100 characters'
    });
  }

  // Website validation (for prospective clients, sponsors, and vendors)
  if (['prospective-client', 'sponsor', 'vendor'].includes(formData.relationship) && formData.website.trim()) {
    if (!validateUrl(formData.website)) {
      errors.push({
        field: 'website',
        message: 'Please enter a valid website URL (e.g., https://example.com)'
      });
    }
  }

  // Street address validation
  if (!formData.street.trim()) {
    errors.push({
      field: 'street',
      message: 'Street address is required'
    });
  } else if (!validateAddress(formData.street)) {
    errors.push({
      field: 'street',
      message: 'Street address must be between 5 and 200 characters'
    });
  }

  // City validation
  if (!formData.city.trim()) {
    errors.push({
      field: 'city',
      message: 'City is required'
    });
  } else if (!validateCity(formData.city)) {
    errors.push({
      field: 'city',
      message: 'City must be between 2 and 50 characters'
    });
  }

  // State validation
  if (!formData.state.trim()) {
    errors.push({
      field: 'state',
      message: 'State is required'
    });
  } else if (!validateState(formData.state)) {
    errors.push({
      field: 'state',
      message: 'State must be between 2 and 50 characters'
    });
  }

  // Zip code validation
  if (formData.zip.trim() && !validateZipCode(formData.zip)) {
    errors.push({
      field: 'zip',
      message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
    });
  }

  // Country validation
  if (!formData.country.trim()) {
    errors.push({
      field: 'country',
      message: 'Country is required'
    });
  }

  // Primary phone validation
  if (!formData.phoneArea.trim() || !formData.phoneNumber.trim()) {
    errors.push({
      field: 'phone',
      message: 'Phone number is required'
    });
  } else if (!validatePhone(formData.phoneArea, formData.phoneNumber)) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number (Area: 3 digits, Number: 7 digits)'
    });
  }

  // Alternate phone validation (optional)
  if ((formData.altPhoneArea.trim() || formData.altPhoneNumber.trim()) &&
      !validatePhone(formData.altPhoneArea, formData.altPhoneNumber)) {
    errors.push({
      field: 'altPhone',
      message: 'Please enter a valid alternate phone number or leave both fields empty'
    });
  }

  // Sponsor/Vendor specific validations
  if (['sponsor', 'vendor'].includes(formData.relationship)) {
    // Primary contact validation
    if (!formData.primaryContact.trim()) {
      errors.push({
        field: 'primaryContact',
        message: 'Primary contact name is required'
      });
    }

    // Contact email validation
    if (!formData.contactEmail.trim()) {
      errors.push({
        field: 'contactEmail',
        message: 'Contact email is required'
      });
    } else if (!validateEmail(formData.contactEmail)) {
      errors.push({
        field: 'contactEmail',
        message: 'Please enter a valid email address'
      });
    }

    // Company description validation
    if (!formData.companyDescription.trim()) {
      errors.push({
        field: 'companyDescription',
        message: 'Company description is required'
      });
    } else if (formData.companyDescription.trim().length < 50) {
      errors.push({
        field: 'companyDescription',
        message: 'Company description must be at least 50 characters'
      });
    }
  }

  return errors;
};

export const validateStep3 = (formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.consentsAccepted) {
    errors.push({
      field: 'consentsAccepted',
      message: 'You must accept the terms and conditions to proceed'
    });
  }

  return errors;
};

export const validateForm = (formData: FormData, currentStep: number): ValidationError[] => {
  switch (currentStep) {
    case 1:
      return validateStep1(formData);
    case 2:
      return validateStep2(formData);
    case 3:
      return validateStep3(formData);
    default:
      return [];
  }
};
