const baseUrl = import.meta.env.VITE_API_BASE
class ApiClient {
    constructor() {
        this.baseUrl = baseUrl
    }
    getToken() {
        return localStorage.getItem('pfc-token')
    }

    async fetchApi(endpoint, method = 'GET', body = null) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': true
            }
            const token = this.getToken();
            if(token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            })

            const data = await res.json();
            if(!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            return data;
        } catch(error) {
            console.error("Backend not reachable", endpoint, error.message);
            throw error;
        }
    }

    login(email, password) {
        return this.fetchApi(
            '/auth/signin', 
            'POST', 
            {email, password})
    }
    register(name, email, password) {
        return this.fetchApi(
            '/auth/signup',
            'POST',
            {name, email, password}
        )
    }
}

export const api = new ApiClient();