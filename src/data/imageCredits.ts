/**
 * TAMIZN VISA - Photographic Credits and Licensing Registry
 * Strictly free-licensed imagery from Wikimedia Commons (Public Domain or Creative Commons).
 * ZERO hotlinking: all images downloaded locally to /public/images/.
 */

export interface ImageCredit {
  id: string;
  category: string;
  subject: string;
  localPath: string;
  altText: string;
  author: string;
  license: string;
  sourceUrl: string;
}

export const IMAGE_CREDITS_DATA: ImageCredit[] = [
  {
    id: 'credit-temples',
    category: 'Temples & Spiritual',
    subject: 'Brihadisvara Temple (Big Temple), Thanjavur, Tamil Nadu',
    localPath: '/images/temples.jpg',
    altText: 'Vimana tower of the 11th-century Brihadisvara Temple in Thanjavur under blue skies',
    author: 'Wikimedia Commons Contributor (Vinoth Chandar / Creative Commons)',
    license: 'Creative Commons CC BY 2.0 / CC BY-SA',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Brihadisvara_Temple,_Thanjavur.jpg',
  },
  {
    id: 'credit-heritage',
    category: 'Heritage & Forts',
    subject: 'Gingee Fort (Senji Fort) & Rajagiri Citadel, Villupuram District, Tamil Nadu',
    localPath: '/images/heritage.jpg',
    altText: 'Panoramic view of the historic Gingee Fort stone fortifications and granary on the hills of Tamil Nadu',
    author: 'User:PlaneMad',
    license: 'Creative Commons Attribution-Share Alike 2.5 Generic (CC BY-SA 2.5)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gingee_Fort_panorama.jpg',
  },
  {
    id: 'credit-beaches',
    category: 'Beaches & Coastal',
    subject: 'Marina Beach & Bay of Bengal Coastline, Chennai, Tamil Nadu',
    localPath: '/images/beaches.jpg',
    altText: 'Golden sands and breaking ocean waves along Marina Beach in Chennai at evening twilight',
    author: 'Wikimedia Commons Contributor',
    license: 'Creative Commons CC BY-SA 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Marina_Beach,_Chennai_(evening).jpg',
  },
  {
    id: 'credit-hills',
    category: 'Hills & Waterfalls',
    subject: 'Glenmorgan Tea Estate & Nilgiri Hills, Ooty, Tamil Nadu',
    localPath: '/images/hills.jpg',
    altText: 'Lush green undulating tea plantations in the misty Nilgiri mountains of Western Ghats',
    author: 'Wikimedia Commons Contributor',
    license: 'Creative Commons CC BY-SA 3.0 / Wiki Loves Earth',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Glenmorgan_Tea_estate,_Ooty.jpg',
  },
  {
    id: 'credit-food',
    category: 'Food & Cuisine',
    subject: 'Traditional South Indian Feast on Fresh Banana Leaf, Tamil Nadu',
    localPath: '/images/food.jpg',
    altText: 'Authentic Tamil banana leaf meal with rice, sambar, rasam, kootu, poriyal, appalam, and payasam',
    author: 'Wikimedia Commons Contributor',
    license: 'Creative Commons CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:South_Indian_Meal.jpg',
  },
  {
    id: 'credit-wildlife',
    category: 'Wildlife & Nature',
    subject: 'Bengal Tiger in Mudumalai National Park, Nilgiris, Tamil Nadu',
    localPath: '/images/wildlife.jpg',
    altText: 'Royal Bengal Tiger walking through natural forest reserve in Mudumalai Tiger Reserve',
    author: 'N A Nazeer',
    license: 'Creative Commons Attribution-Share Alike 2.5 India (CC BY-SA 2.5 IN)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mudumalai_by_N_A_Nazeer.jpg',
  },
];
