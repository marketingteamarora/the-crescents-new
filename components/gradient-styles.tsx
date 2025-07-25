'use client';

import { useEffect } from 'react';

// Fixed gradient colors
const GRADIENT_FROM = '#D0AF21';
const GRADIENT_TO = '#9C182F';

export function GradientStyles() {
  useEffect(() => {
    // Ensure the styles are applied on the client side
    const style = document.createElement('style');
    style.textContent = `
      .gradient-bg {
        background: linear-gradient(135deg, ${GRADIENT_FROM}, ${GRADIENT_TO});
      }
      .gradient-text {
        background: linear-gradient(135deg, ${GRADIENT_FROM}, ${GRADIENT_TO});
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .gradient-border {
        border-image: linear-gradient(135deg, ${GRADIENT_FROM}, ${GRADIENT_TO}) 1;
      }
      .gradient-bg-hover:hover {
        background: linear-gradient(135deg, ${GRADIENT_FROM}, ${GRADIENT_TO});
      }
      .gradient-text-hover:hover {
        background: linear-gradient(135deg, ${GRADIENT_FROM}, ${GRADIENT_TO});
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
