(function() {
  // 1. Find the script tag and extract the widget key
  const script = document.currentScript || (() => {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  if (!script) {
    console.error('Social Proof Widget: Script tag not found.');
    return;
  }

  const scriptUrl = new URL(script.src);
  const widgetKey = scriptUrl.searchParams.get('key');

  if (!widgetKey) {
    console.error('Social Proof Widget: Missing "key" parameter in script source.');
    return;
  }

  const origin = scriptUrl.origin;
  const configUrl = `${origin}/api/widgets/embed-config?key=${widgetKey}`;

  // Load Google Font 'Inter' dynamically for premium typography
  if (!document.getElementById('sp-font-link')) {
    const link = document.createElement('link');
    link.id = 'sp-font-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // 2. Fetch widget configurations and events
  fetch(configUrl)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.error) {
        console.error('Social Proof Widget Error:', data.error);
        return;
      }
      initWidget(data.config, data.events);
    })
    .catch(err => {
      console.error('Social Proof Widget failed to load:', err);
    });

  // 3. Initialize and render the widget
  function initWidget(config, events) {
    if (!events || events.length === 0) return;

    const {
      popup_text: template,
      theme_color: themeColor,
      position,
      delay,
      show_avatar: showAvatar
    } = config;

    // Inject styles
    injectStyles(themeColor, position);

    // Create Widget Container
    const container = document.createElement('div');
    container.id = 'sp-widget-container';
    container.className = `sp-position-${position}`;
    document.body.appendChild(container);

    let eventIndex = 0;
    let timeoutId = null;
    let isPaused = false;

    // Helper to format/interpolate the template
    function formatMessage(event) {
      return template
        .replace(/\{\{\s*name\s*\}\}/g, `<strong>${event.name}</strong>`)
        .replace(/\{\{\s*city\s*\}\}/g, `<strong>${event.city}</strong>`)
        .replace(/\{\{\s*product\s*\}\}/g, `<span class="sp-product-highlight">${event.product}</span>`);
    }

    // Function to render and show a notification card
    function showNotification() {
      if (isPaused) {
        // Retry shortly if paused
        timeoutId = setTimeout(showNotification, 1000);
        return;
      }

      // Remove existing card if any
      const existingCard = container.querySelector('.sp-card');
      if (existingCard) {
        existingCard.classList.remove('sp-animate-in');
        existingCard.classList.add('sp-animate-out');
        setTimeout(() => {
          existingCard.remove();
          renderNewCard();
        }, 400); // match fade-out animation duration
      } else {
        renderNewCard();
      }
    }

    function renderNewCard() {
      const event = events[eventIndex];
      const card = document.createElement('div');
      card.className = 'sp-card sp-animate-in';
      
      // Setup pause on hover
      card.addEventListener('mouseenter', () => { isPaused = true; });
      card.addEventListener('mouseleave', () => { isPaused = false; });

      // Build Avatar section
      let avatarHtml = '';
      if (showAvatar) {
        // Initial letter
        const initial = event.name ? event.name.charAt(0).toUpperCase() : 'U';
        avatarHtml = `
          <div class="sp-avatar-wrapper">
            <div class="sp-avatar">
              ${initial}
            </div>
            <div class="sp-verified-badge">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        ${avatarHtml}
        <div class="sp-content">
          <div class="sp-header">
            <span class="sp-header-badge">Verified Activity</span>
            <span class="sp-time">${event.time}</span>
          </div>
          <div class="sp-message">${formatMessage(event)}</div>
        </div>
        <button class="sp-close-btn" aria-label="Close social proof notification">&times;</button>
      `;

      // Close button handler
      card.querySelector('.sp-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('sp-animate-in');
        card.classList.add('sp-animate-out');
        setTimeout(() => {
          card.remove();
        }, 400);
        // Reschedule next notification after a full cycle
        clearTimeout(timeoutId);
        eventIndex = (eventIndex + 1) % events.length;
        timeoutId = setTimeout(showNotification, delay + 5000);
      });

      container.appendChild(card);

      // Cycle to the next event
      eventIndex = (eventIndex + 1) % events.length;

      // Keep visible for 5 seconds, then transition
      timeoutId = setTimeout(showNotification, 5000 + delay);
    }

    // Start the widget lifecycle
    timeoutId = setTimeout(showNotification, delay);
  }

  // 4. Inject CSS Styles
  function injectStyles(themeColor, position) {
    if (document.getElementById('sp-widget-styles')) return;

    // Determine translation offset based on position
    let slideInTranslate = 'translateY(100px)';
    let slideOutTranslate = 'translateY(150px)';
    if (position.startsWith('top')) {
      slideInTranslate = 'translateY(-100px)';
      slideOutTranslate = 'translateY(-150px)';
    }

    const css = `
      #sp-widget-container {
        position: fixed;
        z-index: 999999;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        box-sizing: border-box;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 360px;
        max-width: calc(100vw - 32px);
      }
      #sp-widget-container * {
        box-sizing: border-box;
      }
      
      /* Positions */
      .sp-position-bottom-left {
        bottom: 24px;
        left: 24px;
      }
      .sp-position-bottom-right {
        bottom: 24px;
        right: 24px;
      }
      .sp-position-top-left {
        top: 24px;
        left: 24px;
      }
      .sp-position-top-right {
        top: 24px;
        right: 24px;
      }

      /* Card Styling - Premium Glassmorphism */
      .sp-card {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.08), 
                    0 4px 12px -2px rgba(0, 0, 0, 0.03);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                    box-shadow 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .sp-card:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.12), 
                    0 8px 20px -4px rgba(0, 0, 0, 0.05);
      }

      /* Subtle line styling with Theme Color */
      .sp-card::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: ${themeColor};
      }

      /* Avatar with beautiful gradient */
      .sp-avatar-wrapper {
        position: relative;
        flex-shrink: 0;
      }
      
      .sp-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${themeColor}dd, ${themeColor});
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      /* Verified checkmark badge */
      .sp-verified-badge {
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 18px;
        height: 18px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .sp-verified-badge svg {
        width: 10px;
        height: 10px;
      }

      /* Content Area */
      .sp-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-right: 12px;
      }

      .sp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .sp-header-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: ${themeColor};
      }

      .sp-time {
        font-size: 10px;
        color: #8892b0;
        font-weight: 500;
      }

      .sp-message {
        font-size: 13px;
        color: #1e293b;
        line-height: 1.45;
        font-weight: 400;
      }
      
      .sp-message strong {
        color: #0f172a;
        font-weight: 600;
      }
      
      .sp-product-highlight {
        font-weight: 600;
        color: ${themeColor};
      }

      /* Close Button */
      .sp-close-btn {
        position: absolute;
        top: 10px;
        right: 12px;
        background: none;
        border: none;
        font-size: 18px;
        line-height: 1;
        color: #94a3b8;
        cursor: pointer;
        transition: color 0.2s ease;
        padding: 0;
        pointer-events: auto;
      }
      
      .sp-close-btn:hover {
        color: #475569;
      }

      /* Slide In & Out Animations */
      .sp-animate-in {
        animation: spSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }

      .sp-animate-out {
        animation: spSlideOut 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
      }

      @keyframes spSlideIn {
        from {
          opacity: 0;
          transform: ${slideInTranslate};
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes spSlideOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: ${slideOutTranslate};
        }
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        #sp-widget-container {
          width: calc(100vw - 24px);
          left: 12px !important;
          right: 12px !important;
        }
        
        .sp-position-top-left, .sp-position-top-right {
          top: 12px;
        }
        
        .sp-position-bottom-left, .sp-position-bottom-right {
          bottom: 12px;
        }
      }
    `;

    const styleTag = document.createElement('style');
    styleTag.id = 'sp-widget-styles';
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);
  }
})();
