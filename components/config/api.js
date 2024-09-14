import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configura a instância do Axios com a URL base da sua API
export const api = axios.create({
  baseURL: 'https://pi-4-back-end.onrender.com/api/v1',
  timeout: 10000, // Tempo limite de 10 segundos para a requisição
});

// Função para setar o token de autenticação no cabeçalho da API
export const setAuthHeader = async () => {
  try {
    // Recupera o token do AsyncStorage
    const token = await AsyncStorage.getItem('accessToken');
    
    if (token) {
      // Define o token no cabeçalho Authorization
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Token não encontrado. Por favor, faça login novamente.');
    }
  } catch (error) {
    console.error('Erro ao setar o token de autenticação:', error.message);
  }
};

// Interceptor para incluir o token em todas as requisições automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
