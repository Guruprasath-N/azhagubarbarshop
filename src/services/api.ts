const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error);
    return null;
  }
}

export const ApiClient = {
  checkHealth: () => fetchApi<{ status: string }>('/health'),
  getSalons: () => fetchApi<{ success: boolean; salons: any[] }>('/salons'),
  getServices: () => fetchApi<{ success: boolean; services: any[] }>('/services'),
  getStaff: () => fetchApi<{ success: boolean; staff: any[] }>('/staff'),
  getAppointments: () => fetchApi<{ success: boolean; appointments: any[] }>('/appointments'),
  login: (credentials: { identifier: string; password?: string }) =>
    fetchApi<{ success: boolean; token?: string; user?: any; error?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  createAppointment: (payload: any) =>
    fetchApi<{ success: boolean; appointment?: any; error?: string }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  cancelAppointment: (appointmentId: string, actorId: string) =>
    fetchApi<{ success: boolean; error?: string }>('/appointments/cancel', {
      method: 'POST',
      body: JSON.stringify({ appointment_id: appointmentId, actor_id: actorId })
    })
};
