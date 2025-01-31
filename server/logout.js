let isLoggedIn = false;

// Function to update button visibility
function updateButtonVisibility() {
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const logoutButton = document.getElementById('logout-button');

    if (isLoggedIn) {
        loginButton.style.display = 'none'; // Hide login button
        signupButton.style.display = 'none'; // Hide signup button
        logoutButton.style.display = 'inline-block'; // Show logout button
    } else {
        loginButton.style.display = 'inline-block'; // Show login button
        signupButton.style.display = 'inline-block'; // Show signup button
        logoutButton.style.display = 'none'; // Hide logout button
    }
}

function login() {
    isLoggedIn = true;
    updateButtonVisibility();
}

function logout() {
    isLoggedIn = false;
    updateButtonVisibility();
}

// Initial button visibility setup
updateButtonVisibility();