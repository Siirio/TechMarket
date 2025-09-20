// TechMarket JavaScript Functionality

// Global variables
let compareList = [];
let cartItems = [];
let favorites = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved data from localStorage
    loadSavedData();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomepage();
            break;
        case 'catalog':
            initializeCatalog();
            break;
        case 'product':
            initializeProduct();
            break;
        case 'comparison':
            initializeComparison();
            break;
        case 'cart':
            initializeCart();
            break;
        case 'profile':
            initializeProfile();
            break;
    }
    
    // Initialize global functionality
    initializeGlobalFeatures();
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

function loadSavedData() {
    // Load compare list
    const savedCompare = localStorage.getItem('techmarket_compare');
    if (savedCompare) {
        compareList = JSON.parse(savedCompare);
    }
    
    // Load cart items
    const savedCart = localStorage.getItem('techmarket_cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem('techmarket_favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

function saveData() {
    localStorage.setItem('techmarket_compare', JSON.stringify(compareList));
    localStorage.setItem('techmarket_cart', JSON.stringify(cartItems));
    localStorage.setItem('techmarket_favorites', JSON.stringify(favorites));
}

// Homepage functionality
function initializeHomepage() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // Redirect to catalog with search query
        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
    }
}

// Navigation functions
function navigateToCategory(category) {
    // Update the catalog page to show the correct category
    localStorage.setItem('selectedCategory', category);
    window.location.href = `catalog.html?category=${category}`;
}

// Add click handlers for category icons
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for category icons in hero section
    const categoryItems = document.querySelectorAll('.category-icon-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            navigateToCategory(category);
        });
    });

    // Add click handlers for comparison category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showCategory(category);
        });
    });
});

// Show comparison category
function showCategory(category) {
    // Hide all categories
    const categories = document.querySelectorAll('.comparison-category');
    categories.forEach(cat => cat.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected category
    const selectedCategory = document.getElementById(category);
    if (selectedCategory) {
        selectedCategory.classList.add('active');
    }
    
    // Add active class to clicked tab
    const clickedTab = document.querySelector(`[onclick="showCategory('${category}')"]`);
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
}

function navigateToGuidedFilters() {
    window.location.href = 'catalog.html?guided=true';
}

function navigateToComparison() {
    if (compareList.length > 0) {
        window.location.href = 'comparison.html';
    } else {
        alert('Please add products to compare first!');
    }
}

// Compare functionality
function addToCompare(productId) {
    if (compareList.includes(productId)) {
        alert('Product is already in comparison list!');
        return;
    }
    
    if (compareList.length >= 4) {
        alert('You can compare up to 4 products at once!');
        return;
    }
    
    compareList.push(productId);
    saveData();
    updateCompareButton();
    
    // Show success message
    showNotification('Product added to comparison!', 'success');
}

function removeFromCompare(productId) {
    const index = compareList.indexOf(productId);
    if (index > -1) {
        compareList.splice(index, 1);
        saveData();
        updateCompareButton();
        showNotification('Product removed from comparison!', 'info');
    }
}

function updateCompareButton() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    compareButtons.forEach(btn => {
        const count = compareList.length;
        btn.textContent = `Compare Products (${count})`;
        btn.disabled = count === 0;
    });
}

// Catalog functionality
function initializeCatalog() {
    // Check for category parameter and update page
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || localStorage.getItem('selectedCategory') || 'laptops';
    updateCatalogForCategory(category);
    
    // Filter functionality
    const filterApply = document.querySelector('.filter-apply');
    const filterClear = document.querySelector('.filter-clear');
    
    if (filterApply) {
        filterApply.addEventListener('click', applyFilters);
    }
    
    if (filterClear) {
        filterClear.addEventListener('click', clearFilters);
    }
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Update compare button
    updateCompareButton();
}

function updateCatalogForCategory(category) {
    const productsTitle = document.querySelector('.products-title');
    if (productsTitle) {
        const categoryNames = {
            'laptops': 'Laptops',
            'smartphones': 'Smartphones', 
            'tvs': 'TVs',
            'appliances': 'Appliances'
        };
        productsTitle.textContent = categoryNames[category] || 'Products';
    }
    
    // Update products based on category
    updateProductsForCategory(category);
}

