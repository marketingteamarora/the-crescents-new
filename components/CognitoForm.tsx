'use client';

import { useState, useEffect } from 'react';

export default function CognitoForm() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 sm:my-12 px-3 sm:px-4 md:px-6">
      <div className="bg-white rounded-xl shadow-xl sm:shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#D0AF21] to-[#9C182F] px-4 sm:px-6 py-4 sm:py-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Get Platinum Access</h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1 sm:mt-2">Fill out the form below to get started</p>
        </div>
        
        <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] bg-gray-50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 max-w-xs mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 max-w-xs"></div>
              </div>
            </div>
          )}
          
          <iframe
            src="https://www.cognitoforms.com/f/Nq5wdJaqaEa9-yGGbQnXYg/407"
            style={{
              border: 'none',
              width: '100%',
              height: '100%',
              display: 'block',
              padding: '0',
              margin: '0',
              overflow: 'hidden',
              visibility: isLoading ? 'hidden' : 'visible',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            title="The Crescents Platinum Access Form"
            allow="payment"
            allowFullScreen
            className="cognito-form-frame"
            onLoad={handleIframeLoad}
            loading="eager"
          />
        </div>
      </div>
      
      <style jsx global>{`
        /* These styles will apply to the iframe content */
        .cognito-form-frame {
          padding: 0 16px !important;
        }
        
        /* Target the form container inside the iframe */
        .cognito-form-frame .cognito {
          padding: 0 12px !important;
          max-width: 100% !important;
        }
        
        /* Style the form header */
        .cognito-form-frame h2 {
          padding-left: 12px !important;
          padding-right: 12px !important;
          font-size: 1.25rem !important;
          margin-bottom: 0.75rem !important;
        }
        
        /* Style form fields and labels */
        .cognito-form-frame .c-forms-form {
          padding: 0 24px 24px 24px !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .cognito-form-frame .c-forms-form {
            padding: 0 16px 16px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
