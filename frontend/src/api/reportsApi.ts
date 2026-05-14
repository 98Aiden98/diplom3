import { api, unwrap } from './axios';

export const reportsApi = {
  getSummary: async (params?: Record<string, string>) =>
    unwrap<{
      patientsCount: number;
      doctorsCount: number;
      appointmentsTodayCount: number;
      completedAppointmentsCount: number;
      revenue: number;
    }>(await api.get('/reports/summary', { params })),

  getRevenue: async (params?: Record<string, string>) =>
    unwrap<{
      totalRevenue: number;
      byService: Record<string, number>;
      items: Array<{ id: number; date: string; service: { name: string; price: number } }>;
    }>(await api.get('/reports/revenue', { params })),

  getPopularServices: async (params?: Record<string, string>) =>
    unwrap<Array<{ serviceId: number; serviceName: string; count: number }>>(
      await api.get('/reports/popular-services', { params }),
    ),

  getDoctorsLoad: async (params?: Record<string, string>) =>
    unwrap<
      Array<{
        doctorId: number;
        doctorName: string;
        specialization: string;
        appointmentsCount: number;
        completedCount: number;
      }>
    >(await api.get('/reports/doctors-load', { params })),
};
