import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Ticket, ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { submitRegistration } from '../../lib/registrationService';
import { validateForm, ValidationError, FormData as FormDataType } from '../../lib/formValidation';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitState = 'success' | 'error' | null;

const STEPS = [
  { id: 1, label: 'Relationship', title: 'Relationship & Package', description: 'Select your relationship and package options' },
  { id: 2, label: 'Organization', title: 'Organization Details', description: 'Provide your organization and contact information' },
  { id: 3, label: 'Preferences', title: 'Preferences & Requirements', description: 'Help us accommodate your needs' },
];

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPackageSelection, setShowPackageSelection] = useState(false);

    // Form state
  const [formData, setFormData] = useState<FormDataType>({
    // Step 1
    relationship: '',
    selectedPackage: '',
    // Step 2
    organizationName: '',
    website: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phoneArea: '',
    phoneNumber: '',
    altPhoneArea: '',
    altPhoneNumber: '',
    // Sponsor/Vendor specific
    companyDescription: '',
    primaryContact: '',
    contactEmail: '',
    // Step 3
    dietaryRestrictions: [],
    adaRequirements: [],
    travelSponsorship: [],
    preferredAirport: '',
    consentsAccepted: false,
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitState>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Touched tracking for field-level validation
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Refs for accessibility & focus management
  const modalRef = useRef<HTMLDivElement | null>(null);
  const firstInvalidRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);

  // Phone refs for auto-advance
  const phoneAreaRef = useRef<HTMLInputElement | null>(null);
  const phoneNumberRef = useRef<HTMLInputElement | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Focus first element
    const toFocus = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    toFocus?.focus();

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Persist to localStorage
  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem('registrationData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.data) setFormData((prev) => ({ ...prev, ...parsed.data }));
        if (parsed?.step) setCurrentStep(parsed.step);
      } catch {
        // ignore parsing errors
      }
    }
    // Reset package selection state when modal opens
    setShowPackageSelection(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem('registrationData', JSON.stringify({ data: formData, step: currentStep }));
  }, [formData, currentStep, isOpen]);

  // Auto-scroll to top when status message appears
  useEffect(() => {
    if (submitStatus) {
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) modalContent.scrollTop = 0;
    }
  }, [submitStatus]);



  const currentMeta = useMemo(() => {
    const step = STEPS.find((s) => s.id === currentStep);
    return step || STEPS[0];
  }, [currentStep]);

  // Helpers
  const setOrClearError = (field: string, message: string | null) => {
    setValidationErrors((prev) => {
      const filtered = prev.filter((e) => e.field !== field);
      return message ? [...filtered, { field, message }] : filtered;
    });
  };

  const updateFormData = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field when user starts typing
    if (validationErrors.some((error) => error.field === field)) {
      setValidationErrors((prev) => prev.filter((error) => error.field !== field));
    }
  };

  const validateField = (field: string, value: string | boolean | string[]) => {
    const tempFormData = { ...formData, [field]: value };
    const errors = validateForm(tempFormData, currentStep);
    const fieldError = errors.find((error) => error.field === field);
    return fieldError ? fieldError.message : null;
  };

  const debouncedValidate = useMemo(() => {
    let t: number | undefined;
    return (field: string, value: any) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const err = validateField(field, value);
        setOrClearError(field, err);
      }, 300);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, currentStep]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    updateFormData(field, value);
    if (touchedFields.has(field)) {
      debouncedValidate(field, value);
    }
    // Reset package selection when relationship changes
    if (field === 'relationship') {
      setShowPackageSelection(false);
      setFormData(prev => ({ ...prev, selectedPackage: '' }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => new Set([...prev, field]));
    const err = validateField(field, (formData as any)[field]);
    setOrClearError(field, err);
  };

  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName) && validationErrors.length === 0) return null;
    const error = validationErrors.find((error) => error.field === fieldName);
    return error ? error.message : null;
  };

  const showStep = (step: number) => {
    if (step > currentStep) {
      const errors = validateForm(formData, currentStep);
      if (errors.length > 0) {
        setValidationErrors(errors);
        // Focus first invalid field
        setTimeout(() => {
          const firstErrorField = errors[0]?.field;
          if (!firstErrorField) return;
          const el = modalRef.current?.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
          el?.focus();
        }, 0);
        return;
      }
    }
    setValidationErrors([]);
    setCurrentStep(step);
  };

  const focusFirstInvalid = (errors: ValidationError[]) => {
    if (!errors.length) return;
    setTimeout(() => {
      const firstErrorField = errors[0]?.field;
      if (!firstErrorField) return;
      const el = modalRef.current?.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
      if (el) {
        el.focus();
      } else if (firstInvalidRef.current) {
        firstInvalidRef.current.focus();
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData, currentStep);
    if (errors.length > 0) {
      setValidationErrors(errors);
      focusFirstInvalid(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    setValidationErrors([]);

    try {
      const result = await submitRegistration(formData);
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Registration submitted successfully!');
        localStorage.removeItem('registrationData');
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div
        className="modal-content relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        ref={modalRef}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-slate-100 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-credentia-500">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 id="registration-title" className="text-2xl font-bold heading-color">
                  Register
                </h2>
                <p className="text-xs text-slate-500 mt-1">Secure your spot today</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close registration modal"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Stepper */}


        {/* Content */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          <div className="p-6">
            {submitStatus !== 'success' && (
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold heading-color">{currentMeta.title}</h3>
                <p className="text-base text-slate-600 mt-1">{currentMeta.description}</p>
            </div>
            )}

            {/* Success State replaces form when succeeded */}
            {submitStatus === 'success' ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-base text-green-900">Registration Successful</h4>
                    <p className="text-base text-green-800 mt-1">{submitMessage || 'We’ve received your registration.'}</p>

            </div>
          </div>
              </div>
            ) : (
              <>
                {/* Submit error/success message on Step 3 */}
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-base text-red-900">Registration Failed</h4>
                        <p className="text-base text-red-800 mt-1">{submitMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* General Error Message */}
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="font-medium text-base text-red-900 mb-1">Please fix the following errors:</h4>
                        <ul className="text-base text-red-700 space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{error.message}</span>
                            </li>
                          ))}
                        </ul>
                    </div>
                  </div>
                </div>
              )}

                {/* Forms per step */}
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-6 border border-slate-200">
                        <label className="block text-base font-medium heading-color mb-3">Relationship with Credentia*</label>
                        <p className="text-base text-slate-600 mb-4 leading-relaxed">Please select which option best describes your relationship with Credentia</p>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="relationship"
                        value="current-client"
                        checked={formData.relationship === 'current-client'}
                              onChange={(e) => handleInputChange('relationship', e.target.value)}
                              onBlur={() => handleFieldBlur('relationship')}
                        required
                              className="h-4 w-4"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                      />
                            <span className="ml-3 text-base font-medium text-slate-700">Current Credentia Client</span>
                    </label>
                          <label className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="relationship"
                        value="prospective-client"
                        checked={formData.relationship === 'prospective-client'}
                              onChange={(e) => handleInputChange('relationship', e.target.value)}
                              onBlur={() => handleFieldBlur('relationship')}
                        required
                              className="h-4 w-4"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                      />
                            <span className="ml-3 text-base font-medium text-slate-700">Prospective State Client</span>
                    </label>
                          <label className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="relationship"
                        value="sponsor"
                        checked={formData.relationship === 'sponsor'}
                              onChange={(e) => handleInputChange('relationship', e.target.value)}
                              onBlur={() => handleFieldBlur('relationship')}
                        required
                              className="h-4 w-4"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                      />
                                                        <span className="ml-3 text-base font-medium text-slate-700">Become a Sponsor</span>
                      </label>


                            {getFieldError('relationship') && (
                            <p className="mt-2 text-xs text-red-600" role="alert">
                              {getFieldError('relationship')}
                            </p>
                          )}
                  </div>
                </div>

                      {/* Package Selection for Sponsors */}
                      {formData.relationship === 'sponsor' && showPackageSelection && (
                        <div className="bg-white rounded-lg p-6 border border-slate-200">
                          <label className="block text-base font-medium heading-color mb-3">Select Sponsorship Package*</label>
                          <p className="text-base text-slate-600 mb-4 leading-relaxed">Choose the sponsorship level that best fits your organization</p>
                          <div className="space-y-3">
                            {[
                              { value: 'platinum', name: 'Platinum Sponsor', price: '$3,500', limit: 'Limit 1', description: 'Exclusive Welcome Reception + 45-min speaking opportunity' },
                              { value: 'gold', name: 'Gold Sponsor', price: '$2,000', limit: 'Limit 1', description: '30-min speaking opportunity + exhibit table' },
                              { value: 'silver', name: 'Silver Sponsor', price: '$1,500', limit: 'Limit 1', description: '20-min Sponsor Spotlight + exhibit table' }
                            ].map((pkg) => (
                              <label key={pkg.value} className="flex items-start p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                                <input
                                  type="radio"
                                  name="selectedPackage"
                                  value={pkg.value}
                                  checked={formData.selectedPackage === pkg.value}
                                  onChange={(e) => handleInputChange('selectedPackage', e.target.value)}
                                  onBlur={() => handleFieldBlur('selectedPackage')}
                                  required
                                  className="h-4 w-4 mt-1"
                                  style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-base font-medium text-slate-700">{pkg.name}</span>
                                    <div className="text-right">
                                      <span className="text-base font-bold text-credentia-500">{pkg.price}</span>
                                      <p className="text-xs text-credentia-600">{pkg.limit}</p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-slate-600 mt-1">{pkg.description}</p>
                                </div>
                              </label>
                            ))}
                            {getFieldError('selectedPackage') && (
                              <p className="mt-2 text-xs text-red-600" role="alert">
                                {getFieldError('selectedPackage')}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Package Selection for Vendors */}
                      {formData.relationship === 'vendor' && showPackageSelection && (
                        <div className="bg-white rounded-lg p-6 border border-slate-200">
                          <label className="block text-base font-medium heading-color mb-3">Vendor Package*</label>
                          <p className="text-base text-slate-600 mb-4 leading-relaxed">Confirm your vendor package selection</p>
                          <label className="flex items-start p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input
                              type="radio"
                              name="selectedPackage"
                              value="vendor"
                              checked={formData.selectedPackage === 'vendor'}
                              onChange={(e) => handleInputChange('selectedPackage', e.target.value)}
                              onBlur={() => handleFieldBlur('selectedPackage')}
                              required
                              className="h-4 w-4 mt-1"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-slate-700">Vendor Package</span>
                                <div className="text-right">
                                  <span className="text-base font-bold text-credentia-500">$800</span>
                                  <p className="text-xs text-credentia-600">Unlimited</p>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">6-foot exhibit table + 2 conference badges + visibility</p>
                            </div>
                          </label>
                          {getFieldError('selectedPackage') && (
                            <p className="mt-2 text-xs text-red-600" role="alert">
                              {getFieldError('selectedPackage')}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-8 flex justify-end">
                        {!showPackageSelection && ['sponsor', 'vendor'].includes(formData.relationship) ? (
                          <button
                            type="button"
                            onClick={() => setShowPackageSelection(true)}
                            className="px-8 py-3 text-white text-base font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center shadow-sm hover:shadow-md bg-credentia-500 hover:bg-credentia-500"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => showStep(2)}
                            className="px-8 py-3 text-white text-base font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center shadow-sm hover:shadow-md bg-credentia-500 hover:bg-credentia-500"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </button>
                        )}
                      </div>
            </div>
          )}

          {currentStep === 2 && (
                    <div className="space-y-6">
                {/* Organization Info */}
                <div className="grid grid-cols-1 gap-4">
                                    <div>
                    <label className="block text-base font-medium heading-color mb-1">Organization Name*</label>
                    <input
                      type="text"
                            name="organizationName"
                      value={formData.organizationName}
                            onChange={(e) => handleInputChange('organizationName', e.target.value)}
                            onBlur={() => handleFieldBlur('organizationName')}
                      required
                            placeholder="Enter your State or Organization name"
                            aria-invalid={!!getFieldError('organizationName')}
                            aria-describedby={getFieldError('organizationName') ? 'organizationName-error' : undefined}
                            className={`w-full text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                              getFieldError('organizationName') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    />
                          {getFieldError('organizationName') && (
                            <p id="organizationName-error" role="alert" className="mt-1 text-xs text-red-600">
                              {getFieldError('organizationName')}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-slate-500">Enter the full legal name used in official documents.</p>
                  </div>

                        {['prospective-client', 'sponsor', 'vendor'].includes(formData.relationship) && (
                  <div>
                    <label className="block text-base font-medium heading-color mb-1">Website</label>
                    <input
                      type="url"
                              name="website"
                              inputMode="url"
                      value={formData.website}
                              onChange={(e) => handleInputChange('website', e.target.value.trim())}
                              onBlur={() => handleFieldBlur('website')}
                      placeholder="https://example.com"
                              aria-invalid={!!getFieldError('website')}
                              aria-describedby={getFieldError('website') ? 'website-error' : undefined}
                              className={`w-full text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                                getFieldError('website') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    />
                            {getFieldError('website') && (
                              <p id="website-error" role="alert" className="mt-1 text-xs text-red-600">
                                {getFieldError('website')}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-slate-500">Include https:// for best results.</p>
                  </div>
                        )}
                </div>

                {/* Address */}
                                <div>
                  <label className="block text-base font-medium heading-color mb-1">Address* (To Book the Travel)</label>
                  <input
                    type="text"
                          name="street"
                          placeholder="Street address"
                    value={formData.street}
                          onChange={(e) => handleInputChange('street', e.target.value)}
                          onBlur={() => handleFieldBlur('street')}
                    required
                          aria-invalid={!!getFieldError('street')}
                          aria-describedby={getFieldError('street') ? 'street-error' : undefined}
                          className={`w-full text-base border rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                            getFieldError('street') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                        {getFieldError('street') && (
                          <p id="street-error" role="alert" className="mt-1 -mt-2 mb-2 text-xs text-red-600">
                            {getFieldError('street')}
                          </p>
                        )}

                  <input
                    type="text"
                          name="street2"
                          placeholder="Apartment, suite, etc. (optional)"
                    value={formData.street2}
                    onChange={(e) => updateFormData('street2', e.target.value)}
                          className="w-full text-base border border-slate-300 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-400"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                              name="city"
                        placeholder="City"
                        value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              onBlur={() => handleFieldBlur('city')}
                        required
                              aria-invalid={!!getFieldError('city')}
                              aria-describedby={getFieldError('city') ? 'city-error' : undefined}
                              className={`text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none w-full transition-all duration-200 ${
                                getFieldError('city') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      />
                            {getFieldError('city') && (
                              <p id="city-error" role="alert" className="mt-1 text-xs text-red-600">
                                {getFieldError('city')}
                              </p>
                            )}
                    </div>
                    <div>
                      <input
                        type="text"
                              name="state"
                        placeholder="State"
                        value={formData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              onBlur={() => handleFieldBlur('state')}
                        required
                              aria-invalid={!!getFieldError('state')}
                              aria-describedby={getFieldError('state') ? 'state-error' : undefined}
                              className={`text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none w-full transition-all duration-200 ${
                                getFieldError('state') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      />
                            {getFieldError('state') && (
                              <p id="state-error" role="alert" className="mt-1 text-xs text-red-600">
                                {getFieldError('state')}
                              </p>
                            )}
                    </div>
                          <div>
                    <input
                      type="text"
                              name="zip"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="ZIP Code"
                      value={formData.zip}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                                handleInputChange('zip', v);
                              }}
                              onBlur={() => handleFieldBlur('zip')}
                              aria-invalid={!!getFieldError('zip')}
                              aria-describedby={getFieldError('zip') ? 'zip-error' : undefined}
                              className={`text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 w-full ${
                                getFieldError('zip') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                              }`}
                            />
                            {getFieldError('zip') && (
                              <p id="zip-error" role="alert" className="mt-1 text-xs text-red-600">
                                {getFieldError('zip')}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-slate-500">US ZIP typically 5 digits.</p>
                  </div>
                        </div>

                  <select
                          name="country"
                    value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          onBlur={() => handleFieldBlur('country')}
                    required
                          aria-invalid={!!getFieldError('country')}
                          aria-describedby={getFieldError('country') ? 'country-error' : undefined}
                          className={`w-full text-base border rounded-lg px-4 py-3 mt-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                            getFieldError('country') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <option value="">Select Country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                          <option value="Mexico">Mexico</option>
                    <option value="Other">Other</option>
                  </select>
                        {getFieldError('country') && (
                          <p id="country-error" role="alert" className="mt-1 text-xs text-red-600">
                            {getFieldError('country')}
                          </p>
                        )}
                </div>

                {/* Contact */}
                                <div>
                  <label className="block text-base font-medium heading-color mb-1">Phone* (To Coordinate Travel Arrangements)</label>
                  <div className="flex">
                    <input
                            ref={phoneAreaRef}
                      type="tel"
                            name="phoneArea"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Area"
                      value={formData.phoneArea}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                              handleInputChange('phoneArea', value);
                              // auto-advance
                              if (value.length === 3) phoneNumberRef.current?.focus();
                              // clear combined phone error if becomes valid
                              const fullPhone = `${value}-${formData.phoneNumber}`;
                              const error = validateField('phone', fullPhone);
                              if (!error) setValidationErrors((prev) => prev.filter((err) => err.field !== 'phone'));
                            }}
                            onBlur={() => {
                              handleFieldBlur('phone');
                              const error = validateField('phone', `${formData.phoneArea}-${formData.phoneNumber}`);
                              setOrClearError('phone', error);
                            }}
                      maxLength={3}
                      required
                            aria-invalid={!!getFieldError('phone')}
                            aria-describedby={getFieldError('phone') ? 'phone-error' : undefined}
                            className={`w-1/4 text-base border rounded-l-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                              getFieldError('phone') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    />
                    <input
                            ref={phoneNumberRef}
                      type="tel"
                            name="phoneNumber"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Number"
                      value={formData.phoneNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                              handleInputChange('phoneNumber', value);
                              const fullPhone = `${formData.phoneArea}-${value}`;
                              const error = validateField('phone', fullPhone);
                              if (!error) setValidationErrors((prev) => prev.filter((err) => err.field !== 'phone'));
                            }}
                            onBlur={() => {
                              handleFieldBlur('phone');
                              const error = validateField('phone', `${formData.phoneArea}-${formData.phoneNumber}`);
                              setOrClearError('phone', error);
                            }}
                      maxLength={7}
                      required
                            className={`w-3/4 text-base border rounded-r-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                              getFieldError('phone') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    />
                  </div>
                        {getFieldError('phone') && (
                          <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">
                            {getFieldError('phone')}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">Format: AAA-NNNNNNN (auto-validates).</p>
                </div>

                <div>
                  <label className="block text-base font-medium heading-color mb-1">Alternate Phone</label>
                  <div className="flex">
                    <input
                      type="tel"
                            name="altPhoneArea"
                            inputMode="numeric"
                            pattern="[0-9]*"
                      placeholder="Area"
                      value={formData.altPhoneArea}
                            onChange={(e) => updateFormData('altPhoneArea', e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                            className="w-1/4 text-base border rounded-l px-3 py-2 focus:ring-2 focus:border-blue-500 outline-none border-slate-300"
                    />
                    <input
                      type="tel"
                            name="altPhoneNumber"
                            inputMode="numeric"
                            pattern="[0-9]*"
                      placeholder="Number"
                      value={formData.altPhoneNumber}
                            onChange={(e) => updateFormData('altPhoneNumber', e.target.value.replace(/\D/g, '').slice(0, 7))}
                      maxLength={7}
                            className="w-3/4 text-base border rounded-r px-3 py-2 focus:ring-2 focus:border-blue-500 outline-none border-slate-300"
                    />
                  </div>
                </div>

                {/* Sponsor/Vendor Specific Fields */}
                {['sponsor', 'vendor'].includes(formData.relationship) && (
                  <>
                    <div>
                      <label className="block text-base font-medium heading-color mb-1">Primary Contact Name*</label>
                      <input
                        type="text"
                        name="primaryContact"
                        value={formData.primaryContact}
                        onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                        onBlur={() => handleFieldBlur('primaryContact')}
                        required
                        placeholder="Enter the main contact person's name"
                        aria-invalid={!!getFieldError('primaryContact')}
                        aria-describedby={getFieldError('primaryContact') ? 'primaryContact-error' : undefined}
                        className={`w-full text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                          getFieldError('primaryContact') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      />
                      {getFieldError('primaryContact') && (
                        <p id="primaryContact-error" role="alert" className="mt-1 text-xs text-red-600">
                          {getFieldError('primaryContact')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-medium heading-color mb-1">Contact Email*</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        onBlur={() => handleFieldBlur('contactEmail')}
                        required
                        placeholder="contact@yourcompany.com"
                        aria-invalid={!!getFieldError('contactEmail')}
                        aria-describedby={getFieldError('contactEmail') ? 'contactEmail-error' : undefined}
                        className={`w-full text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 ${
                          getFieldError('contactEmail') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      />
                      {getFieldError('contactEmail') && (
                        <p id="contactEmail-error" role="alert" className="mt-1 text-xs text-red-600">
                          {getFieldError('contactEmail')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-medium heading-color mb-1">Company Description*</label>
                      <textarea
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                        onBlur={() => handleFieldBlur('companyDescription')}
                        required
                        rows={4}
                        placeholder="Provide a detailed description of your company, products/services, and what you hope to achieve through this partnership (minimum 50 characters)"
                        aria-invalid={!!getFieldError('companyDescription')}
                        aria-describedby={getFieldError('companyDescription') ? 'companyDescription-error' : undefined}
                        className={`w-full text-base border rounded-lg px-4 py-3 focus:ring-2 focus:border-blue-500 outline-none transition-all duration-200 resize-vertical ${
                          getFieldError('companyDescription') ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      />
                      {getFieldError('companyDescription') && (
                        <p id="companyDescription-error" role="alert" className="mt-1 text-xs text-red-600">
                          {getFieldError('companyDescription')}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        {formData.companyDescription.length}/50+ characters
                      </p>
                    </div>
                  </>
                )}

                      {/* Navigation */}
                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={() => showStep(1)}
                          className="px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                        <button
                          type="button"
                          onClick={() => showStep(3)}
                          className="px-6 py-3 text-white text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center shadow-sm hover:shadow-md bg-credentia-500 hover:bg-credentia-500"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
            </div>
          )}

          {currentStep === 3 && (
                    <div className="space-y-6">
                {/* Client-specific preferences */}
                {['current-client', 'prospective-client'].includes(formData.relationship) && (
                  <>
                <div>
                  <label className="block text-base font-medium heading-color mb-2">Dietary Restrictions</label>
                        <p className="text-base text-slate-600 mb-3">Please select any dietary restrictions or allergies you have</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {[
                            { key: 'vegetarian', label: 'Vegetarian' },
                            { key: 'vegan', label: 'Vegan' },
                            { key: 'kosher', label: 'Kosher' },
                            { key: 'dairy-free', label: 'Dairy-free' },
                            { key: 'gluten-free', label: 'Gluten-free' },
                          ].map((opt) => (
                            <label className="flex items-center" key={opt.key}>
                              <input
                                type="checkbox"
                                className="h-3.5 w-3.5"
                                style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                                checked={formData.dietaryRestrictions.includes(opt.key)}
                                onChange={(e) => {
                                  const newRestrictions = e.target.checked
                                    ? [...formData.dietaryRestrictions, opt.key]
                                    : formData.dietaryRestrictions.filter((r) => r !== opt.key);
                                  updateFormData('dietaryRestrictions', newRestrictions);
                                }}
                              />
                              <span className="ml-2 text-base">{opt.label}</span>
                    </label>
                          ))}
                    <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3.5 w-3.5"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                              checked={
                                formData.dietaryRestrictions.some((r) => r === 'other' || r.startsWith('other:'))
                              }
                              onChange={(e) => {
                                const hasOther = formData.dietaryRestrictions.some(
                                  (r) => r === 'other' || r.startsWith('other:')
                                );
                                let newRestrictions = formData.dietaryRestrictions.filter((r) => !r.startsWith('other:') && r !== 'other');
                                if (e.target.checked && !hasOther) {
                                  newRestrictions = [...newRestrictions, 'other'];
                                }
                                updateFormData('dietaryRestrictions', newRestrictions);
                              }}
                            />
                      <span className="ml-2 text-base">Other:</span>
                            <input
                              type="text"
                              value={
                                formData.dietaryRestrictions.find((r) => r.startsWith('other:'))?.replace('other:', '') || ''
                              }
                              onChange={(e) => {
                                const otherValue = e.target.value;
                                let newRestrictions = formData.dietaryRestrictions.filter((r) => !r.startsWith('other:'));
                                // If user is typing, ensure some marker exists
                                if (otherValue.trim()) {
                                  newRestrictions = newRestrictions.filter((r) => r !== 'other');
                                  newRestrictions.push(`other:${otherValue.trim()}`);
                                } else {
                                  // If cleared, keep the 'other' flag if checkbox is checked
                                  if (
                                    formData.dietaryRestrictions.some((r) => r === 'other' || r.startsWith('other:'))
                                  ) {
                                    newRestrictions.push('other');
                                  }
                                }
                                updateFormData('dietaryRestrictions', newRestrictions);
                              }}
                              className="ml-2 text-base border-b border-slate-300 focus:border-blue-500 outline-none flex-1 py-1 px-2"
                              placeholder="Specify dietary restriction"
                            />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium heading-color mb-2">ADA Requirements</label>
                        <p className="text-base text-slate-600 mb-3">Please indicate any accessibility accommodations you need</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {[
                            { key: 'visual-assistance', label: 'Visual assistance' },
                            { key: 'hearing-assistance', label: 'Hearing assistance' },
                            { key: 'mobility-assistance', label: 'Mobility assistance' },
                          ].map((opt) => (
                            <label className="flex items-center" key={opt.key}>
                              <input
                                type="checkbox"
                                className="h-3.5 w-3.5"
                                style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                                checked={formData.adaRequirements.includes(opt.key)}
                                onChange={(e) => {
                                  const newRequirements = e.target.checked
                                    ? [...formData.adaRequirements, opt.key]
                                    : formData.adaRequirements.filter((r) => r !== opt.key);
                                  updateFormData('adaRequirements', newRequirements);
                                }}
                              />
                              <span className="ml-2 text-base">{opt.label}</span>
                    </label>
                          ))}
                    <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3.5 w-3.5"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                              checked={
                                formData.adaRequirements.some((r) => r === 'other' || r.startsWith('other:'))
                              }
                              onChange={(e) => {
                                const hasOther = formData.adaRequirements.some(
                                  (r) => r === 'other' || r.startsWith('other:')
                                );
                                let newRequirements = formData.adaRequirements.filter((r) => !r.startsWith('other:') && r !== 'other');
                                if (e.target.checked && !hasOther) {
                                  newRequirements = [...newRequirements, 'other'];
                                }
                                updateFormData('adaRequirements', newRequirements);
                              }}
                            />
                      <span className="ml-2 text-base">Other:</span>
                            <input
                              type="text"
                              value={
                                formData.adaRequirements.find((r) => r.startsWith('other:'))?.replace('other:', '') || ''
                              }
                              onChange={(e) => {
                                const otherValue = e.target.value;
                                let newRequirements = formData.adaRequirements.filter((r) => !r.startsWith('other:'));
                                if (otherValue.trim()) {
                                  newRequirements = newRequirements.filter((r) => r !== 'other');
                                  newRequirements.push(`other:${otherValue.trim()}`);
                                } else {
                                  if (formData.adaRequirements.some((r) => r === 'other' || r.startsWith('other:'))) {
                                    newRequirements.push('other');
                                  }
                                }
                                updateFormData('adaRequirements', newRequirements);
                              }}
                              className="ml-2 text-base border-b border-slate-300 focus:border-blue-500 outline-none flex-1 py-1 px-2"
                              placeholder="Specify ADA requirement"
                            />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium heading-color mb-2">Travel Sponsorship</label>
                        <p className="text-base text-slate-600 mb-3">Select the sponsorships you would require</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3.5 w-3.5"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                              checked={formData.travelSponsorship.includes('hotel')}
                              onChange={(e) => {
                                const newSponsorship = e.target.checked
                                  ? [...formData.travelSponsorship, 'hotel']
                                  : formData.travelSponsorship.filter((s) => s !== 'hotel');
                                updateFormData('travelSponsorship', newSponsorship);
                              }}
                            />
                      <span className="ml-2 text-base">Hotel</span>
                    </label>

                    <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3.5 w-3.5"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                              checked={formData.travelSponsorship.includes('flight')}
                              onChange={(e) => {
                                const newSponsorship = e.target.checked
                                  ? [...formData.travelSponsorship, 'flight']
                                  : formData.travelSponsorship.filter((s) => s !== 'flight');
                                updateFormData('travelSponsorship', newSponsorship);
                              }}
                            />
                      <span className="ml-2 text-base">Flight</span>
                            {formData.travelSponsorship.includes('flight') && (
                              <input
                                type="text"
                                name="preferredAirport"
                                value={formData.preferredAirport}
                                onChange={(e) => updateFormData('preferredAirport', e.target.value)}
                                className="ml-2 text-base border-b border-slate-300 focus:border-blue-500 outline-none flex-1 py-1 px-2"
                                placeholder="Preferred airport"
                              />
                            )}
                    </label>

                    <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3.5 w-3.5"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                              checked={formData.travelSponsorship.includes('transportation')}
                              onChange={(e) => {
                                const newSponsorship = e.target.checked
                                  ? [...formData.travelSponsorship, 'transportation']
                                  : formData.travelSponsorship.filter((s) => s !== 'transportation');
                                updateFormData('travelSponsorship', newSponsorship);
                              }}
                            />
                      <span className="ml-2 text-base">Transportation</span>
                    </label>

                    <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3.5 w-3.5"
                              style={{ accentColor: 'rgba(28, 117, 188, 1)' }}
                              checked={
                                formData.travelSponsorship.some((s) => s === 'other' || s.startsWith('other:'))
                              }
                              onChange={(e) => {
                                const hasOther = formData.travelSponsorship.some((s) => s === 'other' || s.startsWith('other:'));
                                let newSponsorship = formData.travelSponsorship.filter((s) => !s.startsWith('other:') && s !== 'other');
                                if (e.target.checked && !hasOther) {
                                  newSponsorship = [...newSponsorship, 'other'];
                                }
                                updateFormData('travelSponsorship', newSponsorship);
                              }}
                            />
                      <span className="ml-2 text-base">Other:</span>
                            <input
                              type="text"
                              value={
                                formData.travelSponsorship.find((s) => s.startsWith('other:'))?.replace('other:', '') || ''
                              }
                              onChange={(e) => {
                                const otherValue = e.target.value;
                                let newSponsorship = formData.travelSponsorship.filter((s) => !s.startsWith('other:'));
                                if (otherValue.trim()) {
                                  newSponsorship = newSponsorship.filter((s) => s !== 'other');
                                  newSponsorship.push(`other:${otherValue.trim()}`);
                                } else {
                                  if (formData.travelSponsorship.some((s) => s === 'other' || s.startsWith('other:'))) {
                                    newSponsorship.push('other');
                                  }
                                }
                                updateFormData('travelSponsorship', newSponsorship);
                              }}
                              className="ml-2 text-base border-b border-slate-300 focus:border-blue-500 outline-none flex-1 py-1 px-2"
                              placeholder="Specify sponsorship need"
                            />
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* Sponsor/Vendor Summary */}
                {['sponsor', 'vendor'].includes(formData.relationship) && (
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <h3 className="text-lg font-bold heading-color mb-4">Registration Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base text-slate-600">Registration Type:</span>
                        <span className="text-base font-medium text-slate-900 capitalize">{formData.relationship}</span>
                      </div>
                      {formData.selectedPackage && (
                        <div className="flex justify-between items-center">
                          <span className="text-base text-slate-600">Selected Package:</span>
                          <span className="text-base font-medium text-slate-900">
                            {formData.selectedPackage === 'platinum' && 'Platinum Sponsor ($3,500)'}
                            {formData.selectedPackage === 'gold' && 'Gold Sponsor ($2,000)'}
                            {formData.selectedPackage === 'silver' && 'Silver Sponsor ($1,500)'}
                            {formData.selectedPackage === 'vendor' && 'Vendor Package ($800)'}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-base text-slate-600">Organization:</span>
                        <span className="text-base font-medium text-slate-900">{formData.organizationName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base text-slate-600">Primary Contact:</span>
                        <span className="text-base font-medium text-slate-900">{formData.primaryContact}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Next Steps:</strong> After submission, our team will contact you within 2 business days to finalize your {formData.relationship} agreement and coordinate logistics.
                      </p>
                    </div>
                  </div>
                )}

                {/* Consent */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h5 className="text-base font-medium heading-color mb-2">Consents and Policies*</h5>
                                    <label className="flex items-start">
                    <input
                      type="checkbox"
                            name="consentsAccepted"
                      checked={formData.consentsAccepted}
                            onChange={(e) => handleInputChange('consentsAccepted', e.target.checked)}
                            onBlur={() => handleFieldBlur('consentsAccepted')}
                      required
                            className="h-3.5 w-3.5 mt-1 text-credentia-500"
                    />
                          <span className="ml-2 text-xs text-slate-700">
                            I accept the terms and conditions, photography consent, and privacy policy.
                          </span>
                  </label>
                        {getFieldError('consentsAccepted') && (
                          <p className="mt-1 text-xs text-red-600" role="alert">
                            {getFieldError('consentsAccepted')}
                          </p>
                        )}
                </div>

                      {/* Navigation */}
                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={() => showStep(2)}
                          className="px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                          className="px-6 py-3 text-white text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm hover:shadow-md bg-credentia-500 hover:bg-credentia-500"
                  >
                    {isSubmitting ? (
                      <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Registration'
                    )}
                  </button>
                                </div>
            </div>
          )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
