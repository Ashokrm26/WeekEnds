document.addEventListener('DOMContentLoaded', function() {
    // Initialize data in localStorage if not exists
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { id: 1, name: 'Admin', email: 'admin@weekends.com', password: 'admin123', isAdmin: true },
            { id: 2, name: 'John Doe', email: 'user@weekends.com', password: 'user123', isAdmin: false }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('movies')) {
        const defaultMovies = [
            {
                id: 1,
                title: 'Inception',
                poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
                genre: 'sci-fi',
                year: 2010,
                price: 12.99,
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
            },
            {
                id: 2,
                title: 'The Dark Knight',
                poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
                genre: 'action',
                year: 2008,
                price: 10.99,
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
            },
            {
                id: 3,
                title: 'Pulp Fiction',
                poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
                genre: 'drama',
                year: 1994,
                price: 9.99,
                description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
            }
        ];
        localStorage.setItem('movies', JSON.stringify(defaultMovies));
    }

    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const userDashboard = document.getElementById('user-dashboard');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    // Auth Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginAdmin = document.getElementById('login-admin');
    const registerName = document.getElementById('register-name');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    
    // User Dashboard Elements
    const genreSelect = document.getElementById('genre-select');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const cartBtn = document.getElementById('cart-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const moviesGrid = document.getElementById('movies-grid');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCount = document.getElementById('cart-count');
    
    // Admin Dashboard Elements
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');
    const addMovieBtn = document.getElementById('add-movie-btn');
    const adminMoviesGrid = document.getElementById('admin-movies-grid');
    const addUserBtn = document.getElementById('add-user-btn');
    const usersList = document.getElementById('users-list');
    const movieModal = document.getElementById('movie-modal');
    const userModal = document.getElementById('user-modal');
    const movieForm = document.getElementById('movie-form');
    const userForm = document.getElementById('user-form');
    
    // Movie Form Elements
    const movieModalTitle = document.getElementById('movie-modal-title');
    const movieId = document.getElementById('movie-id');
    const movieTitle = document.getElementById('movie-title');
    const moviePoster = document.getElementById('movie-poster');
    const movieGenre = document.getElementById('movie-genre');
    const movieYear = document.getElementById('movie-year');
    const moviePrice = document.getElementById('movie-price');
    const movieDescription = document.getElementById('movie-description');
    
    // User Form Elements
    const userModalTitle = document.getElementById('user-modal-title');
    const userId = document.getElementById('user-id');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userPassword = document.getElementById('user-password');
    const userIsAdmin = document.getElementById('user-is-admin');
    
    // Current User
    let currentUser = null;
    
    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            adminTabBtns.forEach(b => b.classList.remove('active'));
            adminTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Login Function
    loginBtn.addEventListener('click', () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();
        const isAdmin = loginAdmin.checked;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password && (isAdmin ? u.isAdmin : true));
        
        if (user) {
            currentUser = user;
            loginEmail.value = '';
            loginPassword.value = '';
            loginAdmin.checked = false;
            
            if (user.isAdmin) {
                authContainer.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                loadAdminMovies();
                loadUsers();
            } else {
                authContainer.classList.add('hidden');
                userDashboard.classList.remove('hidden');
                loadMovies();
                updateCartCount();
            }
        } else {
            alert('Invalid credentials or insufficient permissions');
        }
    });
    
    // Register Function
    registerBtn.addEventListener('click', () => {
        const name = registerName.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value.trim();
        
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users'));
        const emailExists = users.some(u => u.email === email);
        
        if (emailExists) {
            alert('Email already registered');
            return;
        }
        
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name,
            email,
            password,
            isAdmin: false
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        registerName.value = '';
        registerEmail.value = '';
        registerPassword.value = '';
        
        tabBtns[0].click();
    });
    
    // Load Movies for User
    function loadMovies(filterGenre = 'all', searchTerm = '') {
        const movies = JSON.parse(localStorage.getItem('movies'));
        moviesGrid.innerHTML = '';
        
        const filteredMovies = movies.filter(movie => {
            const genreMatch = filterGenre === 'all' || movie.genre === filterGenre;
            const searchMatch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              movie.description.toLowerCase().includes(searchTerm.toLowerCase());
            return genreMatch && searchMatch;
        });
        
        if (filteredMovies.length === 0) {
            moviesGrid.innerHTML = '<p class="no-movies">No movies found</p>';
            return;
        }
        
        filteredMovies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <span class="movie-genre">${movie.genre}</span>
                    <p class="movie-year">${movie.year}</p>
                    <p class="movie-price">$${movie.price.toFixed(2)}</p>
                    <p class="movie-description">${movie.description}</p>
                    <button class="add-to-cart" data-id="${movie.id}">Add to Cart</button>
                </div>
            `;
            moviesGrid.appendChild(movieCard);
        });
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                addToCart(parseInt(btn.getAttribute('data-id')));
            });
        });
    }
    
    // Load Movies for Admin
    function loadAdminMovies() {
        const movies = JSON.parse(localStorage.getItem('movies'));
        adminMoviesGrid.innerHTML = '';
        
        if (movies.length === 0) {
            adminMoviesGrid.innerHTML = '<p class="no-movies">No movies added yet</p>';
            return;
        }
        
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <span class="movie-genre">${movie.genre}</span>
                    <p class="movie-year">${movie.year}</p>
                    <p class="movie-price">$${movie.price.toFixed(2)}</p>
                    <p class="movie-description">${movie.description}</p>
                    <div class="admin-movie-actions">
                        <button class="btn btn-secondary edit-movie" data-id="${movie.id}">Edit</button>
                        <button class="btn btn-danger delete-movie" data-id="${movie.id}">Delete</button>
                    </div>
                </div>
            `;
            adminMoviesGrid.appendChild(movieCard);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-movie').forEach(btn => {
            btn.addEventListener('click', () => {
                editMovie(parseInt(btn.getAttribute('data-id')));
            });
        });
        
        document.querySelectorAll('.delete-movie').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteMovie(parseInt(btn.getAttribute('data-id')));
            });
        });
    }
    
    // Load Users for Admin
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('users'));
        usersList.innerHTML = '';
        
        if (users.length === 0) {
            usersList.innerHTML = '<p class="no-users">No users registered yet</p>';
            return;
        }
        
        users.forEach(user => {
            if (user.id === currentUser.id) return; // Skip current admin
            
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-info">
                    <h4 class="user-name">${user.name}</h4>
                    <p class="user-email">${user.email}</p>
                    <span class="user-role">${user.isAdmin ? 'Admin' : 'User'}</span>
                </div>
                <div class="user-actions">
                    <button class="btn btn-secondary edit-user" data-id="${user.id}">Edit</button>
                    <button class="btn btn-danger delete-user" data-id="${user.id}">Delete</button>
                </div>
            `;
            usersList.appendChild(userItem);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', () => {
                editUser(parseInt(btn.getAttribute('data-id')));
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteUser(parseInt(btn.getAttribute('data-id')));
            });
        });
    }
    
    // Add to Cart Function
    function addToCart(movieId) {
        const movies = JSON.parse(localStorage.getItem('movies'));
        const cart = JSON.parse(localStorage.getItem('cart'));
        const movie = movies.find(m => m.id === movieId);
        
        if (!movie) return;
        
        const existingItem = cart.find(item => item.id === movieId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: movie.id,
                title: movie.title,
                poster: movie.poster,
                price: movie.price,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${movie.title} added to cart`);
    }
    
    // Update Cart Count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Show Cart Modal
    cartBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '0';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.poster}" alt="${item.title}" class="cart-item-poster" onerror="this.src='https://via.placeholder.com/60x90?text=No+Poster'">
                    <div>
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        cartModal.classList.remove('hidden');
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                updateCartItem(parseInt(btn.getAttribute('data-id')), -1);
            });
        });
        
        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                updateCartItem(parseInt(btn.getAttribute('data-id')), 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                removeCartItem(parseInt(btn.getAttribute('data-id')));
            });
        });
    });
    
    // Update Cart Item Quantity
    function updateCartItem(movieId, change) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const item = cart.find(item => item.id === movieId);
        
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        cartBtn.click(); // Refresh cart view
        updateCartCount();
    }
    
    // Remove Cart Item
    function removeCartItem(movieId) {
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart = cart.filter(item => item.id !== movieId);
        localStorage.setItem('cart', JSON.stringify(cart));
        cartBtn.click(); // Refresh cart view
        updateCartCount();
    }
    
    // Checkout Function
    checkoutBtn.addEventListener('click', () => {
        localStorage.setItem('cart', JSON.stringify([]));
        cartModal.classList.add('hidden');
        updateCartCount();
        showNotification('Purchase completed successfully!');
    });
    
    // Close Modal
    closeModal.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });
    
    // Close Modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal || e.target === movieModal || e.target === userModal) {
            cartModal.classList.add('hidden');
            movieModal.classList.add('hidden');
            userModal.classList.add('hidden');
        }
    });
    
    // Filter Movies by Genre
    genreSelect.addEventListener('change', () => {
        loadMovies(genreSelect.value, searchInput.value.trim());
    });
    
    // Search Movies
    searchBtn.addEventListener('click', () => {
        loadMovies(genreSelect.value, searchInput.value.trim());
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadMovies(genreSelect.value, searchInput.value.trim());
        }
    });
    
    // Logout Function
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        userDashboard.classList.add('hidden');
        authContainer.classList.remove('hidden');
    });
    
    adminLogoutBtn.addEventListener('click', () => {
        currentUser = null;
        adminDashboard.classList.add('hidden');
        authContainer.classList.remove('hidden');
    });
    
    // Add New Movie
    addMovieBtn.addEventListener('click', () => {
        movieModalTitle.textContent = 'Add New Movie';
        movieForm.reset();
        movieId.value = '';
        movieModal.classList.remove('hidden');
    });
    
    // Edit Movie
    function editMovie(id) {
        const movies = JSON.parse(localStorage.getItem('movies'));
        const movie = movies.find(m => m.id === id);
        
        if (!movie) return;
        
        movieModalTitle.textContent = 'Edit Movie';
        movieId.value = movie.id;
        movieTitle.value = movie.title;
        moviePoster.value = movie.poster;
        movieGenre.value = movie.genre;
        movieYear.value = movie.year;
        moviePrice.value = movie.price;
        movieDescription.value = movie.description;
        
        movieModal.classList.remove('hidden');
    }
    
    // Save Movie (Add/Edit)
    movieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = movieId.value ? parseInt(movieId.value) : 0;
        const title = movieTitle.value.trim();
        const poster = moviePoster.value.trim();
        const genre = movieGenre.value;
        const year = parseInt(movieYear.value);
        const price = parseFloat(moviePrice.value);
        const description = movieDescription.value.trim();
        
        if (!title || !poster || !genre || !year || !price || !description) {
            alert('Please fill in all fields');
            return;
        }
        
        const movies = JSON.parse(localStorage.getItem('movies'));
        
        if (id) {
            // Edit existing movie
            const index = movies.findIndex(m => m.id === id);
            if (index !== -1) {
                movies[index] = { id, title, poster, genre, year, price, description };
            }
        } else {
            // Add new movie
            const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
            movies.push({ id: newId, title, poster, genre, year, price, description });
        }
        
        localStorage.setItem('movies', JSON.stringify(movies));
        movieModal.classList.add('hidden');
        loadAdminMovies();
        showNotification(`Movie ${id ? 'updated' : 'added'} successfully`);
    });
    
    // Delete Movie
    function deleteMovie(id) {
        if (!confirm('Are you sure you want to delete this movie?')) return;
        
        const movies = JSON.parse(localStorage.getItem('movies'));
        const updatedMovies = movies.filter(m => m.id !== id);
        
        localStorage.setItem('movies', JSON.stringify(updatedMovies));
        loadAdminMovies();
        showNotification('Movie deleted successfully');
    }
    
    // Add New User
    addUserBtn.addEventListener('click', () => {
        userModalTitle.textContent = 'Add New User';
        userForm.reset();
        userId.value = '';
        userIsAdmin.checked = false;
        userModal.classList.remove('hidden');
    });
    
    // Edit User
    function editUser(id) {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.id === id);
        
        if (!user) return;
        
        userModalTitle.textContent = 'Edit User';
        userId.value = user.id;
        userName.value = user.name;
        userEmail.value = user.email;
        userPassword.value = '';
        userIsAdmin.checked = user.isAdmin;
        
        userModal.classList.remove('hidden');
    }
    
    // Save User (Add/Edit)
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = userId.value ? parseInt(userId.value) : 0;
        const name = userName.value.trim();
        const email = userEmail.value.trim();
        const password = userPassword.value.trim();
        const isAdmin = userIsAdmin.checked;
        
        if (!name || !email || (!id && !password)) {
            alert('Please fill in all required fields');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Check if email already exists (for new users or when email is changed)
        if ((!id || users.find(u => u.id === id).email !== email) && users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }
        
        if (id) {
            // Edit existing user
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                const updatedUser = {
                    id,
                    name,
                    email,
                    password: password ? password : users[index].password,
                    isAdmin
                };
                users[index] = updatedUser;
            }
        } else {
            // Add new user
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            users.push({ id: newId, name, email, password, isAdmin });
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        userModal.classList.add('hidden');
        loadUsers();
        showNotification(`User ${id ? 'updated' : 'added'} successfully`);
    });
    
    // Delete User
    function deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        const users = JSON.parse(localStorage.getItem('users'));
        const updatedUsers = users.filter(u => u.id !== id);
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        loadUsers();
        showNotification('User deleted successfully');
    }
    
    // Show Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    
    // Add some CSS for notifications
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slide-in 0.5s ease-out;
        }
        
        .fade-out {
            animation: fade-out 0.5s ease-out;
        }
        
        @keyframes slide-in {
            from { bottom: -50px; opacity: 0; }
            to { bottom: 20px; opacity: 1; }
        }
        
        @keyframes fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // Initialize
    if (currentUser) {
        authContainer.classList.add('hidden');
        if (currentUser.isAdmin) {
            adminDashboard.classList.remove('hidden');
            loadAdminMovies();
            loadUsers();
        } else {
            userDashboard.classList.remove('hidden');
            loadMovies();
            updateCartCount();
        }
    }
});