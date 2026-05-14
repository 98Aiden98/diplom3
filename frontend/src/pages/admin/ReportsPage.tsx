import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../api/axios';
import { reportsApi } from '../../api/reportsApi';
import { DoctorLink } from '../../components/doctors/DoctorLink';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { formatCurrency } from '../../utils/format';

export function ReportsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [summary, setSummary] = useState<{
    patientsCount: number;
    doctorsCount: number;
    appointmentsTodayCount: number;
    completedAppointmentsCount: number;
    revenue: number;
  } | null>(null);
  const [popularServices, setPopularServices] = useState<
    Array<{ serviceId: number; serviceName: string; count: number }>
  >([]);
  const [doctorsLoad, setDoctorsLoad] = useState<
    Array<{
      doctorId: number;
      doctorName: string;
      specialization: string;
      appointmentsCount: number;
      completedCount: number;
    }>
  >([]);

  const loadReports = async () => {
    try {
      const params = {
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      };

      const [summaryData, servicesData, loadData] = await Promise.all([
        reportsApi.getSummary(params),
        reportsApi.getPopularServices(params),
        reportsApi.getDoctorsLoad(params),
      ]);

      setSummary(summaryData);
      setPopularServices(servicesData);
      setDoctorsLoad(loadData);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <Input label="Период с" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          <Input label="Период по" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          <div className="flex items-end">
            <Button variant="secondary" onClick={loadReports} className="w-full sm:w-auto">
              Обновить
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Пациенты', summary?.patientsCount ?? 0],
          ['Врачи', summary?.doctorsCount ?? 0],
          ['Сегодня', summary?.appointmentsTodayCount ?? 0],
          ['Завершено', summary?.completedAppointmentsCount ?? 0],
          ['Выручка', formatCurrency(summary?.revenue ?? 0)],
        ].map(([label, value]) => (
          <Card key={label} className="rounded-[2rem]">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">{value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[2rem]">
          <h2 className="section-heading mb-4">Популярные услуги</h2>
          <Table
            data={popularServices}
            columns={[
              { title: 'Услуга', render: (item) => item.serviceName },
              { title: 'Количество', render: (item) => item.count },
            ]}
          />
        </Card>

        <Card className="rounded-[2rem]">
          <h2 className="section-heading mb-4">Загрузка врачей</h2>
          <Table
            data={doctorsLoad}
            columns={[
              {
                title: 'Врач',
                render: (item) => (
                  <DoctorLink doctorId={item.doctorId} fullName={item.doctorName} />
                ),
              },
              { title: 'Специальность', render: (item) => item.specialization },
              { title: 'Приёмов', render: (item) => item.appointmentsCount },
              { title: 'Завершено', render: (item) => item.completedCount },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
