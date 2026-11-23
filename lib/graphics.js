function getItemGraphic(name) {
  name = (name || '').toLowerCase();

  /* Wallet */
  if (name.includes('wallet')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="3" y="8" width="30" height="20" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        <path d="M3 13 L33 13" stroke="#334155" stroke-width="1.5"/>
        <rect x="20" y="14" width="13" height="8" rx="2" fill="#334155" stroke="#475569" stroke-width="1"/>
        <circle cx="23.5" cy="18" r="1.5" fill="#fbbf24"/>
      </svg>`;
  }

  /* ID Card */
  if (name.includes('id') || name.includes('card')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="3" y="7" width="30" height="22" rx="3" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
        <rect x="3" y="7" width="30" height="6" fill="#0284c7"/>
        <rect x="6" y="16" width="7" height="9" rx="1.5" fill="#93c5fd"/>
        <circle cx="9.5" cy="19.5" r="2" fill="#1e3a8a"/>
        <rect x="16" y="16" width="14" height="2" rx="1" fill="#475569"/>
        <rect x="16" y="20" width="10" height="2" rx="1" fill="#94a3b8"/>
        <rect x="16" y="24" width="7" height="1.5" rx="0.75" fill="#cbd5e1"/>
      </svg>`;
  }

  /* Headphones */
  if (name.includes('headphone') || name.includes('earphone')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <path d="M7 19 C7 11 11.5 6 18 6 C24.5 6 29 11 29 19" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <rect x="4.5" y="17" width="6" height="12" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="25.5" y="17" width="6" height="12" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
      </svg>`;
  }

  /* Book */
  if (name.includes('book') || name.includes('math') || name.includes('textbook')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="7" y="5" width="22" height="26" rx="3" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>
        <rect x="7" y="5" width="4.5" height="26" rx="1" fill="#92400e"/>
        <rect x="14" y="10" width="12" height="5" rx="1" fill="#fef3c7"/>
        <path d="M17 18 L23 18 M20 15 L20 21" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
  }

  /* Watch */
  if (name.includes('watch') || name.includes('clock')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="14.5" y="2" width="7" height="32" rx="2" fill="#64748b"/>
        <circle cx="18" cy="18" r="9" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
        <circle cx="18" cy="18" r="6.5" fill="#ffffff"/>
        <path d="M18 13.5 L18 18 L21.5 18" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
  }

  /* Water Bottle */
  if (name.includes('bottle') || name.includes('water')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="15" y="3" width="6" height="5" rx="1.5" fill="#0f766e"/>
        <rect x="12" y="8" width="12" height="24" rx="4" fill="#06b6d4" stroke="#0891b2" stroke-width="1.5"/>
        <rect x="12" y="15" width="12" height="8" fill="#0891b2" opacity="0.3"/>
        <path d="M14 11 L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
  }

  /* Key */
  if (name.includes('key')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <circle cx="14" cy="13" r="5.5" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="14" cy="13" r="2.5" fill="#ffffff"/>
        <path d="M17.5 16.5 L27 26 L24.5 28.5 M22 23 L25.5 22 M24.5 25.5 L28 24.5" stroke="#b45309" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
  }

  /* Umbrella */
  if (name.includes('umbrella')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <path d="M4 19 C4 11 10 6 18 6 C26 6 32 11 32 19 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="18" y1="6" x2="18" y2="27" stroke="#475569" stroke-width="2"/>
        <path d="M18 27 C18 29.5 16 31 14 29" stroke="#475569" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>`;
  }

  /* Power Bank / Phone */
  if (name.includes('power') || name.includes('battery') || name.includes('phone') || name.includes('mobile') || name.includes('samsung') || name.includes('redmi')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="9" y="5" width="18" height="26" rx="3.5" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        <circle cx="13" cy="10" r="1.2" fill="#22c55e"/>
        <circle cx="16.5" cy="10" r="1.2" fill="#22c55e"/>
        <circle cx="20" cy="10" r="1.2" fill="#22c55e"/>
        <circle cx="23.5" cy="10" r="1.2" fill="#64748b"/>
      </svg>`;
  }

  /* Notebook */
  if (name.includes('notebook') || name.includes('khata')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="7" y="5" width="22" height="26" rx="3.5" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="#f8fafc"/>
        <circle cx="8.5" cy="14" r="1.5" fill="#f8fafc"/>
        <circle cx="8.5" cy="19.5" r="1.5" fill="#f8fafc"/>
        <circle cx="8.5" cy="25" r="1.5" fill="#f8fafc"/>
        <rect x="13" y="10" width="11" height="3" rx="1" fill="#ffffff" opacity="0.85"/>
      </svg>`;
  }

  /* Laptop */
  if (name.includes('laptop') || name.includes('computer')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="7" y="8" width="22" height="15" rx="2" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        <polygon points="4,27 32,27 30,23 6,23" fill="#64748b"/>
        <line x1="15" y1="25" x2="21" y2="25" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`;
  }

  /* Calculator */
  if (name.includes('calculator')) {
    return `
      <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
        <rect x="8" y="4" width="20" height="28" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="11" y="7" width="14" height="6" rx="1" fill="#86efac"/>
        <circle cx="13" cy="17" r="1.5" fill="#64748b"/>
        <circle cx="18" cy="17" r="1.5" fill="#64748b"/>
        <circle cx="23" cy="17" r="1.5" fill="#64748b"/>
        <circle cx="13" cy="22" r="1.5" fill="#64748b"/>
        <circle cx="18" cy="22" r="1.5" fill="#64748b"/>
        <circle cx="23" cy="22" r="1.5" fill="#64748b"/>
        <circle cx="13" cy="27" r="1.5" fill="#64748b"/>
        <circle cx="18" cy="27" r="1.5" fill="#64748b"/>
        <circle cx="23" cy="27" r="1.5" fill="#f59e0b"/>
      </svg>`;
  }

  /* Default */
  return `
    <svg class="w-7 h-7" viewBox="0 0 36 36" fill="none">
      <polygon points="18,4 32,11 18,18 4,11" fill="#0d9488"/>
      <polygon points="4,11 18,18 18,32 4,25" fill="#0f766e"/>
      <polygon points="32,11 18,18 18,32 32,25" fill="#115e59"/>
    </svg>`;
}

module.exports = { getItemGraphic };

