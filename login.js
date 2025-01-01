// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1vyqeMZF6EgJSnCc8i4h9Kg3oCrT5ius",
    authDomain: "login-asksphere.firebaseapp.com",
    projectId: "login-asksphere",
    storageBucket: "login-asksphere.firebasestorage.app",
    messagingSenderId: "728278556897",
    appId: "1:728278556897:web:d71d1d862d318404e1d7a0",
    clientId: "728278556897-g7plpmaeqcqpiq067iqpkd3d1ttj6hbj.apps.googleusercontent.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function handleSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed in:', user);
            // Redirect or update UI
            window.location.href = 'setup.html';
        })
        .catch((error) => {
            console.error('Error signing in:', error.message);
            alert(error.message);
        });
}
//import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function loginWithGoogle() {
    console.log('Google login clicked');

    // Initialize Google OAuth login flow
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const clientId = '728278556897-g7plpmaeqcqpiq067iqpkd3d1ttj6hbj.apps.googleusercontent.com'; // Replace with your Google Client ID
    const redirectUri = 'https://login-asksphere.firebaseapp.com/__/auth/handler'; // Replace with your redirect URI
    const scope = 'email profile';
    const responseType = 'token';

    const authUrl = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    // Redirect to Google's OAuth page
    window.location.href = authUrl;
}

// Firebase initialization code here...
//new function
async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const profilePic = document.getElementById('profilePic').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        // Create user with email and password
        const userCredential = await firebase.auth().createUser signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user details in Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            username: username,
            profilePic: profilePic,
            email: email
        });

        alert('User  signed up successfully!');
        // Optionally redirect or clear the form
    } catch (error) {
        console.error("Error signing up: ", error);
        alert(error.message);
    }
}
//new function end
function loginWithWeb3() {
    console.log('Web3 login clicked');

    if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask or Web3 wallet is not installed.');
        return;
    }

    // Request accounts from the user's wallet
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            const userAddress = accounts[0];
            console.log('Connected with Web3 address:', userAddress);

            // Implement backend integration to link the wallet address with the user's account
            fetch('/api/web3-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: userAddress })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Web3 login failed.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Web3 login successful:', data);
                // Handle successful login
            })
            .catch(error => {
                console.error('Error during Web3 login:', error);
            });
        })
        .catch(error => {
            console.error('Error connecting to Web3 wallet:', error);
        });
}
document.getElementById('loginForm').addEventListener('submit', handleSubmit);
document.getElementById('googleLogin').addEventListener('click', loginWithGoogle);
document.getElementById('web3Login').addEventListener('click', loginWithWeb3);

