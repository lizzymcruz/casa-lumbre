// Booking, accessibility and page wiring for Casa Lumbre. The shared booking markup in ./core.mjs
// reads `site.t[lang]` for its words and `site.href(lang, key)` for its links.
import { rooms } from '../data/rooms';
import { src } from '../data/photos';
import { UI } from './core.mjs';
import type { Lang } from '../i18n/ui';

export const paths = {
  es: { home: '/', rooms: '/habitaciones/', book: '/reservar/', privacy: '/privacidad/', legal: '/aviso-legal/', accessibility: '/accesibilidad/' },
  en: { home: '/en/', rooms: '/en/rooms/', book: '/en/book/', privacy: '/en/privacy/', legal: '/en/legal/', accessibility: '/en/accessibility/' },
} as const;
export type PageKey = keyof typeof paths.es;

const t = {
  es: {
    arrival: 'Llegada', departure: 'Salida', guestsLabel: 'Huéspedes', changeDates: 'Cambiar fechas', checkAvail: 'Ver disponibilidad',
    flowEyebrow: 'reserva directa · mejor tarifa', chooseRoom: 'Elige tu habitación', continue: 'Continuar', backRooms: 'Volver a las habitaciones',
    details: 'Tus datos', detailsLead: 'Pagas en la casa al llegar. No hace falta tarjeta ahora.', mainGuest: 'Huésped principal',
    first: 'Nombre', last: 'Apellidos', email: 'Correo electrónico', phone: 'Teléfono / WhatsApp', optional: 'opcional',
    arrivalTime: 'Hora de llegada', after21: 'Después de las 21:00', notes: '¿Algo que debamos saber?', addStay: 'Añade a tu estancia', free: 'Gratis',
    consent: 'Acepto la', privacy: 'política de privacidad', confirm: 'Confirmar reserva', payLater: 'Sin tarjeta ahora',
    confirmed: 'reserva confirmada', seeYou: 'Hasta pronto,', sentTo: 'Te hemos enviado los detalles a',
    next1: 'Añadir al calendario', next1p: 'Guarda las fechas con la dirección y la hora de entrada.',
    next2: 'Cómo llegar', next2p: 'Del aeropuerto, tren C1 hasta Málaga Centro y 8 minutos a pie.',
    next3: 'Cambiar o cancelar', next3p: 'Gratis hasta 48 horas antes. Responde al correo o escríbenos.',
    addCal: 'Añadir al calendario', backHome: 'Volver a la web',
    demoBooking: 'Esto es una demostración: no se ha hecho ninguna reserva ni se ha enviado ningún correo. En la web de un hotel real, el huésped recibe esta confirmación al instante y el hotel ve la reserva sin pagar comisión.',
    yourStay: 'Tu estancia', dates: 'Fechas', nightsL: 'Noches', breakfast: 'Desayuno para dos', included: 'Incluido', extras: 'Extras',
    total: 'Total, a pagar en la casa', youSave: 'Ahorras', vsOta: 'frente a los buscadores',
    perk1: 'Cancelación gratuita hasta 48 horas antes', perk2: 'Pagas en la casa, sin tarjeta ahora', perk3: 'Desayuno en la azotea incluido',
    step1: 'Habitación', step2: 'Datos', step3: 'Hecho',
  },
  en: {
    arrival: 'Arrival', departure: 'Departure', guestsLabel: 'Guests', changeDates: 'Change dates', checkAvail: 'Check availability',
    flowEyebrow: 'book direct · best rate', chooseRoom: 'Choose your room', continue: 'Continue to details', backRooms: 'Back to rooms',
    details: 'Your details', detailsLead: 'You pay at the house when you arrive. No card needed now.', mainGuest: 'Main guest',
    first: 'First name', last: 'Last name', email: 'Email', phone: 'Phone / WhatsApp', optional: 'optional',
    arrivalTime: 'Arrival time', after21: 'After 21:00', notes: 'Anything we should know?', addStay: 'Add to your stay', free: 'Free',
    consent: 'I agree to the', privacy: 'privacy policy', confirm: 'Confirm booking', payLater: 'No card needed now',
    confirmed: 'booking confirmed', seeYou: 'See you soon,', sentTo: 'We have sent the details to',
    next1: 'Add to calendar', next1p: 'Save the dates with the address and check-in time.',
    next2: 'Getting here', next2p: 'From the airport, the C1 train to Málaga Centro, then an 8-minute walk.',
    next3: 'Change or cancel', next3p: 'Free up to 48 hours before. Reply to the email or message us.',
    addCal: 'Add to calendar', backHome: 'Back to the website',
    demoBooking: 'This is a demo, so no booking was made and no email was sent. On a real hotel site the guest gets this confirmation instantly and the hotel sees the booking straight away, with no commission to pay.',
    yourStay: 'Your stay', dates: 'Dates', nightsL: 'Nights', breakfast: 'Breakfast for two', included: 'Included', extras: 'Extras',
    total: 'Total, paid at the house', youSave: 'You save', vsOta: 'compared with booking sites',
    perk1: 'Free cancellation up to 48 hours before', perk2: 'Pay at the house, no card needed now', perk3: 'Breakfast on the rooftop included',
    step1: 'Room', step2: 'Details', step3: 'Done',
  },
};

const extras = {
  es: [{ id: 'transfer', name: 'Traslado desde el aeropuerto', desc: 'Te esperamos en llegadas con tu nombre', price: 45 },
       { id: 'walk', name: 'Paseo por el centro con Lucía', desc: 'Dos horas por el Málaga de siempre, a las 10:00', price: 0 }],
  en: [{ id: 'transfer', name: 'Airport transfer', desc: 'We meet you at arrivals with your name', price: 45 },
       { id: 'walk', name: 'Old-town walk with Lucía', desc: 'Two hours through old Málaga, at 10:00', price: 0 }],
};

export const site = {
  name: 'Casa Lumbre', code: 'CL', address: 'Calle de la Lumbre 12, 29008 Málaga', ota: 1.15, breakfastOta: 16,
  t, extras,
  href: (L: Lang, k: string) => { const [key, hash] = k.split('#'); return (paths[L] as Record<string, string>)[key] + (hash ? '#' + hash : ''); },
};

/** Data the booking script needs in the browser (window.SITE). */
export const siteJSON = (L: Lang) => ({
  name: site.name, code: site.code, address: site.address, ota: site.ota, breakfastOta: site.breakfastOta,
  t: { ...UI[L], ...t[L] },
  rooms: rooms.map((r) => ({ id: r.id, name: r.name[L], price: r.price, max: r.max, meta: r.meta[L], tag: r.tag ? r.tag[L] : '',
    thumb: src(r.image, 480, 4 / 3), img: src(r.image, 960, 16 / 9), alt: '' })),
  extras: extras[L],
});
