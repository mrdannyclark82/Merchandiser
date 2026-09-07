import { ResetProject } from './types';

export const INITIAL_RESETS: ResetProject[] = [
  {
    id: 'fb-bts-searcy-2026',
    storeName: 'Five Below #4150 - Searcy, AR',
    name: 'BTS 2026 - Beat the BELL! Back To School & Gondola Reset',
    location: 'Front New & Now World / NOW Walls 1-7',
    address: '3012 E Race Ave, Searcy, AR 72143',
    lat: 35.2471,
    lng: -91.7011,
    geofenceRadiusMeters: 400,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'high',
    status: 'in_progress',
    notes: 'Primary BTS 2026 Reset for Searcy AR store. Remove Americana Summer product from New & Now gondola/wall and relocate to inline Apparel & Canvas Totes gondola. Replace NOW Wall 1 with $5 Backpacks lead-in and NOW Wall 2 with $7 Backpacks.',
    tasks: [
      { id: 'searcy-1', text: 'Remove Americana summer product from New & Now gondola & relocate to Apparel & Canvas Totes gondola', completed: true },
      { id: 'searcy-2', text: 'Mount 12" heavy duty pegs on NOW Wall 1 with 7", 13", 13", 5" horizontal spacing for $5 Backpacks', completed: true },
      { id: 'searcy-3', text: 'Set NOW Wall 2 ($7 Backpacks) & NOW Wall 3-4 (License Backpacks / Lunch)', completed: false },
      { id: 'searcy-4', text: 'Merchandise bottom base deck with Nano Bag Charms PDQ ($5) & Writing Cubes (50¢ download price chips)', completed: false },
      { id: 'searcy-5', text: 'Set NOW Wall 5 & 6: K-Pop Demon Hunters tech accessories & AirPods cases', completed: false },
      { id: 'searcy-6', text: 'Set NOW Bulk 1 (Post-it $1), NOW Bulk 2 (License Charms $5), NOW Bulk 3 (Five Star)', completed: false },
      { id: 'searcy-7', text: 'Attach "beat the BELL!" campaign header signage kit & $5 / $7 price toppers', completed: false }
    ],
    photos: [
      {
        id: 'p-searcy-1',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
        timestamp: new Date(Date.now() - 3600000).toLocaleString(),
        note: 'Searcy Store NOW Wall 1 cleared of Americana products and 12-inch pegs mounted'
      }
    ],
    documents: [
      {
        id: 'd-searcy-1',
        name: 'Searcy_Store_Beat_The_Bell_Planogram_Blueprint.pdf',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: new Date(Date.now() - 86400000).toLocaleDateString()
      },
      {
        id: 'd-searcy-2',
        name: 'Americana_Summer_Disposition_Guide.png',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
        uploadedAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString()
      }
    ]
  },
  {
    id: 'fb-dorm-searcy',
    storeName: 'Five Below #4150 - Searcy, AR',
    name: 'Back To Dorm 2026 - Cubes & Spinners',
    location: 'Mid-Store / Back To Dorm Area',
    address: '3012 E Race Ave, Searcy, AR 72143',
    lat: 35.2471,
    lng: -91.7011,
    geofenceRadiusMeters: 400,
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'in_progress',
    notes: 'Set Back To Dorm Expansion in Searcy store. Move NOW Spinners to Back To Dorm for Tech Accessories & Tech Pouches. Merchandise Desk Edit Cube 4 ("DESKSCAPING").',
    tasks: [
      { id: 'dorm-1', text: 'Set Spinner 1 (Tech Accessories - tip-top Tech $7) and Spinner 2 (Tech Pouches $7)', completed: true },
      { id: 'dorm-2', text: 'Set Desk Edit Cube 4 FRONT ("DESKSCAPING in your dorm!") with compact monitor stands', completed: true },
      { id: 'dorm-3', text: 'Set Desk Edit Cube 4 BACK ("TRENDY TECH yes plz!") with metal laptop stands & desk lamps', completed: false },
      { id: 'dorm-4', text: 'Merchandise bottom tier with Faux Fur CD Player, Taylor Swift CDs & Karaoke Mics', completed: false },
      { id: 'dorm-5', text: 'Hang "DORM = secured." header signage & price toppers', completed: false }
    ],
    photos: [
      {
        id: 'p-dorm-1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
        timestamp: new Date(Date.now() - 7200000).toLocaleString(),
        note: 'Desk Edit Cube 4 assembled with monitor stands & LED desk lamps'
      }
    ],
    documents: [
      {
        id: 'd-dorm-1',
        name: 'Back_To_Dorm_2026_Cubes_Spinners_Planogram.pdf',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toLocaleDateString()
      }
    ]
  },
  {
    id: 'fb-glts-searcy',
    storeName: 'Five Below #4150 - Searcy, AR',
    name: 'Greatest Little Toy Store (GLTS) Play Expansion',
    location: 'PLAY Department & Perimeter Walls',
    address: '3012 E Race Ave, Searcy, AR 72143',
    lat: 35.2471,
    lng: -91.7011,
    geofenceRadiusMeters: 400,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    priority: 'high',
    status: 'pending',
    notes: 'Transform Play department into immersive discovery zones (Slime Zone, Battle Zone, Collectibles & Figures, Craft Zone). Consolidate Fitness walls to 8ft in Searcy store.',
    tasks: [
      { id: 'glts-1', text: 'Consolidate Fitness walls to 8ft and relocate to back of store', completed: false },
      { id: 'glts-2', text: 'Set Slime Zone: Gondola 1 Slime Lab, Gondola 2 Slime Sets, Gondola 3 SlimyGloop', completed: false },
      { id: 'glts-3', text: 'Set Collectibles & Figures: Blind Mystery 1-3, Funko Mini Vinyls, Fuggles & $6 Snowglobes', completed: false },
      { id: 'glts-4', text: 'Set Battle Zone Wall: Dinos & Critters, Bow & Arrow sets, Sword Blasters & Army Command', completed: false },
      { id: 'glts-5', text: 'Set Craft Zone: Diamond Art, Granny Crochet Kits, License Stationery & Journaling', completed: false },
      { id: 'glts-6', text: 'Install "GREATEST LITTLE TOY STORE" zone header signs & category shelf strips', completed: false }
    ],
    photos: [],
    documents: [
      {
        id: 'd-glts-1',
        name: 'GLTS_Play_Expansion_Visual_Merchandising_Guide.pdf',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: new Date().toLocaleDateString()
      }
    ]
  }
];
