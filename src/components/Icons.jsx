import React from "react";

function createIcon(props, path) {
  const { fill = "none", ...otherProps } = props;
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...otherProps}
    >
      <g
        fill={fill}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {path}
      </g>
    </svg>
  );
}

export function IconHome(props) {
  return createIcon(
    props,
    <>
      <path d="M4.5 10.5 12 4l7.5 6.5" />
      <path d="M7.5 10.5V19h9v-8.5" />
    </>
  );
}

export function IconSearch(props) {
  return createIcon(
    props,
    <>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m15.2 15.2 3.3 3.3" />
    </>
  );
}

export function IconTrips(props) {
  return createIcon(
    props,
    <>
      <rect x="5.5" y="7.5" width="13" height="10" rx="2" />
      <path d="M10 7.5v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
    </>
  );
}

export function IconProfile(props) {
  return createIcon(
    props,
    <>
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 18.5a5.5 5.5 0 0 1 11 0" />
    </>
  );
}

export function IconHeart(props) {
  return createIcon(
    props,
    <>
      <path d="M12.1 19.2 4.8 12c-1.7-1.7-1.7-4.5 0-6.2 1.7-1.7 4.5-1.7 6.2 0l1 1 1-1c1.7-1.7 4.5-1.7 6.2 0 1.7 1.7 1.7 4.5 0 6.2l-7.3 7.2Z" />
    </>
  );
}

export function IconUser(props) {
  return createIcon(
    props,
    <>
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 18.5a5.5 5.5 0 0 1 11 0" />
    </>
  );
}

export function IconBriefcase(props) {
  return createIcon(
    props,
    <>
      <rect x="4.5" y="8.5" width="15" height="10" rx="2" />
      <path d="M10 8.5v-1.5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1.5" />
      <path d="M4.5 12.5h15" />
    </>
  );
}

export function IconStar(props) {
  return createIcon(
    props,
    <path d="m12 3 2.5 5 5.5.5-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-.5Z" />
  );
}

export function IconCheck(props) {
  return createIcon(
    props,
    <path d="m5 12 5 5L20 7" />
  );
}

export function IconWifi(props) {
  return createIcon(
    props,
    <>
      <path d="M5 13a10 10 0 0 1 14 0" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </>
  );
}

export function IconStarFull(props) {
  return createIcon(
    { ...props, fill: "currentColor" },
    <path d="m12 3 2.5 5 5.5.5-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-.5Z" />
  );
}

export function IconCoffee(props) {
  return createIcon(
    props,
    <>
      <path d="M17 8h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" />
      <path d="M3 8h14v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8Z" />
      <path d="M6 2h0" />
      <path d="M10 2h0" />
      <path d="M14 2h0" />
    </>
  );
}

export function IconMapPin(props) {
  return createIcon(
    props,
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  );
}

export function IconCreditCard(props) {
  return createIcon(
    props,
    <>
      <rect x="4" y="6.5" width="16" height="11" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 14.5h3" />
    </>
  );
}

export function IconReceipt(props) {
  return createIcon(
    props,
    <>
      <path d="M8 4.5 7 5.5 6 4.5 5 5.5 4 4.5v15l2-1 2 1 2-1 2 1 2-1 2 1 2-1v-15l-1 1-1-1-1 1-1-1-1 1Z" />
      <path d="M9 9.5h6" />
      <path d="M9 12.5h4" />
    </>
  );
}

export function IconSettings(props) {
  return createIcon(
    props,
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M6.5 12a5.5 5.5 0 0 1 .1-1L5 9.5l1.2-2.1L8 7a5.6 5.6 0 0 1 1-1l.4-1.8h2.2L12 6a5.6 5.6 0 0 1 1 .9l1.9-.6 1.2 2.1L17.4 11a5.5 5.5 0 0 1 0 2l.7 1.5-1.2 2.1L15 16.9a5.6 5.6 0 0 1-1 .9l-.4 1.7h-2.2L11 17.8a5.6 5.6 0 0 1-1-.9l-1.8.6L7 15.4 7.6 14a5.5 5.5 0 0 1-.1-2Z" />
    </>
  );
}

