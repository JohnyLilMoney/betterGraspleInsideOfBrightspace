// Brightspace Grasple Layout Extension v13
(function () {
  'use strict';

  let layoutApplied = false;

  function buildVerticalNav() {
    const nav = document.createElement('div');
    nav.id = 'grasple-vnav';

    // ── Logo ──
    const logoImg = document.querySelector(
      '.d2l-navigation-s-header-logo-area img, .d2l-labs-navigation-link-image-container img'
    );
    if (logoImg) {
      const logoWrap = document.createElement('div');
      logoWrap.id = 'grasple-vnav-logo';
      const a = document.createElement('a');
      a.href = logoImg.closest('a') ? logoImg.closest('a').href : '/d2l/home';
      const img = document.createElement('img');
      img.src = logoImg.src;
      img.alt = logoImg.alt || 'Home';
      a.appendChild(img);
      logoWrap.appendChild(a);
      nav.appendChild(logoWrap);
    }

    // ── Course name ──
    const titleEl = document.querySelector('.d2l-navigation-s-title-container a');
    if (titleEl) {
      const course = document.createElement('div');
      course.id = 'grasple-vnav-course';
      const a = document.createElement('a');
      a.href = titleEl.href;
      a.textContent = titleEl.textContent.trim();
      course.appendChild(a);
      nav.appendChild(course);
    }

    // ── Nav links ──
    const items = document.querySelectorAll(
      '.d2l-navigation-s-main-wrapper .d2l-navigation-s-item'
    );
    if (items.length) {
      const ul = document.createElement('ul');
      ul.id = 'grasple-vnav-links';
      items.forEach(item => {
        const directLink = item.querySelector(':scope > a.d2l-navigation-s-link');
        const groupBtn   = item.querySelector('button.d2l-navigation-s-group');
        const li = document.createElement('li');

        if (directLink) {
          const a = document.createElement('a');
          a.href = directLink.href;
          a.textContent = directLink.textContent.trim();
          if (location.href.includes('/content/') && a.textContent === 'Content') {
            a.classList.add('grasple-vnav-active');
          }
          li.appendChild(a);
        } else if (groupBtn) {
          // Move the entire nav item element directly to preserve internal event listeners
          li.className = 'grasple-vnav-dropdown-wrapper';
          li.appendChild(item);
        }
        if (li.firstChild) ul.appendChild(li);
      });
      nav.appendChild(ul);
    }

    // ── Bottom Section: Clean Icon Grid + Profile ──
    const headerRight = document.querySelector('.d2l-labs-navigation-header-right');

    if (headerRight) {
      const bottomSection = document.createElement('div');
      bottomSection.id = 'grasple-vnav-bottom-section';

      const iconGroup = document.createElement('div');
      iconGroup.id = 'grasple-icon-group';

      // helper
      const addIcon = el => {
        if (!el) return;

        const wrap = document.createElement('div');
        wrap.className = 'grasple-icon-item';

        wrap.appendChild(el);
        iconGroup.appendChild(wrap);
      };

      // 1. Course selector icon
      const courseIcon = headerRight.querySelector(
        '.d2l-navigation-s-course-menu d2l-labs-navigation-dropdown-button-icon'
      );
      addIcon(courseIcon);

      // 2. Notification icons (3 separate icons)
      const notificationIcons = headerRight.querySelectorAll(
        '.d2l-navigation-s-notification d2l-labs-navigation-dropdown-button-icon'
      );

      notificationIcons.forEach(addIcon);

      // 3. Admin gear icon
      const adminIcon = headerRight.querySelector(
        '.d2l-navigation-s-admin-menu d2l-labs-navigation-dropdown-button-icon'
      );
      addIcon(adminIcon);

      // PROFILE
      const personalMenu = headerRight.querySelector(
        '.d2l-navigation-s-personal-menu'
      );

      if (iconGroup.children.length) {
        bottomSection.appendChild(iconGroup);
      }

      if (personalMenu) {
        const profileWrap = document.createElement('div');
        profileWrap.id = 'grasple-profile-wrap';

        profileWrap.appendChild(personalMenu);

        bottomSection.appendChild(profileWrap);
      }

      nav.appendChild(bottomSection);
    }
    return nav;
  }

  function applyLayout() {
    if (layoutApplied) return;
    if (document.getElementById('grasple-layout-wrapper')) return;

    const contentView = document.getElementById('ContentView');
    const mainPadding = document.querySelector('.d2l-page-main-padding');
    const headerEl    = document.querySelector('header');

    if (!contentView || !mainPadding || !headerEl) return;
    layoutApplied = true;

    // ── Right column pieces ──
    const pageHeader = document.querySelector('.d2l-page-header');

    let tabsWrapper = null;
    const d2lTabs = mainPadding.querySelector('d2l-tabs');
    if (d2lTabs) {
      let el = d2lTabs;
      while (el.parentElement && el.parentElement !== mainPadding) el = el.parentElement;
      tabsWrapper = el;
    }

    let bottomNav = null;
    for (const child of Array.from(mainPadding.children)) {
      if (child === pageHeader || child === contentView || child === tabsWrapper) continue;
      if (child.querySelector && child.querySelector('.d2l-iterator')) {
        bottomNav = child; break;
      }
      if (typeof child.className === 'string' && child.className.match(/d2l_1_3[12]_/)) {
        bottomNav = child; break;
      }
    }

    const statusEl = document.getElementById('StatusPlaceholder');
    let statusParent = statusEl;
    if (statusEl) {
      let el = statusEl;
      while (el.parentElement && el.parentElement !== mainPadding &&
             el.parentElement !== document.body) el = el.parentElement;
      statusParent = el;
    }

    // ── Build wrapper ──
    const wrapper = document.createElement('div');
    wrapper.id = 'grasple-layout-wrapper';

    const colLeft  = document.createElement('div');
    colLeft.id = 'grasple-col-left';
    colLeft.className = 'grasple-col';

    const div1 = document.createElement('div');
    div1.className = 'grasple-divider';
    div1.dataset.divider = '1';

    const colMid = document.createElement('div');
    colMid.id = 'grasple-col-mid';
    colMid.className = 'grasple-col';

    const div2 = document.createElement('div');
    div2.className = 'grasple-divider';
    div2.dataset.divider = '2';

    const colRight = document.createElement('div');
    colRight.id = 'grasple-col-right';
    colRight.className = 'grasple-col';

    colLeft.appendChild(buildVerticalNav());
    colMid.appendChild(contentView);

    if (pageHeader)  colRight.appendChild(pageHeader);
    if (tabsWrapper) colRight.appendChild(tabsWrapper);
    if (bottomNav)   colRight.appendChild(bottomNav);
    if (statusParent && statusParent !== bottomNav && statusParent !== tabsWrapper) {
      colRight.appendChild(statusParent);
    }

    wrapper.appendChild(colLeft);
    wrapper.appendChild(div1);
    wrapper.appendChild(colMid);
    wrapper.appendChild(div2);
    wrapper.appendChild(colRight);

    document.body.insertBefore(wrapper, document.body.firstChild);

    headerEl.style.display = 'none';
    const pageMain = document.querySelector('.d2l-page-main[role="main"]');
    if (pageMain) pageMain.style.display = 'none';
    const msgContainer = document.querySelector('.d2l-page-message-container');
    if (msgContainer) msgContainer.style.display = 'none';

    setupDividerDrag();
    setupIframeObserver();
    loadSavedLayout();
  }

  function forceLTIHeight() {
    const host = document.querySelector('#grasple-col-mid d2l-lti-launch');
    if (!host || !host.shadowRoot) return;

    // Make the host stretch to fill the column
    host.style.setProperty('display', 'flex', 'important');
    host.style.setProperty('flex-direction', 'column', 'important');
    host.style.setProperty('height', '100%', 'important');
    host.style.setProperty('max-height', 'none', 'important');
    host.removeAttribute('height');   // if present

    // The inner wrapper div is the first (and only) div child of the shadow root
    const innerDiv = host.shadowRoot.querySelector('div');
    if (innerDiv) {
      innerDiv.style.setProperty('display', 'flex', 'important');
      innerDiv.style.setProperty('flex-direction', 'column', 'important');
      innerDiv.style.setProperty('height', '100%', 'important');
      innerDiv.style.setProperty('max-height', 'none', 'important');
    }

    const iframe = host.shadowRoot.querySelector('iframe');
    if (iframe) {
      iframe.removeAttribute('height');                 // kill the hardcoded "800px"
      iframe.style.setProperty('height', '100%', 'important');
      iframe.style.setProperty('min-height', '100%', 'important');
      iframe.style.setProperty('max-height', 'none', 'important');
      iframe.style.setProperty('flex', '1 1 auto', 'important');
      iframe.style.setProperty('display', 'block', 'important');
      iframe.style.setProperty('width', '100%', 'important');
    }
  }

  function waitForLTILaunch() {
    const colMid = document.getElementById('grasple-col-mid');
    if (!colMid) return;

    // Check immediately in case it’s already there
    const host = colMid.querySelector('d2l-lti-launch');
    if (host && host.shadowRoot) {
      forceLTIHeight();
      return;
    }

    const observer = new MutationObserver(() => {
      const host = colMid.querySelector('d2l-lti-launch');
      if (host && host.shadowRoot) {
        forceLTIHeight();
        observer.disconnect();
      }
    });
    observer.observe(colMid, { childList: true, subtree: true });
  }
  waitForLTILaunch();
  setInterval(forceLTIHeight, 1000);

  // ── Helper functions for column sizing ──
  function setFixed(col, px) {
    col.style.setProperty('flex', `0 0 ${px}px`, 'important');
    col.style.setProperty('width', `${px}px`, 'important');
  }

  function setFlexible(col) {
    col.style.setProperty('flex', '1 1 0', 'important');
    col.style.setProperty('width', '', 'important');
    col.style.removeProperty('width');
  }

  function fixIframeSize() {
    const colMid = document.getElementById('grasple-col-mid');
    if (!colMid) return;
    const host = colMid.querySelector('d2l-lti-launch');
    if (!host || !host.shadowRoot) return;
    const iframe = host.shadowRoot.querySelector('iframe');
    if (iframe) {
      const midHeight = colMid.getBoundingClientRect().height;
      iframe.style.setProperty('height', `${midHeight}px`, 'important');
      iframe.style.setProperty('min-height', `${midHeight}px`, 'important');
    }
  }

  function setupIframeObserver() {
    const colMid = document.getElementById('grasple-col-mid');
    if (!colMid) return;

    const observer = new ResizeObserver(entries => {
      const midHeight = entries[0].contentRect.height;
      const host = colMid.querySelector('d2l-lti-launch');
      if (!host || !host.shadowRoot) return;

      const iframe = host.shadowRoot.querySelector('iframe');
      if (iframe) {
        // Force the exact pixel height on the iframe and its shadow ancestors
        let current = iframe;
        while (current && current !== host) {
          current.style.setProperty('height', `${midHeight}px`, 'important');
          current.style.setProperty('min-height', `${midHeight}px`, 'important');
          current.style.setProperty('max-height', `${midHeight}px`, 'important');
          current = current.parentElement;
        }
        // Also set the host itself if you want pixel-perfect control
        host.style.setProperty('height', `${midHeight}px`, 'important');
      }
    });

    observer.observe(colMid);
  }

  function setupDividerDrag() {
    const wrapper  = document.getElementById('grasple-layout-wrapper');
    window.colLeft  = document.getElementById('grasple-col-left');
    window.colMid   = document.getElementById('grasple-col-mid');
    window.colRight = document.getElementById('grasple-col-right');
    if (!wrapper) return;

    const MIN_LEFT  = 60;
    const MIN_RIGHT = 100;
    const MIN_MID   = 100;

    document.querySelectorAll('.grasple-divider').forEach(divider => {
      let startX, sL, sM, sR;

      divider.addEventListener('pointerdown', e => {
        e.preventDefault();
        divider.setPointerCapture(e.pointerId);
        startX = e.clientX;
        sL = colLeft.getBoundingClientRect().width;
        sM = colMid.getBoundingClientRect().width;
        sR = colRight.getBoundingClientRect().width;
        divider.classList.add('dragging');
      });

      divider.addEventListener('pointermove', e => {
        if (!divider.hasPointerCapture(e.pointerId)) return;
        const dx = e.clientX - startX;

        if (divider.dataset.divider === '1') {
          const newL = Math.max(MIN_LEFT, sL + dx);
          const remaining = sL + sM - newL;
          if (remaining >= MIN_MID) {
            setFixed(colLeft, newL);
            setFlexible(colMid);
            fixIframeSize();
          }
        } else {
          const newR = Math.max(MIN_RIGHT, sR - dx);
          const remaining = sM + sR - newR;
          if (remaining >= MIN_MID) {
            setFlexible(colMid);
            setFixed(colRight, newR);
            fixIframeSize();
          }
        }
      });

      divider.addEventListener('pointerup', e => {
        divider.releasePointerCapture(e.pointerId);
        divider.classList.remove('dragging');

        // Save both side widths to Chrome storage
        chrome.storage.local.set({
          grasple_left_width: colLeft.getBoundingClientRect().width,
          grasple_right_width: colRight.getBoundingClientRect().width
        });
      });
    });
  }

  function loadSavedLayout() {
    const colLeft  = document.getElementById('grasple-col-left');
    const colMid   = document.getElementById('grasple-col-mid');
    const colRight = document.getElementById('grasple-col-right');
    if (!colLeft || !colMid || !colRight) return;

    chrome.storage.local.get(['grasple_left_width', 'grasple_right_width'], (result) => {
      if (result.grasple_left_width) {
        setFixed(colLeft, result.grasple_left_width);
      }
      if (result.grasple_right_width) {
        setFixed(colRight, result.grasple_right_width);
      }
      // Always keep the middle column flexible
      setFlexible(colMid);

      // Delay to let the flexbox settle, then fix the iframe height
      setTimeout(() => {
        fixIframeSize();
      }, 100);
    });
  }


  function killBrightspaceIframeHeights() {
    const iframes = document.querySelectorAll('#grasple-col-mid iframe');

    iframes.forEach(iframe => {
      iframe.removeAttribute('height');
      iframe.style.height = '100%';
      iframe.style.minHeight = '0px';
      iframe.style.maxHeight = 'none';
    });

    const lti = document.querySelector('d2l-lti-launch');
    if (lti) {
      lti.removeAttribute('style'); // IMPORTANT: Brightspace often injects inline height here
      lti.style.height = '100%';
      lti.style.display = 'flex';
      lti.style.flex = '1 1 auto';
    }
  }

  function waitAndApply() {
    const ready = () =>
      document.getElementById('ContentView') &&
      document.querySelector('.d2l-page-main-padding') &&
      document.querySelector('.d2l-navigation-s-main-wrapper');
    if (ready()) { setTimeout(applyLayout, 400); return; }
    const obs = new MutationObserver(() => {
      if (ready()) { obs.disconnect(); setTimeout(applyLayout, 400); }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => { obs.disconnect(); applyLayout(); }, 12000);
  }

  window.addEventListener('resize', () => { if (layoutApplied) fixIframeSize(); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitAndApply);
  } else {
    waitAndApply();
  }
})();