-- Migration: Fix all city gallery images with verified Unsplash URLs
-- Issue #19: Replace all gallery images with working, characteristic-appropriate Unsplash URLs

-- Update Seoul - City night, streets, and traditional architecture
UPDATE cities
SET gallery_images = array[
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=500',
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=500',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500'
]
WHERE id = 1;

-- Update Gangneung - Beach, mountains, and nature
UPDATE cities
SET gallery_images = array[
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500'
]
WHERE id = 2;

-- Update Jeonju - Traditional architecture and night views
UPDATE cities
SET gallery_images = array[
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=500',
  'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500'
]
WHERE id = 3;

-- Update Busan - Beach, sunset, and cultural villages
UPDATE cities
SET gallery_images = array[
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500'
]
WHERE id = 4;

-- Update Daegu - Urban landscapes and nature
UPDATE cities
SET gallery_images = array[
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500'
]
WHERE id = 5;

-- Update Gwangju - Art and cultural images
UPDATE cities
SET gallery_images = array[
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=500',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500'
]
WHERE id = 7;

-- Update Daejeon - Urban and modern architecture
UPDATE cities
SET gallery_images = array[
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500',
  'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500'
]
WHERE id = 8;
