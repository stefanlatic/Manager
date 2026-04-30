import {defineStore} from "pinia";
import {ref} from "vue";

const useAuthStore = defineStore('auth', () => {
    const user = ref(null);

    const flashMessage = ref(null);

    const checked = ref(false);

    function setFlashMessage(message) {
        flashMessage.value = message;
        setTimeout(() => {
            flashMessage.value = null;
        }, 3000);
    }

    const register = async (username,email,password) => {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({username,email,password})
        });

        if (response.ok) {
            const data = await response.json();
           
        }else {
            user.value = null;
            throw new Error('Registration failed');
        }
    }

const me = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/me', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            user.value = data.user;
        } else {
            user.value = null;
        }
    } catch (e) {
        user.value = null;
        console.warn('Could not reach server:', e.message);
    } finally {
        checked.value = true;
    }
}

    const logout = async () => {
        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            user.value = null;
        } else {
            throw new Error('Logout failed');
        }
    }


    const login = async (email,password) => {
        console.log('Front', email, password);
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({email,password})
        });

        if (response.ok) {
            const data = await response.json(); // {user: {username,email}}
            user.value = data.user;
            checked.value = true;
        }else {
            user.value = null;
            checked.value = true;
            throw new Error('Login failed');
        }
    }

    return {
        user, register, flashMessage, setFlashMessage, login, checked, me, logout
    }
});



export default useAuthStore;