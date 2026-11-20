// Datos de contacto y helpers de WhatsApp (TODO confirmar con cliente: número por sede y horarios)
export const WA = { principal: '584243546663', secundario: '584243069546' };
export const IG = 'https://www.instagram.com/ferrenergia2020/';
export const CREDITO = 'https://aguilarzrw.github.io/portafolio-web/';

export const SEDES = {
  'San Jacinto': { wa: WA.principal, tel: '0424-354-6663', maps: 'https://www.google.com/maps/search/?api=1&query=San+Jacinto+Maracay+Aragua+Venezuela' },
  'Camaguán': { wa: WA.secundario, tel: '0424-306-9546', maps: 'https://www.google.com/maps/search/?api=1&query=Camagu%C3%A1n+Gu%C3%A1rico+Venezuela' },
};

export const waLink = (msg, numero = WA.principal) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;

export const precio = (n) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const kvaTxt = (n) => String(n).replace('.', ',');

export const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
