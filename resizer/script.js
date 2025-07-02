const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const originalPreview = document.getElementById('originalPreview');
const resizedPreview = document.getElementById('resizedPreview');
const previewSection = document.getElementById('previewSection');
const resizeBtn = document.getElementById('resizeBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentFile = null;
let targetWidth = 256;
let targetHeight = 256;
let resizedImageData = null;

// Theme detection and management
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize theme on load
initTheme();

// Set default selection
document.querySelector('[data-width="256"]').classList.add('selected');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

// Size option selection
document.querySelectorAll('.size-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    targetWidth = parseInt(option.dataset.width);
    targetHeight = parseInt(option.dataset.height);
    
    // Clear custom inputs
    document.getElementById('customWidth').value = '';
    document.getElementById('customHeight').value = '';
  });
});

function setCustomSize() {
  const width = parseInt(document.getElementById('customWidth').value);
  const height = parseInt(document.getElementById('customHeight').value);
  
  if (width && height && width > 0 && height > 0) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    targetWidth = width;
    targetHeight = height;
  } else {
    alert('Please enter valid width and height values');
  }
}

function handleFiles(files) {
  if (files.length === 0) return;
  
  const file = files[0];
  if (file.type !== "image/png") {
    alert("Please upload a PNG file.");
    return;
  }
  
  currentFile = file;
  const reader = new FileReader();
  reader.onload = function(e) {
    originalPreview.src = e.target.result;
    previewSection.style.display = 'block';
    resizeBtn.classList.add('show');
    
    // Create image to get dimensions
    const img = new Image();
    img.onload = function() {
      document.getElementById('originalInfo').textContent = 
        `${img.width} × ${img.height} pixels • ${(file.size / 1024).toFixed(1)} KB`;
    };
    img.src = e.target.result;
    
    // Hide resized container
    document.getElementById('resizedContainer').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function resizeImage() {
  if (!currentFile) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Set canvas dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw resized image
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to PNG and display
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        resizedPreview.src = url;
        resizedImageData = blob;
        
        document.getElementById('resizedInfo').textContent = 
          `${targetWidth} × ${targetHeight} pixels • ${(blob.size / 1024).toFixed(1)} KB`;
        
        document.getElementById('resizedContainer').style.display = 'block';
      }, 'image/png', 1.0);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(currentFile);
}

function downloadResized() {
  if (!resizedImageData) return;
  
  const url = URL.createObjectURL(resizedImageData);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resized_${targetWidth}x${targetHeight}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}