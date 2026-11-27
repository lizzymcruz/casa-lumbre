// Photos from Unsplash (unsplash.com/license), served from Unsplash's image CDN as their
// guidelines ask. Each one is credited on the legal notice page and in the README.
// To swap a photo: replace `id` with the photo's images.unsplash.com id and update the credit.

export interface Photo { id: string; alt: { es: string; en: string }; by: string; page: string; pos?: string }

export const photos = {
  hero: { id: 'photo-1776083928944-f427c6f1f738', by: 'Domenico Adornato', page: 'https://unsplash.com/photos/nPJPiwx7k-o',
    alt: { es: 'Patio andaluz con una fuente de azulejos y macetas', en: 'An Andalusian courtyard with a tiled fountain and potted plants' } },
  tiles: { id: 'photo-1594055364451-697970558dec', by: 'Roo Raggio', page: 'https://unsplash.com/photos/84NhYJL1GnE',
    alt: { es: 'Escalera con azulejos pintados a mano', en: 'A staircase with hand-painted tiles' } },
  rooftop: { id: 'photo-1641667710644-fb8a6abf2a06', by: 'Yuliya Matuzava', page: 'https://unsplash.com/photos/Nx0C3cDKRLw',
    alt: { es: 'Los tejados de Málaga con una torre al fondo', en: 'The rooftops of Málaga with a tower beyond' } },
  hall: { id: 'photo-1788451746895-32aa7c345983', by: 'Álvaro Ruiz Mena', page: 'https://unsplash.com/photos/ZmqeWJoMncw',
    alt: { es: 'Un banco de madera junto a una pared encalada con macetas de barro', en: 'A wooden bench against a lime-washed wall with terracotta pots' } },
  courtyard: { id: 'photo-1767022056962-0a7cca59b8d2', by: 'Alexis Presa', page: 'https://unsplash.com/photos/nqJg7H_qoE8',
    alt: { es: 'Un patio de paredes blancas con una puerta abierta', en: 'A white-walled courtyard with an open doorway' } },
  breakfast: { id: 'photo-1606031901060-971e80cd8bee', by: 'Rawness Grow', page: 'https://unsplash.com/photos/g2pTbMglIOE',
    alt: { es: 'Desayuno en una mesa de madera con una cesta de mimbre', en: 'Breakfast on a wooden table with a wicker basket' } },
  sunset: { id: 'photo-1621930081080-606d6fed97d5', by: 'Nadia Narváez', page: 'https://unsplash.com/photos/b9BtMtcjN84',
    alt: { es: 'La catedral de Málaga vista desde una terraza', en: 'Málaga cathedral seen from a terrace' } },
  street: { id: 'photo-1792096577808-813bb0653bee', by: 'Richard Williams', page: 'https://unsplash.com/photos/_A1I152Hd8c',
    alt: { es: 'Una calle estrecha de Málaga con un campanario', en: 'A narrow Málaga street with a bell tower' } },
  patio: { id: 'photo-1588747522978-e53427e16442', by: 'Phillip Goldsberry', page: 'https://unsplash.com/photos/HzqjZiHdwaM',
    alt: { es: 'Luz de mañana entre contraventanas sobre la cama', en: 'Morning light through shutters across the bed' } },
  balcony: { id: 'photo-1764516427759-63b596a4cb7c', by: 'Noa van Ieperen', page: 'https://unsplash.com/photos/Rk5PCLyvJcY',
    alt: { es: 'Puertas de madera abiertas a un balcón con macetas', en: 'Wooden doors open onto a balcony with potted plants' } },
  suite: { id: 'photo-1788217023349-ad7763845844', by: 'Clay Banks', page: 'https://unsplash.com/photos/yOs9Zc5JvTw',
    alt: { es: 'Dormitorio con cama de madera y baño abierto', en: 'A bedroom with a wooden bed and an open bathroom' } },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Unsplash CDN URL at a given width (and optional crop ratio). */
export const src = (key: PhotoKey, w: number, ratio?: number) => {
  const p = photos[key];
  return `https://images.unsplash.com/${p.id}?auto=format&fit=crop&q=70&w=${w}${ratio ? `&h=${Math.round(w / ratio)}` : ''}`;
};
export const srcset = (key: PhotoKey, widths: number[], ratio?: number) => widths.map((w) => `${src(key, w, ratio)} ${w}w`).join(', ');
