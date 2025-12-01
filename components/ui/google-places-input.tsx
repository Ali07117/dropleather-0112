/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface GooglePlacesInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function GooglePlacesInput({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  className,
  id
}: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  // const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          console.warn('Google Maps API key not found');
          return;
        }

        // Load Google Maps script if not already loaded
        if (!(window as any).google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            initAutocomplete();
          };
          
          document.head.appendChild(script);
        } else {
          initAutocomplete();
        }

        function initAutocomplete() {
          if (inputRef.current && !autocompleteRef.current && (window as any).google) {
            const google = (window as any).google;
            
            autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
              types: ['address'],
              fields: ['address_components', 'formatted_address']
            });

            autocompleteRef.current.addListener('place_changed', () => {
              const place = autocompleteRef.current?.getPlace();
              if (place?.address_components) {
                const addressData = extractAddressComponents(place.address_components);
                onChange(place.formatted_address || value);
                
                if (onPlaceSelect) {
                  onPlaceSelect(addressData);
                }
              }
            });

            // setIsLoaded(true);
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteRef.current && (window as any).google) {
        (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const extractAddressComponents = (components: any[]) => {
    const result = {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };

    for (const component of components) {
      const types = component.types;

      if (types.includes('street_number') || types.includes('route')) {
        result.address += (result.address ? ' ' : '') + component.long_name;
      }
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        result.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        result.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        result.zipCode = component.long_name;
      }
      if (types.includes('country')) {
        result.country = component.short_name;
      }
    }

    return result;
  };

  return (
    <Input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(className)}
      autoComplete="off"
    />
  );
}