export function IconBell(props) {
  return createIcon(
    props,
    <>
      <path d="M18 15.5H6l1-1.5V10a5 5 0 0 1 10 0v4Z" />
      <path d="M10 17.5a2 2 0 0 0 4 0" />
    </>
  );
}

export function IconEmail(props) {
  return createIcon(
    props,
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  );
}

export function IconMessage(props) {
  return createIcon(
    props,
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  );
}

export function IconGlobe(props) {
  return createIcon(
    props,
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5v14" />
      <path d="M7 9.5h10" />
      <path d="M7 14.5h10" />
    </>
  );
}

export function IconLock(props) {
  return createIcon(
    props,
    <>
      <rect x="6.5" y="10" width="11" height="9" rx="2" />
      <path d="M9.5 10V8.5a2.5 2.5 0 0 1 5 0V10" />
      <path d="M12 13.5v2" />
    </>
  );
}

export function IconShield(props) {
  return createIcon(
    props,
    <>
      <path d="M12 4.5 7 6.5v5.5c0 3 2.1 5.4 5 6.5 2.9-1.1 5-3.5 5-6.5V6.5Z" />
    </>
  );
}

export function IconFileText(props) {
  return createIcon(
    props,
    <>
      <path d="M8 4.5h6l3 3v11h-9Z" />
      <path d="M14 4.5v3h3" />
      <path d="M10 11h4" />
      <path d="M10 14h3" />
    </>
  );
}

export function IconLogout(props) {
  return createIcon(
    props,
    <>
      <path d="M10 6.5H7.5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2H10" />
      <path d="M14 8.5 17 12l-3 3.5" />
      <path d="M17 12H10" />
    </>
  );
}

export function IconEdit(props) {
  return createIcon(
    props,
    <>
      <path d="M7 17.5 9.5 17 17 9.5 14.5 7 7 14.5Z" />
      <path d="M13.5 7.5 16 10" />
      <path d="M7 20h10" />
    </>
  );
}

export function IconClose(props) {
  return createIcon(
    props,
    <>
      <path d="M17 7 7 17" />
      <path d="M7 7 17 17" />
    </>
  );
}

export function IconCheckCircle(props) {
  return createIcon(
    props,
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="m9.5 12.5 1.8 1.8 3.2-4.1" />
    </>
  );
}

export function IconBreakfast(props) {
  return createIcon(
    props,
    <>
      <rect x="5" y="6.5" width="10" height="6" rx="2" />
      <path d="M7 16.5h8" />
      <path d="M16 7.5h1.5a2 2 0 0 1 0 4H16" />
    </>
  );
}

export function IconPool(props) {
  return createIcon(
    props,
    <>
      <path d="M7 10.5c1 0 1.5-.8 2.5-.8s1.5.8 2.5.8 1.5-.8 2.5-.8 1.5.8 2.5.8" />
      <path d="M7 14.5c1 0 1.5-.8 2.5-.8s1.5.8 2.5.8 1.5-.8 2.5-.8 1.5.8 2.5.8" />
      <path d="M9 5.5 15 7" />
    </>
  );
}

export function IconArrowLeft(props) {
  return createIcon(
    props,
    <>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </>
  );
}

export function IconUsers(props) {
  return createIcon(
    props,
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  );
}

export function IconParking(props) {
  return createIcon(
    props,
    <>
      <rect x="6.5" y="4.5" width="11" height="15" rx="2" />
      <path d="M10 15.5v-7h3a2 2 0 0 1 0 4h-3" />
    </>
  );
}

export function IconChevronDown(props) {
  return createIcon(
    props,
    <>
      <path d="m7 9.5 5 5 5-5" />
    </>
  );
}

export function IconCalendar(props) {
  return createIcon(
    props,
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  );
}

export function IconPlane(props) {
  return createIcon(
    props,
    <>
      <path d="M2 12h20" />
      <path d="M13 2 9 12h4l4 10" />
    </>
  );
}

export function IconSmartphone(props) {
  return createIcon(
    props,
    <>
      <rect x="7" y="4" width="10" height="16" rx="2" />
      <path d="M12 17h.01" />
    </>
  );
}

export function IconMonitor(props) {
  return createIcon(
    props,
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </>
  );
}

export function IconClock(props) {
  return createIcon(
    props,
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  );
}
