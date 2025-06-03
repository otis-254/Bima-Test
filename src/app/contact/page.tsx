'use client'

import { useState, useEffect } from 'react'
import { AnimatedSection } from '@/components/AnimatedSection'
import '@/styles/animations.css'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import emailjs from '@emailjs/browser'
import SuccessDialog from '@/components/SuccessDialog'

export default function ContactPage() {
  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("12pmQhGYvWzg9n1Z0");
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    policyNumber: '',
    correspondence: '',
    lawyers: '',
    claimDetails: '',
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [policyFile, setPolicyFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true);
    setSubmissionStatus('loading');
    setSubmissionMessage(null);

    try {
      // Convert files to base64 if they exist
      let correspondenceFileBase64 = '';
      let policyFileBase64 = '';
      
      if (uploadedFile) {
        correspondenceFileBase64 = await convertFileToBase64(uploadedFile);
      }
      if (policyFile) {
        policyFileBase64 = await convertFileToBase64(policyFile);
      }

      // Prepare template parameters
      const templateParams = {
        fullName: formData.fullName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        policyNumber: formData.policyNumber,
        correspondence: formData.correspondence,
        claimDetails: formData.claimDetails,
        correspondenceFile: correspondenceFileBase64,
        policyFile: policyFileBase64,
        correspondenceFileName: uploadedFile?.name || '',
        policyFileName: policyFile?.name || '',
        to_email: 'olelecaleb176@gmail.com',
      };

      console.log('Sending email with params:', {
        ...templateParams,
        correspondenceFile: 'base64 data...',
        policyFile: 'base64 data...'
      });

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_5eceipe',
        'template_3i0vuek',
        templateParams,
        '12pmQhGYvWzg9n1Z0'
      );

      console.log('EmailJS response:', response);

      if (response.status === 200) {
        // Send automated reply to the user
        try {
          const autoReplyParams = {
            to_email: formData.email,
            fullName: formData.fullName, // Assuming your template uses full name
          };
          const autoReplyResponse = await emailjs.send(
            'service_5eceipe', // Use the same service ID
            'template_2r19nbc', // Use the automated reply template ID
            autoReplyParams,
            '12pmQhGYvWzg9n1Z0' // Use the same public key
          );
          console.log('Automated reply sent:', autoReplyResponse);
        } catch (autoReplyError) {
          console.error('Failed to send automated reply:', autoReplyError);
          // Continue with the success flow even if auto-reply fails
        }

        // Reset the form first
        setFormData({
          fullName: '',
          phone: '',
          whatsapp: '',
          email: '',
          policyNumber: '',
          correspondence: '',
          lawyers: '',
          claimDetails: '',
        });
        setUploadedFile(null);
        setPolicyFile(null);
        // Reset file inputs
        const correspondenceFileInput = document.getElementById('correspondenceFile') as HTMLInputElement;
        if (correspondenceFileInput) correspondenceFileInput.value = '';
        const policyFileInput = document.getElementById('policyFile') as HTMLInputElement;
        if (policyFileInput) policyFileInput.value = '';

        // Clear any previous messages and show success dialog
        setSubmissionStatus('idle');
        setSubmissionMessage(null);
        setShowSuccessDialog(true);
      } else {
        throw new Error(`Failed to send email: ${response.text}`);
      }
    } catch (error: any) {
      console.error('Submission error details:', {
        message: error.message,
        text: error.text,
        status: error.status,
        error
      });
      setSubmissionStatus('error');
      setSubmissionMessage(`Failed to submit your case: ${error.message || 'Please try again later.'}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    } else {
      setUploadedFile(null);
    }
  }

  const handlePolicyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPolicyFile(e.target.files[0]);
    } else {
      setPolicyFile(null);
    }
  }

  return (
    <main className="pt-20">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <SuccessDialog
          message="Your case has been submitted successfully! We will contact you within 24 hours."
          onClose={() => setShowSuccessDialog(false)}
        />
      )}

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-primary/5 via-accent-teal/5 to-primary/5">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Contacts.png"
            alt="BIMA-AID Contact"
            fill
            className="object-cover brightness-50"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Fight Back? Start Here.
              </h1>
              <p className="text-xl text-white/90 mb-8">
                We don't waste time—and we don't waste yours.
                If your insurer has let you down, we want to hear from you.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-primary mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPinIcon className="w-6 h-6 text-accent-teal mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Office</h3>
                      <p className="text-gray-600">288 Milimani</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <PhoneIcon className="w-6 h-6 text-accent-teal mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                      <p className="text-gray-600">+254 111 689 543</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <EnvelopeIcon className="w-6 h-6 text-accent-teal mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info@bima-aid.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <GlobeAltIcon className="w-6 h-6 text-accent-teal mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Website</h3>
                      <p className="text-gray-600">www.bima-aid.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">Tell Us Your Story</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name (as it appears on the policy)
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      id="policyNumber"
                      name="policyNumber"
                      required
                      value={formData.policyNumber}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="correspondence" className="block text-sm font-medium text-gray-700 mb-1">
                      Correspondence with Insurer
                    </label>
                    <textarea
                      id="correspondence"
                      name="correspondence"
                      rows={3}
                      value={formData.correspondence}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="correspondenceFile" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Correspondence File (Optional)
                    </label>
                    <input
                      type="file"
                      id="correspondenceFile"
                      name="correspondenceFile"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-teal file:text-white hover:file:bg-accent-teal/90"
                      onChange={handleFileChange}
                    />
                    {uploadedFile && <p className="mt-2 text-sm text-gray-600">Selected file: {uploadedFile.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="lawyers" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Policy document/ Claim form if available
                    </label>
                    <input
                      type="file"
                      id="policyFile"
                      name="policyFile"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-teal file:text-white hover:file:bg-accent-teal/90"
                      onChange={handlePolicyFileChange}
                    />
                    {policyFile && <p className="mt-2 text-sm text-gray-600">Selected file: {policyFile.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="claimDetails" className="block text-sm font-medium text-gray-700 mb-1">
                      Why do you believe your claim is valid?
                    </label>
                    <textarea
                      id="claimDetails"
                      name="claimDetails"
                      required
                      rows={4}
                      value={formData.claimDetails}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-primary to-accent-teal text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Your Case'}
                  </button>

                  {submissionStatus !== 'idle' && submissionStatus !== 'loading' && (
                    <div className={`mt-4 text-center text-sm ${submissionStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {submissionMessage}
                    </div>
                  )}
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-teal/20 mb-4">
                  <ClockIcon className="w-6 h-6 text-accent-teal" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">What Happens Next?</h2>
                <p className="text-gray-600">
                  You'll hear from us within 24 hours.
                  If we can assist, we'll explain the next steps.
                  If we can't, we'll tell you immediately—no runaround, no excuses.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start space-x-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Note</h3>
                    <p className="text-gray-600">
                      To ensure faster response times and efficient handling of cases, we do not take phone calls at the initial stage.
                      All first contact is handled via WhatsApp or email—powered by AI and supported by real professionals.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-20 bg-primary text-white mb-20">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white mb-6">BIMA-AID</h2>
            <p className="text-xl text-white/90">Smart. Relentless. On Your Side.</p>
          </AnimatedSection>
        </div>
      </section>
    </main>
  )
} 