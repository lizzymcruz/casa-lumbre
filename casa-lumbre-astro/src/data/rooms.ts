// Room content. In the client build this moves to Storyblok (one "room" content type);
// the shape below is the same, so templates don't change.
import patio from '../assets/photos/patio-room.jpg';
import balcony from '../assets/photos/balcony-room.jpg';
import suite from '../assets/photos/lumbre-suite.jpg';
import tiles from '../assets/photos/tiles.jpg';
import hall from '../assets/photos/hall.jpg';
import hero from '../assets/photos/hero.jpg';
import rooftop from '../assets/photos/rooftop.jpg';
import breakfast from '../assets/photos/breakfast.jpg';
import sunset from '../assets/photos/sunset.jpg';

type L = { es: string; en: string };
export interface Room {
  slug: L; name: L; price: number; guests: string; size: number; bed: L; view: L;
  short: L; tagline: L; body: L; meta: L;
  amenities: { es: string[]; en: string[] };
  gtk: { checkin: string; checkout: string; stairs: L; children: L };
  image: ImageMetadata; gallery: ImageMetadata[];
}

const gtkBase = { checkin: '15:00', checkout: '11:00', children: { es: 'bienvenidos, cuna bajo petición', en: 'welcome, cot on request' } };
const amen = {
  es: ['Cama queen, sábanas de lino', 'Ducha de lluvia, jabones de aceite de oliva', 'Aire acondicionado y ventilador de techo', 'Contraventanas opacas', 'Wi-Fi rápido', 'Nespresso y tés andaluces', 'Caja fuerte y armario', 'Secador, albornoces y zapatillas'],
  en: ['Queen bed, linen sheets', 'Rain shower, local olive-oil soaps', 'Air conditioning & ceiling fan', 'Blackout shutters', 'Fast Wi-Fi', 'Nespresso & Andalusian teas', 'Safe and wardrobe', 'Hairdryer, bathrobes, slippers'],
};

export const rooms: Room[] = [
  {
    slug: { es: 'patio', en: 'patio' },
    name: { es: 'Habitación Patio', en: 'Patio Room' },
    price: 165, guests: '2', size: 22,
    bed: { es: 'queen', en: 'queen' }, view: { es: 'patio', en: 'courtyard' },
    meta: { es: '2 huéspedes · 22 m² · vistas al patio', en: '2 guests · 22 m² · courtyard view' },
    short: { es: 'Contraventanas al patio interior, suelo de barro y una cama de lino.', en: 'Shuttered windows onto the inner courtyard, terracotta floor and a deep linen bed.' },
    tagline: { es: 'Una habitación fresca y tranquila que se abre al patio interior.', en: 'A cool, quiet room that opens onto the inner courtyard.' },
    body: { es: 'Las contraventanas se pliegan sobre el patio, así que las mañanas empiezan con el sonido de la fuente y el olor a azahar. El suelo original de barro se mantiene fresco todo el verano, y la cama se viste con sábanas tejidas en Granada.', en: 'Tall shutters fold back onto the patio, so mornings start with the sound of the fountain and the smell of orange blossom. The original terracotta floor stays cool all summer, and the deep linen bed is dressed in sheets woven in Granada.' },
    amenities: amen,
    gtk: { ...gtkBase, stairs: { es: 'planta baja, sin escalones', en: 'ground floor, no steps' } },
    image: patio, gallery: [patio, tiles, hall, hero],
  },
  {
    slug: { es: 'balcon', en: 'balcony' },
    name: { es: 'Habitación Balcón', en: 'Balcony Room' },
    price: 185, guests: '2', size: 26,
    bed: { es: 'queen', en: 'queen' }, view: { es: 'calle', en: 'lane' },
    meta: { es: '2 huéspedes · 26 m² · balcón francés', en: '2 guests · 26 m² · juliet balcony' },
    short: { es: 'Balcón de forja sobre una calle tranquila, con luz de mañana y ducha de lluvia.', en: 'Wrought-iron balcony over a quiet lane, with morning light and a rain shower.' },
    tagline: { es: 'Un balcón de forja sobre una calle silenciosa del centro.', en: 'A wrought-iron balcony over a quiet old-town lane.' },
    body: { es: 'Abre las puertas por la mañana y la calle entra con su luz, sus macetas y el campanario al fondo. Por la noche, el lino y las contraventanas devuelven el silencio.', en: 'Open the doors in the morning and the lane comes in: light, geraniums and the bell tower beyond. At night, linen and shutters bring the quiet back.' },
    amenities: amen,
    gtk: { ...gtkBase, stairs: { es: 'primera planta, escalera', en: 'first floor, stairs' } },
    image: balcony, gallery: [balcony, tiles, hall, hero],
  },
  {
    slug: { es: 'suite-lumbre', en: 'lumbre-suite' },
    name: { es: 'Suite Lumbre', en: 'Lumbre Suite' },
    price: 290, guests: '2–3', size: 42,
    bed: { es: 'king', en: 'king' }, view: { es: 'catedral', en: 'cathedral' },
    meta: { es: '2–3 huéspedes · 42 m² · terraza privada', en: '2–3 guests · 42 m² · private terrace' },
    short: { es: 'Nuestra última planta: terraza privada, bañera exenta y vistas a la catedral.', en: 'Our top floor: a private terrace, a freestanding tub and views to the cathedral.' },
    tagline: { es: 'La última planta, con terraza privada y la catedral de frente.', en: 'The top floor, with a private terrace facing the cathedral.' },
    body: { es: 'Una bañera exenta junto a las puertas abiertas, olivos en macetas de barro y los tejados de Málaga hasta el monte. Es la habitación para quedarse.', en: 'A freestanding tub by open doors, olive trees in terracotta pots and the rooftops of Málaga out to the hills. This is the room to stay in.' },
    amenities: amen,
    gtk: { ...gtkBase, stairs: { es: 'última planta, escalera', en: 'top floor, stairs' } },
    image: suite, gallery: [suite, rooftop, sunset, breakfast],
  },
];

export const findRoom = (lang: 'es' | 'en', slug: string) => rooms.find((r) => r.slug[lang] === slug);
