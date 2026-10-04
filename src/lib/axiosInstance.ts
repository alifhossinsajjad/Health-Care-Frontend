import axios from 'axios';

// Base URL সেট করা (.env ফাইল থেকে আসবে)
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: প্রতিটি API কলের আগে এটি রান করবে
axiosInstance.interceptors.request.use(
  (config) => {
    // LocalStorage বা Cookies থেকে টোকেন নেওয়া
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    // টোকেন থাকলে সেটি Authorization হেডারে যুক্ত করে দেওয়া
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: ব্যাকএন্ড থেকে রেসপন্স আসার পর এটি রান করবে
axiosInstance.interceptors.response.use(
  (response) => {
    // ডেটা সরাসরি রিটার্ন করা যাতে কম্পোনেন্টে response.data.data না লিখতে হয়
    return response;
  },
  (error) => {
    // গ্লোবাল এরর হ্যান্ডলিং (যেমন: 401 Unauthorized হলে লগিন পেজে পাঠানো)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Unauthorized! Redirecting to login...');
      // TODO: Logout logic or redirect to /login
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('accessToken');
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