function updateProductsForCategory(category) {
    // Product data for different categories
    const productData = {
        laptops: [
            {
                id: 'macbook-pro',
                title: 'MacBook Pro 16"',
                spec: 'M3 Pro • 16GB RAM • 512GB SSD',
                price: '$2,499',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'dell-xps',
                title: 'Dell XPS 15',
                spec: 'i7 • 16GB RAM • 512GB SSD',
                price: '$1,899',
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'hp-spectre',
                title: 'HP Spectre x360',
                spec: 'i5 • 8GB RAM • 256GB SSD',
                price: '$1,299',
                image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'lenovo-thinkpad',
                title: 'Lenovo ThinkPad X1',
                spec: 'i7 • 32GB RAM • 1TB SSD',
                price: '$2,199',
                image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'asus-zenbook',
                title: 'ASUS ZenBook 14',
                spec: 'Ryzen 7 • 16GB RAM • 512GB SSD',
                price: '$1,599',
                image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'surface-laptop',
                title: 'Surface Laptop 5',
                spec: 'i5 • 8GB RAM • 256GB SSD',
                price: '$1,199',
                image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=200&fit=crop&crop=center'
            }
        ],
        smartphones: [
            {
                id: 'iphone-15-pro',
                title: 'iPhone 15 Pro',
                spec: 'A17 Pro • 128GB • Titanium',
                price: '$999',
                image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'samsung-s24',
                title: 'Samsung Galaxy S24',
                spec: 'Snapdragon 8 Gen 3 • 256GB',
                price: '$899',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'pixel-8-pro',
                title: 'Google Pixel 8 Pro',
                spec: 'Tensor G3 • 128GB • 5G',
                price: '$799',
                image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'oneplus-12',
                title: 'OnePlus 12',
                spec: 'Snapdragon 8 Gen 3 • 256GB',
                price: '$699',
                image: 'https://images.unsplash.com/photo-1601972602288-1f5d7b0b8b8b?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'xiaomi-14',
                title: 'Xiaomi 14',
                spec: 'Snapdragon 8 Gen 3 • 256GB',
                price: '$599',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'nothing-phone-2',
                title: 'Nothing Phone (2)',
                spec: 'Snapdragon 8+ Gen 1 • 256GB',
                price: '$549',
                image: 'https://images.unsplash.com/photo-1601972602288-1f5d7b0b8b8b?w=300&h=200&fit=crop&crop=center'
            }
        ],
        tvs: [
            {
                id: 'samsung-qled-65',
                title: 'Samsung QLED 65"',
                spec: '4K • HDR10+ • Smart TV',
                price: '$1,299',
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'lg-oled-55',
                title: 'LG OLED 55"',
                spec: '4K • OLED • Smart TV',
                price: '$1,599',
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'sony-bravia-75',
                title: 'Sony Bravia 75"',
                spec: '4K • HDR • Smart TV',
                price: '$2,199',
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'tcl-roku-50',
                title: 'TCL Roku 50"',
                spec: '4K • Roku OS • Smart TV',
                price: '$399',
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'hisense-uled-65',
                title: 'Hisense ULED 65"',
                spec: '4K • ULED • Smart TV',
                price: '$799',
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'vizio-m-series-55',
                title: 'Vizio M-Series 55"',
                spec: '4K • HDR • Smart TV',
                price: '$599',
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop&crop=center'
            }
        ],
        appliances: [
            {
                id: 'dyson-v15',
                title: 'Dyson V15 Detect',
                spec: 'Cordless • Laser Detection • 60min',
                price: '$699',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'kitchenaid-mixer',
                title: 'KitchenAid Stand Mixer',
                spec: '5 Quart • 10 Speeds • Tilt-Head',
                price: '$399',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'instant-pot-duo',
                title: 'Instant Pot Duo',
                spec: '7-in-1 • 6 Quart • Pressure Cooker',
                price: '$99',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'ninja-blender',
                title: 'Ninja Professional Blender',
                spec: '1000W • 72oz Pitcher • 4 Blades',
                price: '$79',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'breville-espresso',
                title: 'Breville Espresso Machine',
                spec: '15 Bar • Milk Frother • 54mm Portafilter',
                price: '$599',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center'
            },
            {
                id: 'air-fryer-xl',
                title: 'Ninja Air Fryer XL',
                spec: '5.5 Quart • 4 Functions • 1750W',
                price: '$129',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center'
            }
        ]
    };
    
    const products = productData[category] || productData.laptops;
    updateProductsGrid(products);
}

