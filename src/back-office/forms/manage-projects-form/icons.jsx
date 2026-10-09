const base = { width: 16, height: 16, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const ArrowLeftIcon = () => (<svg {...base}><path d="M12 4 6 10l6 6" /></svg>);
export const ArrowRightIcon = () => (<svg {...base}><path d="m8 4 6 6-6 6" /></svg>);
export const CloseIcon = () => (<svg {...base}><path d="m5 5 10 10M15 5 5 15" /></svg>);
export const GridIcon = () => (<svg {...base}><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="11" y="3" width="6" height="6" rx="1" /><rect x="3" y="11" width="6" height="6" rx="1" /><rect x="11" y="11" width="6" height="6" rx="1" /></svg>);
export const ListIcon = () => (<svg {...base}><path d="M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01" /></svg>);
export const GripIcon = () => (<svg {...base}><path d="M7.5 5h.01M12.5 5h.01M7.5 10h.01M12.5 10h.01M7.5 15h.01M12.5 15h.01" strokeWidth="2.6" /></svg>);
export const StarIcon = ({ filled }) => (<svg {...base} fill={filled ? "currentColor" : "none"}><path d="m10 2.8 2.3 4.7 5.2.8-3.8 3.6.9 5.1L10 14.6l-4.6 2.4.9-5.1L2.5 8.3l5.2-.8z" /></svg>);
