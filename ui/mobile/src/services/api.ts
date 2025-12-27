import axios from 'axios';
import Constants from 'expo-constants';

const extra = (Constants?.manifest ?? (Constants as any).expoConfig?.extra) ?? {};
const API_URL = extra.API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});
