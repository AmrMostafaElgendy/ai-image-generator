const apiKey = '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';
const unsplashAccessKey = 'X6JpeHGM08O2uH4d_58ea_M9jdQk5yFgqpFgC1KzpUU';

const tagsInput = document.getElementById('tags');
const imageCountInput = document.getElementById('imageCount');
const imagesContainer = document.getElementById('imagesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const clearButton = document.getElementById('clearButton');
const filterSelect = document.getElementById('filterSelect');
const colorPaletteContainer = document.getElementById('colorPalette');
const randomTags = ['nature', 'technology', 'art', 'travel', 'science'];

// Function to get images from OpenAI
const getImgs = async () => {
  const prompt = tagsInput.value.trim();
  const imageCount = parseInt(imageCountInput.value, 10);

  if (!prompt) {
    alert('Please enter tags.');
    return;
  }

  if (isNaN(imageCount) || imageCount < 1) {
    alert('Please enter a valid image count (minimum 1).');
    return;
  }

  try {
    loadingSpinner.style.display = 'block'; // Show loading spinner

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: imageCount,
        size: '256x256'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const images = data.data;

    // Clear existing images
    imagesContainer.innerHTML = '';

    // Create and append new image elements
    images.forEach((photo, index) => {
      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = `Generated Image ${index + 1}`;
      imagesContainer.appendChild(img);
    });

    loadingSpinner.style.display = 'none'; // Hide loading spinner
  } catch (error) {
    console.error('Error fetching data:', error);
    loadingSpinner.style.display = 'none'; // Hide loading spinner
    alert('An error occurred while fetching images. Please try again.');
  }
};

// Function to clear generated images
const clearImages = () => {
  imagesContainer.innerHTML = '';
  colorPaletteContainer.innerHTML = ''; // Clear color palette
};

// Function to populate input field with a random tag
const getRandomTag = () => {
  const randomTag = randomTags[Math.floor(Math.random() * randomTags.length)];
  tagsInput.value = randomTag;
};

// Function to apply image filter
const applyFilter = () => {
  const selectedFilter = filterSelect.value;
  const images = imagesContainer.querySelectorAll('img');

  images.forEach(img => {
    img.style.filter = selectedFilter === 'none' ? 'none' : `${selectedFilter}(100%)`;
  });
};

// Function to download images
const downloadImages = () => {
  const images = imagesContainer.querySelectorAll('img');
  images.forEach((img, index) => {
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `generated_image_${index + 1}.png`;
    link.click();
  });
};
// Function to get hero images from Unsplash
const getHeroImages = async () => {
  const heroSection = document.getElementById('heroSection');

  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=art&count=3`, {
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${unsplashAccessKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Apply background images to the hero section
    heroSection.style.background = `url('${data[0].urls.regular}') center/cover no-repeat,
                                  url('${data[1].urls.regular}') center/cover no-repeat,
                                  url('${data[2].urls.regular}') center/cover no-repeat`;

    // Clear existing images in the heroImagesContainer
    const heroImagesContainer = document.getElementById('heroImages');
    heroImagesContainer.innerHTML = '';

  } catch (error) {
    console.error('Error fetching hero images:', error);
    alert('An error occurred while fetching hero images. Please try again.');
  }
};

// Call getHeroImages when the page loads
document.addEventListener('DOMContentLoaded', getHeroImages);
