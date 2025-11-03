-- Update Jeju city gallery images with stable Unsplash URLs
-- Issue #17: Replace Jeju gallery images with stable Unsplash URLs

UPDATE cities
SET gallery_images = ARRAY[
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500'
]
WHERE name = '제주';
