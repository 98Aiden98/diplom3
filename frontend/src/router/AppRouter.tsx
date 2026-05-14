import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { getApiErrorMessage } from '../api/axios';
import { AppLayout } from '../components/layout/AppLayout';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AppointmentsPage } from '../pages/admin/AppointmentsPage';
import { DoctorsPage } from '../pages/admin/DoctorsPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { ServicesPage } from '../pages/admin/ServicesPage';
import { SpecializationsPage } from '../pages/admin/SpecializationsPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DoctorAppointmentsPage } from '../pages/doctor/DoctorAppointmentsPage';
import { DoctorDashboard } from '../pages/doctor/DoctorDashboard';
import { PatientMedicalCardPage } from '../pages/doctor/PatientMedicalCardPage';
import { PatientAppointmentsPage } from '../pages/patient/PatientAppointmentsPage';
import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { PatientRecordsPage } from '../pages/patient/PatientRecordsPage';
import { CreateAppointmentPage } from '../pages/registrar/CreateAppointmentPage';
import { PatientsPage } from '../pages/registrar/PatientsPage';
import { RegistrarDashboard } from '../pages/registrar/RegistrarDashboard';
import { SchedulePage } from '../pages/registrar/SchedulePage';
import { DoctorProfilePage } from '../pages/shared/DoctorProfilePage';
import { useAuthStore } from '../store/authStore';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

function DashboardRedirect() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const target =
    user.role === 'ADMIN'
      ? '/admin'
      : user.role === 'REGISTRAR'
        ? '/registrar'
        : user.role === 'DOCTOR'
          ? '/doctor'
          : '/patient';

  return <Navigate to={target} replace />;
}

function AuthBootstrap() {
  const { token, user, setUser, logout, initialized, setInitialized } = useAuthStore();

  useEffect(() => {
    if (!token) {
      setInitialized(true);
      return;
    }

    if (initialized && user) {
      return;
    }

    authApi
      .getMe()
      .then((profile) => {
        setUser(profile);
        setInitialized(true);
      })
      .catch((error) => {
        logout();
        toast.error(getApiErrorMessage(error));
      });
  }, [initialized, logout, setInitialized, setUser, token, user]);

  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardRedirect />} />
            <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />

            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/doctors" element={<DoctorsPage />} />
              <Route path="/admin/specializations" element={<SpecializationsPage />} />
              <Route path="/admin/services" element={<ServicesPage />} />
              <Route path="/admin/appointments" element={<AppointmentsPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
            </Route>

            <Route element={<RoleRoute roles={['REGISTRAR']} />}>
              <Route path="/registrar" element={<RegistrarDashboard />} />
              <Route path="/registrar/patients" element={<PatientsPage />} />
              <Route path="/registrar/appointments/new" element={<CreateAppointmentPage />} />
              <Route path="/registrar/schedule" element={<SchedulePage />} />
            </Route>

            <Route element={<RoleRoute roles={['DOCTOR']} />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
              <Route path="/doctor/patients/:patientId" element={<PatientMedicalCardPage />} />
            </Route>

            <Route element={<RoleRoute roles={['PATIENT']} />}>
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
              <Route path="/patient/records" element={<PatientRecordsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
