Polygon_Accounts_Home_Page


# Added Analytics & Referral Tracking Setup Guide

## 1. Google Analytics 4 Setup

### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com)
2. Create new GA4 property for `polygon.ac`
3. Get your Measurement ID (format: `G-HCT7CL65JS`)

### Step 2: Add GA4 to Your Site

Update `index.html` by adding this in the `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HCT7CL65JS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true
  });
</script>
```

### Step 3: Configure Custom Events in GA4

In GA4, create these custom events:
- `cta_click` - Track button clicks
- `referral_captured` - When referral code is detected
- `scroll_depth` - Track user engagement
- `time_on_page` - Session duration tracking

## 2. Referral Code System

### URL Parameter Format

Your referral links will look like:
```
https://www.polygon.ac/?ref=FRIEND123
https://www.polygon.ac/?ref=ETH_DENVER&utm_source=twitter&utm_campaign=launch
```

### Supported Parameters
- `ref` or `referral` - Your referral code
- `utm_source` - Traffic source (twitter, discord, email)
- `utm_medium` - Medium type (social, email, banner)
- `utm_campaign` - Campaign name (launch, q4_promo)

## 3. Implementation Steps

### Install the Analytics Utility

1. Create `src/utils/analytics.ts` with the provided code
2. Import in your components:

```typescript
import { analytics } from '../utils/analytics';
```

### Update All CTA Buttons

Replace all `href="https://app.polygon.ac"` with:

```typescript
href={analytics.getAppURL()}
onClick={() => analytics.trackCTAClick('button_location')}
```

Button locations to track:
- `hero_primary` - Main hero button
- `hero_secondary` - Secondary hero CTAs
- `how_it_works` - Section CTAs
- `footer_cta` - Footer buttons
- `sticky_mobile` - Mobile sticky button

### Example Button Update:

```typescript
<a
  href={analytics.getAppURL()}
  onClick={() => analytics.trackCTAClick('footer_cta')}
  className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-purple-600 font-semibold rounded-xl text-lg transition-all duration-300"
>
  Start now
</a>
```

## 4. Cloudflare Setup (Optional but Recommended)

### Cloudflare Web Analytics
For privacy-focused, cookie-free analytics:

1. Go to Cloudflare Dashboard > Web Analytics
2. Add your site `polygon.ac`
3. Copy the beacon script
4. Add to `index.html`:

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
```

### Benefits of Cloudflare Analytics:
- No cookie consent needed
- Works with ad blockers
- Ultra-lightweight
- Real-time data
- Bot filtering

## 5. Testing Your Setup

### Test Referral Codes

1. Visit: `http://localhost:5173/?ref=TEST123`
2. Open DevTools Console
3. Check sessionStorage: `sessionStorage.getItem('polygon_referral')`
4. Click a CTA button
5. Verify parameters are passed to `app.polygon.ac`

### Test GA4 Events

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension
2. Enable debug mode
3. Click buttons and verify events fire
4. Check GA4 Realtime reports

## 6. Campaign URL Builder

Create trackable links for campaigns:

### Example Campaign URLs:

**Twitter Launch:**
```
https://www.polygon.ac/?ref=TWITTER_LAUNCH&utm_source=twitter&utm_medium=social&utm_campaign=oct_2025
```

**Email Campaign:**
```
https://www.polygon.ac/?ref=EMAIL_PROMO&utm_source=newsletter&utm_medium=email&utm_campaign=polyprize
```

**Influencer Partnership:**
```
https://www.polygon.ac/?ref=INFLUENCER_NAME&utm_source=youtube&utm_medium=video&utm_campaign=partnership
```

## 7. Dashboard Metrics to Track

### Key Metrics in GA4:
- Total page views
- Unique visitors
- Referral code distribution
- CTA click-through rates by location
- Average scroll depth
- Time on page
- Bounce rate by traffic source

### Custom Reports to Create:
1. **Referral Performance**: Group by `referral_code` dimension
2. **CTA Effectiveness**: Compare `cta_location` click rates
3. **Campaign ROI**: Track conversions by `utm_campaign`
4. **Traffic Sources**: UTM source/medium breakdown

## 8. Server-Side Tracking (Advanced)

For more accurate tracking without ad blockers:

### Cloudflare Workers Integration

```javascript
// Cloudflare Worker to log analytics
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Log referral
  if (url.searchParams.get('ref')) {
    await logToAnalytics({
      type: 'referral',
      code: url.searchParams.get('ref'),
      timestamp: Date.now(),
      userAgent: request.headers.get('user-agent')
    })
  }
  
  return fetch(request)
}
```

## 9. Privacy Compliance

### GDPR/CCPA Considerations:
- ✅ SessionStorage only (no persistent tracking)
- ✅ No PII collected
- ✅ Referral codes are campaign identifiers, not personal data
- ✅ User can clear session anytime
- ⚠️ Consider adding cookie banner if using GA4

### Minimal Cookie Banner:
```html
<div id="cookie-banner" style="position: fixed; bottom: 0; width: 100%; background: #000; color: #fff; padding: 1rem; text-align: center;">
  We use analytics to improve your experience. 
  <button onclick="acceptCookies()">Accept</button>
</div>
```

## 10. Monitoring & Optimization

### Weekly Checks:
- Review top referral codes
- Check CTA conversion rates
- Monitor bounce rates
- Analyze traffic sources

### Monthly Actions:
- A/B test CTA copy
- Optimize underperforming campaigns
- Create reports for stakeholders
- Adjust referral incentives

## 11. Integration with app.polygon.ac

### On app.polygon.ac Backend:

```javascript
// Capture referral on account creation
app.post('/api/account/create', async (req, res) => {
  const { email, referralCode } = req.body;
  
  await createAccount({
    email,
    referralCode,
    source: req.query.utm_source,
    campaign: req.query.utm_campaign
  });
  
  // Track conversion back to GA4
  await trackConversion(referralCode);
});
```

## 12. Quick Start Checklist

- [ ] Add GA4 tracking code to `index.html`
- [ ] Create `src/utils/analytics.ts` file
- [ ] Update all CTA buttons with tracking
- [ ] Test referral code flow locally
- [ ] Deploy to production
- [ ] Verify GA4 events in real-time
- [ ] Create campaign URLs
- [ ] Set up weekly monitoring
- [ ] Document for team

## Need Help?

Common issues:
- **Events not showing**: Check GA4 Measurement ID is correct
- **Referral codes lost**: Verify sessionStorage is accessible
- **App redirect fails**: Check CORS settings on app.polygon.ac
- **Ad blockers**: Consider Cloudflare Analytics as backup

---

**Pro Tip**: Start with GA4 + basic referral tracking, then add Cloudflare Analytics and server-side tracking as you scale!
