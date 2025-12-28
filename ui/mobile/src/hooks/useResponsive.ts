import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { getDeviceType, responsiveConfig, useResponsiveValue } from '../theme/theme';

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(getDeviceType());

  useEffect(() => {
    const onChange = () => {
      setDeviceType(getDeviceType());
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return deviceType;
};

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const onChange = ({ window }: { window: any }) => {
      setDimensions(window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return dimensions;
};

export const useResponsiveStyles = <T extends Record<string, any>>(
  styles: T
): T => {
  const deviceType = useDeviceType();
  
  return Object.keys(styles).reduce((acc, key) => {
    const styleKey = key as keyof T;
    const styleValue = styles[styleKey];
    if (typeof styleValue === 'object' && styleValue !== null && !Array.isArray(styleValue)) {
      const responsiveValue = (styleValue as any)[deviceType] || (styleValue as any).mobile || styleValue;
      acc[styleKey] = responsiveValue;
    } else {
      acc[styleKey] = styleValue;
    }
    return acc;
  }, {} as T);
};

export { useResponsiveValue, responsiveConfig };
