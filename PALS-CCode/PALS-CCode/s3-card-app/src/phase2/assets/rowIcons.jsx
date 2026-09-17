// Vector data exported from Figma (node 3:2, ResultRow → Actions). Geometry is
// untouched; the design's literal #9A9A9A is swapped for currentColor so each
// button can inherit its wrapper's text color on hover, matching how
// src/assets/icons.jsx handles the S3 card's icons.

export function CopyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.8333 7.125H8.70833C7.83388 7.125 7.125 7.83388 7.125 8.70833V15.8333C7.125 16.7078 7.83388 17.4167 8.70833 17.4167H15.8333C16.7078 17.4167 17.4167 16.7078 17.4167 15.8333V8.70833C17.4167 7.83388 16.7078 7.125 15.8333 7.125Z"
        stroke="currentColor"
        strokeWidth="1.38542"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.95833 11.875H3.16667C2.74674 11.875 2.34401 11.7082 2.04708 11.4113C1.75015 11.1143 1.58333 10.7116 1.58333 10.2917V3.16667C1.58333 2.74674 1.75015 2.34401 2.04708 2.04708C2.34401 1.75015 2.74674 1.58333 3.16667 1.58333H10.2917C10.7116 1.58333 11.1143 1.75015 11.4113 2.04708C11.7082 2.34401 11.875 2.74674 11.875 3.16667V3.95833"
        stroke="currentColor"
        strokeWidth="1.38542"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.4667 3.64167C16.062 3.23475 15.5809 2.91183 15.0511 2.69148C14.5212 2.47113 13.953 2.3577 13.3792 2.3577C12.8053 2.3577 12.2371 2.47113 11.7072 2.69148C11.1774 2.91183 10.6963 3.23475 10.2917 3.64167L9.5 4.5125L8.70833 3.64167C7.88948 2.82281 6.77887 2.36278 5.62083 2.36278C4.4628 2.36278 3.35219 2.82281 2.53333 3.64167C1.71448 4.46052 1.25445 5.57113 1.25445 6.72917C1.25445 7.8872 1.71448 8.99781 2.53333 9.81667L3.325 10.6083L9.5 16.625L15.675 10.6083L16.4667 9.81667C16.8736 9.41203 17.1965 8.93095 17.4168 8.40108C17.6372 7.87122 17.7506 7.30302 17.7506 6.72917C17.7506 6.15531 17.6372 5.58711 17.4168 5.05725C17.1965 4.52738 16.8736 4.0463 16.4667 3.64167Z"
        stroke="currentColor"
        strokeWidth="1.38542"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CompareIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.375 4.75H16.625M2.375 9.5H16.625M2.375 14.25H16.625"
        stroke="currentColor"
        strokeWidth="1.38542"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.33333 6.33333C7.20778 6.33333 7.91667 5.62445 7.91667 4.75C7.91667 3.87555 7.20778 3.16667 6.33333 3.16667C5.45888 3.16667 4.75 3.87555 4.75 4.75C4.75 5.62445 5.45888 6.33333 6.33333 6.33333Z"
        fill="currentColor"
      />
      <path
        d="M12.6667 11.0833C13.5411 11.0833 14.25 10.3745 14.25 9.5C14.25 8.62555 13.5411 7.91667 12.6667 7.91667C11.7922 7.91667 11.0833 8.62555 11.0833 9.5C11.0833 10.3745 11.7922 11.0833 12.6667 11.0833Z"
        fill="currentColor"
      />
      <path
        d="M6.33333 15.8333C7.20778 15.8333 7.91667 15.1245 7.91667 14.25C7.91667 13.3755 7.20778 12.6667 6.33333 12.6667C5.45888 12.6667 4.75 13.3755 4.75 14.25C4.75 15.1245 5.45888 15.8333 6.33333 15.8333Z"
        fill="currentColor"
      />
    </svg>
  )
}