function updateProductsGrid(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=No+Image'">
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-spec">${product.spec}</p>
                <div class="product-price">${product.price}</div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="viewProduct('${product.id}')">View Details</button>
                    <button class="btn-secondary" onclick="addToCompare('${product.id}')">Compare</button>
                </div>
            </div>
        </div>
    `).join('');
}

function viewProduct(productId) {
    // Store product ID for the product page
    localStorage.setItem('selectedProduct', productId);
    window.location.href = 'product.html';
}

function applyFilters() {
    const filters = {
        minPrice: document.getElementById('minPrice')?.value,
        maxPrice: document.getElementById('maxPrice')?.value,
        ram: Array.from(document.querySelectorAll('input[name="ram"]:checked')).map(cb => cb.value),
        storage: Array.from(document.querySelectorAll('input[name="storage"]:checked')).map(cb => cb.value),
        brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value)
    };
    
    console.log('Applied filters:', filters);
    showNotification('Filters applied!', 'success');
}

function clearFilters() {
    // Clear all filter inputs
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
    
    showNotification('Filters cleared!', 'info');
}

function handleSort(event) {
    const sortBy = event.target.value;
    console.log('Sorting by:', sortBy);
    showNotification(`Sorted by ${sortBy}`, 'info');
}

// Product page functionality
function initializeProduct() {
    // Image carousel
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            changeImage(this);
        });
    });
    
    // Update compare button
    updateCompareButton();
}

function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const newSrc = thumbnail.querySelector('img').src;
    
    if (mainImage) {
        mainImage.src = newSrc;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

function toggleAllSpecs() {
    const allSpecs = document.getElementById('allSpecs');
    const toggleBtn = document.querySelector('.specs-toggle');
    
    if (allSpecs && toggleBtn) {
        if (allSpecs.style.display === 'none') {
            allSpecs.style.display = 'block';
            toggleBtn.textContent = 'Hide All Specifications';
        } else {
            allSpecs.style.display = 'none';
            toggleBtn.textContent = 'View All Specifications';
        }
    }
}

// Cart functionality
function initializeCart() {
    updateCartDisplay();
    updateCompareButton();
}

function updateQuantity(productId, change) {
    const quantityElement = document.querySelector(`[data-product="${productId}"] .quantity-value`);
    if (quantityElement) {
        let currentQuantity = parseInt(quantityElement.textContent);
        let newQuantity = Math.max(1, currentQuantity + change);
        quantityElement.textContent = newQuantity;
        
        // Update cart total
        updateCartTotal();
    }
}

function removeItem(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        const itemElement = document.querySelector(`[data-product="${productId}"]`);
        if (itemElement) {
            itemElement.remove();
            updateCartTotal();
            showNotification('Item removed from cart!', 'info');
        }
    }
}

function updateCartTotal() {
    // This would typically recalculate the total based on quantities
    console.log('Cart total updated');
}

function continueShopping() {
    window.location.href = 'catalog.html';
}

function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        document.querySelectorAll('.cart-item').forEach(item => item.remove());
        updateCartTotal();
        showNotification('Cart cleared!', 'info');
    }
}

function proceedToDelivery() {
    // This would typically validate cart and proceed to next step
    showNotification('Proceeding to delivery information...', 'info');
}

// Profile functionality
function initializeProfile() {
    // Profile navigation
    const navButtons = document.querySelectorAll('.profile-nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.textContent.toLowerCase().replace(' ', '');
            showSection(section);
        });
    });
    
    updateCompareButton();
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav buttons
    document.querySelectorAll('.profile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function removeFavorite(productId) {
    if (confirm('Remove from favorites?')) {
        const favoriteItem = document.querySelector(`[data-product="${productId}"]`);
        if (favoriteItem) {
            favoriteItem.remove();
            showNotification('Removed from favorites!', 'info');
        }
    }
}

function clearFavorites() {
    if (confirm('Clear all favorites?')) {
        document.querySelectorAll('.favorite-item').forEach(item => item.remove());
        showNotification('Favorites cleared!', 'info');
    }
}

// Global features
function initializeGlobalFeatures() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced button interactions with ripple effect
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Loading state
            if (this.classList.contains('btn-primary') || this.classList.contains('btn-secondary')) {
                this.style.opacity = '0.7';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 200);
            }
        });
    });
    
    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.product-card, .category-card, .floating-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
    
    // Add hover effects to navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add parallax effect to floating cards
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.floating-card');
        
        parallax.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            card.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function updateCartDisplay() {
    // Update cart count in navigation
    const cartCount = cartItems.length;
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach(link => {
        const existingBadge = link.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        if (cartCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = cartCount;
            badge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
            `;
            link.style.position = 'relative';
            link.appendChild(badge);
        }
    });
}

// Form validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e5e7eb';
        }
    });
    
    return isValid;
}

// Search functionality
function performSearch(query) {
    // This would typically make an API call or filter local data
    console.log('Searching for:', query);
    return [];
}

// Filter products
function filterProducts(products, filters) {
    return products.filter(product => {
        // Price filter
        if (filters.minPrice && product.price < filters.minPrice) return false;
        if (filters.maxPrice && product.price > filters.maxPrice) return false;
        
        // RAM filter
        if (filters.ram && filters.ram.length > 0) {
            if (!filters.ram.includes(product.ram)) return false;
        }
        
        // Storage filter
        if (filters.storage && filters.storage.length > 0) {
            if (!filters.storage.includes(product.storage)) return false;
        }
        
        // Brand filter
        if (filters.brand && filters.brand.length > 0) {
            if (!filters.brand.includes(product.brand)) return false;
        }
        
        return true;
    });
}

// Sort products
function sortProducts(products, sortBy) {
    switch(sortBy) {
        case 'price-low':
            return products.sort((a, b) => a.price - b.price);
        case 'price-high':
            return products.sort((a, b) => b.price - a.price);
        case 'newest':
            return products.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'popular':
            return products.sort((a, b) => b.rating - a.rating);
        default:
            return products;
    }
}

// Export functions for global access
window.addToCompare = addToCompare;
window.removeFromCompare = removeFromCompare;
window.navigateToCategory = navigateToCategory;
window.navigateToGuidedFilters = navigateToGuidedFilters;
window.navigateToComparison = navigateToComparison;
window.viewProduct = viewProduct;
window.changeImage = changeImage;
window.toggleAllSpecs = toggleAllSpecs;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.continueShopping = continueShopping;
window.clearCart = clearCart;
window.proceedToDelivery = proceedToDelivery;
window.showSection = showSection;
window.removeFavorite = removeFavorite;
window.clearFavorites = clearFavorites;
