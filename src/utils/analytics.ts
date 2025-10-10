// src/utils/analytics.ts

interface ReferralData {
  code: string;
  source: string;
  medium: string;
  campaign: string;
  timestamp: number;
}

export class AnalyticsTracker {
  private referralData: ReferralData | null = null;
  private isStorageAvailable: boolean = false;

  constructor() {
    this.isStorageAvailable = this.checkStorageAvailability();
    this.initializeTracking();
  }

  /**
   * Check if we're in a browser environment with working sessionStorage
   */
  private checkStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
        return false;
      }
      
      // Test if sessionStorage is actually writable (fails in Safari private mode)
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      // Storage is unavailable or throws (Safari private mode, SSR, etc.)
      return false;
    }
  }

  /**
   * Safely get item from sessionStorage
   */
  private getStorageItem(key: string): string | null {
    if (!this.isStorageAvailable) {
      return null;
    }
    
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn('Failed to read from sessionStorage:', e);
      return null;
    }
  }

  /**
   * Safely set item in sessionStorage
   */
  private setStorageItem(key: string, value: string): void {
    if (!this.isStorageAvailable) {
      return;
    }
    
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn('Failed to write to sessionStorage:', e);
      // Continue without storage - referral data will still work in memory
    }
  }

  /**
   * Initialize tracking on page load
   */
  private initializeTracking(): void {
    // Guard against SSR/non-browser environments
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Capture URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check for referral code
      const refCode = urlParams.get('ref') || urlParams.get('referral');
      
      // UTM parameters
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      if (refCode || utmSource) {
        this.referralData = {
          code: refCode || '',
          source: utmSource || 'direct',
          medium: utmMedium || 'none',
          campaign: utmCampaign || 'none',
          timestamp: Date.now()
        };

        // Store in sessionStorage for duration of session (if available)
        this.setStorageItem('polygon_referral', JSON.stringify(this.referralData));
        
        // Track the referral event
        this.trackEvent('referral_captured', {
          referral_code: refCode,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign
        });
      } else {
        // Try to retrieve existing referral data from session
        const stored = this.getStorageItem('polygon_referral');
        if (stored) {
          try {
            this.referralData = JSON.parse(stored);
          } catch (e) {
            console.warn('Failed to parse stored referral data:', e);
          }
        }
      }
    } catch (e) {
      console.warn('Analytics initialization failed:', e);
      // Continue without crashing - analytics is not critical
    }
  }

  /**
   * Track custom events to GA4
   */
  trackEvent(eventName: string, eventParams: Record<string, any> = {}): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams);
    }
  }

  /**
   * Track button clicks with referral data
   */
  trackCTAClick(ctaLocation: string): void {
    const params: Record<string, any> = {
      cta_location: ctaLocation,
      page_path: window.location.pathname
    };

    if (this.referralData) {
      params.referral_code = this.referralData.code;
      params.utm_source = this.referralData.source;
      params.utm_medium = this.referralData.medium;
      params.utm_campaign = this.referralData.campaign;
    }

    this.trackEvent('cta_click', params);
  }

  /**
   * Get app URL with referral parameters
   * @param defaultRef - Default referral code to use if no referral is captured
   */
  getAppURL(defaultRef?: string): string {
    const baseURL = 'https://app.polygon.ac';
    const params = new URLSearchParams();
    
    // Use captured referral data or default
    if (this.referralData) {
      if (this.referralData.code) {
        params.append('ref', this.referralData.code);
      }
      if (this.referralData.source) {
        params.append('utm_source', this.referralData.source);
      }
      if (this.referralData.medium) {
        params.append('utm_medium', this.referralData.medium);
      }
      if (this.referralData.campaign) {
        params.append('utm_campaign', this.referralData.campaign);
      }
    } else if (defaultRef) {
      // No captured referral, use default
      params.append('ref', defaultRef);
    }

    return params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
  }

  /**
   * Track page scroll depth
   */
  trackScrollDepth(): void {
    let maxScroll = 0;
    const trackingPoints = [25, 50, 75, 90, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        trackingPoints.forEach(point => {
          if (scrollPercent >= point && !tracked.has(point)) {
            tracked.add(point);
            this.trackEvent('scroll_depth', {
              percent: point,
              page_path: window.location.pathname
            });
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(): void {
    const startTime = Date.now();
    
    const trackTime = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('time_on_page', {
        seconds: timeSpent,
        page_path: window.location.pathname
      });
    };

    // Track before user leaves
    window.addEventListener('beforeunload', trackTime);
    
    // Also track every 30 seconds for users who stay long
    setInterval(() => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent % 30 === 0) {
        this.trackEvent('engagement_timer', {
          seconds: timeSpent
        });
      }
    }, 30000);
  }

  /**
   * Track outbound link clicks
   */
  trackOutboundLink(url: string, linkText: string): void {
    this.trackEvent('outbound_click', {
      link_url: url,
      link_text: linkText,
      link_domain: new URL(url).hostname
    });
  }
}

// Create singleton instance
export const analytics = new AnalyticsTracker();