(() => {
  const botState = {
    isRunning: false,
    tradingCost: 10,
    currency: '$',
    telegramUsername: '@Moro_cco',
    overlayPosition: { top: '20px', left: null, right: '20px' },
    iconPosition: {},
    width: '160px',   // تكبير العرض
    height: '240px'   // تكبير الارتفاع
  };

  function createTradingBotOverlay() {
    // clean up
    document.getElementById('trading-bot-overlay')?.remove();
    document.getElementById('trading-bot-min-icon')?.remove();

    // build overlay
    const overlay = document.createElement('div');
    overlay.id = 'trading-bot-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: botState.overlayPosition.top,
      right: botState.overlayPosition.right,
      left: botState.overlayPosition.left,
      width: botState.width,
      height: botState.height,
      background: 'linear-gradient(145deg, #1e272e, #2f3640)',
      border: '2px solid #00a8ff',
      borderRadius: '12px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      userSelect: 'none',
      cursor: 'move',
      touchAction: 'none',
      boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
    });

    // header
    const header = document.createElement('div');
    Object.assign(header.style, {
      width: '100%', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '8px'
    });
    const title = document.createElement('div');
    title.textContent = '🚀 VIP BOT';
    Object.assign(title.style, {
      fontWeight: 'bold', color: '#fbc531', fontSize: '16px'
    });
    const minimize = document.createElement('div');
    minimize.textContent = '–';
    minimize.title = 'Minimize';
    minimize.classList.add('trading-bot-button');
    Object.assign(minimize.style, {
      width: '22px', height: '22px',
      lineHeight: '20px', textAlign: 'center',
      backgroundColor: '#00a8ff', borderRadius: '5px',
      cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
    });
    minimize.addEventListener('click', e => {
      e.stopPropagation();
      const rect = overlay.getBoundingClientRect();
      botState.iconPosition = {
        top: rect.top + 'px',
        left: rect.left + 'px'
      };
      botState.width = overlay.style.width;
      botState.height = overlay.style.height;
      botState.overlayPosition.top = overlay.style.top;
      botState.overlayPosition.left = overlay.style.left;
      botState.overlayPosition.right = 'auto';
      overlay.style.display = 'none';
      showMinimizedIcon(botState.iconPosition);
    });
    header.append(title, minimize);
    overlay.appendChild(header);

    // Telegram row
    const tgWrap = document.createElement('div');
    Object.assign(tgWrap.style, {
      width: '100%', display: 'flex',
      justifyContent: 'center', alignItems: 'center',
      marginBottom: '8px', gap: '8px'
    });
    const tgIcon = document.createElement('span');
    tgIcon.textContent = '📩';
    tgIcon.style.fontSize = '18px';
    const tgUser = document.createElement('div');
    tgUser.textContent = botState.telegramUsername;
    Object.assign(tgUser.style, {
      fontSize: '18px', color: '#00a8ff', fontWeight: 'bold'
    });
    tgWrap.append(tgIcon, tgUser);
    overlay.appendChild(tgWrap);

    // cost & currency
    const costSec = document.createElement('div');
    costSec.style.width = '100%';
    costSec.style.marginBottom = '8px';
    const costLabel = document.createElement('div');
    costLabel.textContent = '💵 Trading Cost:';
    costLabel.style.fontSize = '12px';
    costLabel.style.marginBottom = '4px';
    const inputWrap = document.createElement('div');
    inputWrap.style.display = 'flex';
    const costInput = document.createElement('input');
    costInput.type = 'number';
    costInput.value = botState.tradingCost;
    costInput.min = '1';
    Object.assign(costInput.style, {
      width: '70%', backgroundColor: '#2d3436',
      border: '1px solid #00a8ff', borderRadius: '6px 0 0 6px',
      color: 'white', padding: '4px 6px', fontSize: '14px'
    });
    costInput.addEventListener('change', () => {
      botState.tradingCost = parseFloat(costInput.value) || botState.tradingCost;
    });
    const currencySelect = document.createElement('select');
    Object.assign(currencySelect.style, {
      width: '30%', backgroundColor: '#2d3436',
      border: '1px solid #00a8ff', borderLeft: 'none',
      borderRadius: '0 6px 6px 0', color: 'white',
      padding: '4px 6px', fontSize: '14px'
    });
    ['$', '€', '£', '¥'].forEach(c => {
      const o = document.createElement('option');
      o.value = c; o.textContent = c;
      if (c === botState.currency) o.selected = true;
      currencySelect.appendChild(o);
    });
    currencySelect.addEventListener('change', () => {
      botState.currency = currencySelect.value;
    });
    inputWrap.append(costInput, currencySelect);
    costSec.append(costLabel, inputWrap);
    overlay.appendChild(costSec);

    // buttons
    const btnWrap = document.createElement('div');
    Object.assign(btnWrap.style, {
      display: 'flex', flexDirection: 'column',
      width: '100%', gap: '8px'
    });

    const startBtn = createButton('▶ Start', '#44bd32', 'Start bot');
    // restore start/stop state:
    if (botState.isRunning) {
      startBtn.dataset.state = 'on';
      startBtn.textContent = '⏹ Stop';
      startBtn.style.backgroundColor = '#e84118';
    } else {
      startBtn.dataset.state = 'off';
      startBtn.textContent = '▶ Start';
      startBtn.style.backgroundColor = '#44bd32';
    }
    startBtn.addEventListener('click', () => {
      if (startBtn.dataset.state === 'off') {
        startBtn.dataset.state = 'on';
        startBtn.textContent = '⏹ Stop';
        startBtn.style.backgroundColor = '#e84118';
        botState.isRunning = true;
      } else {
        startBtn.dataset.state = 'off';
        startBtn.textContent = '▶ Start';
        startBtn.style.backgroundColor = '#44bd32';
        botState.isRunning = false;
      }
    });

    const closeBtn = createButton('✖ Close', '#e84118', 'Close overlay');
    closeBtn.addEventListener('click', () => {
      overlay.remove();
      document.getElementById('trading-bot-min-icon')?.remove();
    });

    btnWrap.append(startBtn, closeBtn);
    overlay.appendChild(btnWrap);

    // resize handle
    const resizeHandle = document.createElement('div');
    Object.assign(resizeHandle.style, {
      position: 'absolute', width: '14px', height: '14px',
      bottom: '0', right: '0', cursor: 'nwse-resize',
      backgroundColor: '#00a8ff', borderRadius: '4px'
    });
    overlay.appendChild(resizeHandle);

    makeDraggable(overlay, (t, l) => {
      botState.overlayPosition.top = t;
      botState.overlayPosition.left = l;
      botState.overlayPosition.right = 'auto';
    });
    makeResizable(overlay, resizeHandle);

    document.body.appendChild(overlay);
  }

  function showMinimizedIcon(pos) {
    document.getElementById('trading-bot-min-icon')?.remove();
    const icon = document.createElement('div');
    icon.id = 'trading-bot-min-icon';
    Object.assign(icon.style, {
      position: 'fixed',
      top: pos.top || '20px',
      left: pos.left || 'auto',
      right: pos.left ? 'auto' : '20px',
      width: '70px', height: '70px',
      backgroundColor: 'rgba(30,30,30,0.9)',
      border: '2px solid #00a8ff',
      borderRadius: '12px', zIndex: 9999,
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', cursor: 'move', touchAction: 'none'
    });

    const img = document.createElement('img');
    img.src = 'https://i.ibb.co/ZRKTn2zy/photo.jpg';
    Object.assign(img.style, {
      width: '100%', height: '100%',
      objectFit: 'cover', borderRadius: '12px',
      pointerEvents: 'none'
    });
    icon.appendChild(img);

    const openOverlay = e => {
      e.preventDefault();
      icon.remove();
      createTradingBotOverlay();
    };
    icon.addEventListener('click', openOverlay);
    icon.addEventListener('touchend', openOverlay, { passive: false });

    makeDraggable(icon);
    document.body.appendChild(icon);
  }

  function createButton(text, color, tip) {
    const btn = document.createElement('div');
    btn.classList.add('trading-bot-button');
    btn.textContent = text;
    btn.title = tip;
    Object.assign(btn.style, {
      width: '100%', padding: '8px',
      backgroundColor: color, borderRadius: '6px',
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', cursor: 'pointer',
      transition: 'transform 0.1s, background-color 0.2s',
      fontSize: '14px', fontWeight: 'bold'
    });
    btn.addEventListener('mouseover', () => btn.style.transform = 'scale(1.05)');
    btn.addEventListener('mouseout',  () => btn.style.transform = 'scale(1)');
    return btn;
  }

  function makeDraggable(el, cb) {
    let startX, startY;
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      if (['INPUT','SELECT'].includes(e.target.tagName) ||
          e.target.closest('.trading-bot-button')) return;
      e.preventDefault();
      const pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX; startY = pt.clientY;
      const moveEvt = e.touches ? 'touchmove' : 'mousemove';
      const endEvt  = e.touches ? 'touchend'  : 'mouseup';
      document.addEventListener(moveEvt, drag, { passive: false });
      document.addEventListener(endEvt, endDrag,   { once: true });
    }

    function drag(e) {
      e.preventDefault();
      const pt = e.touches ? e.touches[0] : e;
      const dx = pt.clientX - startX, dy = pt.clientY - startY;
      startX = pt.clientX; startY = pt.clientY;
      el.style.top  = el.offsetTop  + dy + 'px';
      el.style.left = el.offsetLeft + dx + 'px';
      el.style.right = 'auto';
      cb?.(el.style.top, el.style.left);
    }

    function endDrag() {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
    }
  }

  function makeResizable(el, handle) {
    let w0, h0, x0, y0;
    handle.addEventListener('mousedown', init);
    handle.addEventListener('touchstart', init, { passive: false });

    function init(e) {
      e.preventDefault();
      const pt = e.touches ? e.touches[0] : e;
      x0 = pt.clientX; y0 = pt.clientY;
      w0 = el.offsetWidth; h0 = el.offsetHeight;
      const moveEvt = e.touches ? 'touchmove' : 'mousemove';
      const endEvt  = e.touches ? 'touchend'  : 'mouseup';
      document.addEventListener(moveEvt, resize, { passive: false });
      document.addEventListener(endEvt, stop,       { once: true });
    }

    function resize(e) {
      const pt = e.touches ? e.touches[0] : e;
      const newW = Math.max(140, w0 + (pt.clientX - x0));
      const newH = Math.max(140, h0 + (pt.clientY - y0));
      el.style.width  = newW + 'px';
      el.style.height = newH + 'px';
      botState.width  = el.style.width;
      botState.height = el.style.height;
    }

    function stop() {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('touchmove', resize);
    }
  }

  // launch
  createTradingBotOverlay();
})();
