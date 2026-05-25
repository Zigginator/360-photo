// Generate sample image URLs with cat photos
const generateSampleImages = (
  count: number,
  width: number,
  height: number,
): string[] => {
  return Array.from(
    { length: count },
    (_, i) => `https://loremflickr.com/${width}/${height}/cat?lock=${i}`,
  );
};

// Helper functions for specific aspect ratios
export const generate1x1Images = (count: number) =>
  generateSampleImages(count, 800, 800);
export const generate4x3Images = (count: number) =>
  generateSampleImages(count, 800, 600);
export const generate3x4Images = (count: number) =>
  generateSampleImages(count, 600, 800);
export const generate16x9Images = (count: number) =>
  generateSampleImages(count, 1600, 900);
export const generate9x16Images = (count: number) =>
  generateSampleImages(count, 900, 1600);
