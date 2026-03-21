import { useEffect } from 'react';

/**
 * AdBanner
 * Place this component inside any PUBLIC page to show Google AdSense ads.
 * DO NOT use on Dashboard, Analysis, or any protected/paid pages.
 *
 * Usage:
 *   import { AdBanner } from '../components/AdBanner';
 *   <AdBanner />
 */
export const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full my-6">
      <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-2">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7118739630977299"
        data-ad-slot="8305992979"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};