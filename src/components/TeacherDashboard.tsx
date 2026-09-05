import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  Fish,
  Utensils,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldAlert,
  BellRing,
  BarChart3,
} from 'lucide-react';
import { StructuredNutritionLog, UserRole } from '../types';
import { NotificationDirectivesView } from './NotificationDirectivesView';

interface TeacherDashboardProps {
  logs: StructuredNutritionLog[];
  loading: boolean;
  userRole: UserRole;
  onRefresh?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  logs,
  loading,
  userRole,
}) => {
  const [dashboardView, setDashboardView] = useState<'overview' | 'notifications'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [nutrientFilter, setNutrientFilter] = useState<string>('all');

  // Compute Aggregates
  const totalSessions = logs.length;
  
  // Unique students count
  const uniqueStudents = useMemo(() => {
    const ids = new Set(logs.map((l) => l.student_id));
    return ids.size;
  }, [logs]);

  // Nutrient deficit distribution
  const nutrientDeficitCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Protein: 0,
      Natrium: 0,
      Karbohidrat: 0,
      Lemak: 0,
    };
    logs.forEach((log) => {
      const key = Object.keys(counts).find((k) =>
        log.selected_nutrient.toLowerCase().includes(k.toLowerCase())
      );
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      } else {
        counts[log.selected_nutrient] = (counts[log.selected_nutrient] || 0) + 1;
      }
    });
    return counts;
  }, [logs]);

  // Favorite coastal solutions
  const coastalSolutionsRank = useMemo(() => {
    const ranks: Record<string, number> = {};
    logs.forEach((log) => {
      if (log.chosen_local_solution) {
        ranks[log.chosen_local_solution] = (ranks[log.chosen_local_solution] || 0) + 1;
      }
    });
    return Object.entries(ranks).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5);
  }, [logs]);

  // Most frequent snacks/foods investigated
  const popularSnacks = useMemo(() => {
    const snackCounts: Record<string, number> = {};
    logs.forEach((log) => {
      if (log.food_item) {
        snackCounts[log.food_item] = (snackCounts[log.food_item] || 0) + 1;
      }
    });
    return Object.entries(snackCounts).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 4);
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.food_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.chosen_local_solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.student_name && log.student_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesNutrient =
        nutrientFilter === 'all' ||
        log.selected_nutrient.toLowerCase().includes(nutrientFilter.toLowerCase());

      return matchesSearch && matchesNutrient;
    });
  }, [logs, searchTerm, nutrientFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = [
      'Waktu',
      'Student ID',
      'Nama Siswa',
      'Makanan Kemasan',
      'Zat Gizi Diselidiki',
      '% AKG Kemasan',
      '% Defisit Gizi',
      'Solusi Pangan Pesisir',
      'Status Seimbang',
    ];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.student_id}"`,
      `"${l.student_name || '-'}"`,
      `"${l.food_item}"`,
      `"${l.selected_nutrient}"`,
      l.akg_percentage,
      l.deficiency_percentage,
      `"${l.chosen_local_solution}"`,
      l.balanced_status ? 'Seimbang' : 'Belum Seimbang',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ringkasan_gizi_kelas_pesisir_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If user is not teacher or admin, display RBAC guard message
  if (userRole !== 'teacher' && userRole !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto my-8 p-8 bg-amber-50 rounded-3xl border-4 border-[#1A365D] shadow-[6px_6px_0px_#1A365D] text-center">
        <div className="w-16 h-16 bg-[#FF6B6B] text-white rounded-2xl border-3 border-[#1A365D] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1A365D]">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#1A365D] uppercase font-display mb-2">
          Hak Akses Terbatas (Role: Siswa)
        </h2>
        <p className="text-sm font-bold text-slate-700 max-w-lg mx-auto mb-6">
          Sesuai standar RBAC, halaman Dashboard Agregat Kelas hanya dapat diakses oleh akun dengan peran <strong>Guru PJOK</strong> atau <strong>Admin</strong>. Siswa hanya dapat melihat piring dan jurnal makan pribadi miliknya.
        </p>
        <div className="inline-block p-4 bg-white rounded-2xl border-2 border-[#1A365D] text-xs font-semibold text-slate-600">
          💡 <em>Tips Uji Coba:</em> Kamu dapat beralih ke mode <strong>Guru</strong> melalui menu profil di bilah navigasi atas untuk melihat ringkasan data kelas.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#E0F2F1] p-6 sm:p-8 rounded-3xl border-4 border-[#1A365D] shadow-[6px_6px_0px_#1A365D] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#00796B] text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
                Portal Guru PJOK • RBAC Authorized
              </span>
              <span className="px-2.5 py-1 bg-amber-300 text-[#1A365D] rounded-xl text-xs font-black uppercase border-2 border-[#1A365D]">
                Kelas 6 SD Pesisir
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A365D] uppercase font-display tracking-tight">
              Ringkasan Agregat Nutrisi & Tren Makanan Siswa
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#004D40] mt-1">
              Data terstruktur dari sesi refleksi kemasan (Langkah 4) yang tersinkronisasi di Firestore koleksi <code className="bg-white/80 px-1.5 py-0.5 rounded border border-[#1A365D]">nutrition_logs</code>.
            </p>
          </div>

          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4DB6AC] hover:bg-[#00796B] disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Ekspor CSV Kelas
          </button>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D]">
        <button
          id="dashboard-tab-overview-btn"
          onClick={() => setDashboardView('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            dashboardView === 'overview'
              ? 'bg-[#00796B] text-white shadow-[2px_2px_0px_#1A365D]'
              : 'text-slate-600 hover:text-[#1A365D] hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analisis & Log Gizi Kelas</span>
        </button>

        <button
          id="dashboard-tab-notifications-btn"
          onClick={() => setDashboardView('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            dashboardView === 'notifications'
              ? 'bg-[#E65100] text-white shadow-[2px_2px_0px_#1A365D]'
              : 'text-slate-600 hover:text-[#1A365D] hover:bg-slate-50'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Direktif Notifikasi Eksternal & Email</span>
          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] font-black border border-amber-300">
            API Directives
          </span>
        </button>
      </div>

      {dashboardView === 'notifications' ? (
        <NotificationDirectivesView />
      ) : (
        <>
          {/* Metric Cards Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9C4] border-2 border-[#1A365D] flex items-center justify-center text-[#1A365D] shadow-[2px_2px_0px_#1A365D]">
            <Utensils className="w-6 h-6 text-[#1A365D]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Analisis Selesai</p>
            <p className="text-2xl font-black text-[#1A365D] font-display">{totalSessions} Sesi</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] border-2 border-[#1A365D] flex items-center justify-center text-[#2E7D32] shadow-[2px_2px_0px_#1A365D]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Siswa Berpartisipasi</p>
            <p className="text-2xl font-black text-[#1A365D] font-display">{uniqueStudents} Siswa</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEBEE] border-2 border-[#1A365D] flex items-center justify-center text-[#C62828] shadow-[2px_2px_0px_#1A365D]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Defisit Paling Sering</p>
            <p className="text-lg font-black text-[#C62828] font-display truncate max-w-[130px]">
              {Object.entries(nutrientDeficitCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || 'Protein'}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2F1] border-2 border-[#1A365D] flex items-center justify-center text-[#00796B] shadow-[2px_2px_0px_#1A365D]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Kepatuhan Solusi Pesisir</p>
            <p className="text-2xl font-black text-[#00796B] font-display">
              {totalSessions > 0 ? Math.round((logs.filter((l) => l.balanced_status).length / totalSessions) * 100) : 100}%
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Insights: Popular Foods & Solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequent Packaged Snacks */}
        <div className="bg-white p-6 rounded-3xl border-3 border-[#1A365D] shadow-[5px_5px_0px_#1A365D]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="text-lg font-black uppercase text-[#1A365D] font-display">
              Tren Makanan Kemasan Terbanyak Dianalisis
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-4 font-semibold">
            Makanan yang paling sering dicatat oleh siswa saat jam istirahat sekolah pesisir:
          </p>

          {popularSnacks.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center text-xs font-bold text-slate-500">
              Belum ada data jajanan yang tersimpan.
            </div>
          ) : (
            <div className="space-y-3">
              {popularSnacks.map(([snack, count], idx) => (
                <div
                  key={snack}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border-2 border-[#1A365D]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm text-[#1A365D]">{snack}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-white text-[#1A365D] text-xs font-black rounded-xl border border-[#1A365D]">
                    {count} kali dianalisis
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Coastal Food Solutions Chosen */}
        <div className="bg-white p-6 rounded-3xl border-3 border-[#1A365D] shadow-[5px_5px_0px_#1A365D]">
          <div className="flex items-center gap-2 mb-4">
            <Fish className="w-5 h-5 text-[#00796B]" />
            <h3 className="text-lg font-black uppercase text-[#1A365D] font-display">
              Pilihan Pangan Pesisir Terfavorit Siswa
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-4 font-semibold">
            Pilihan lauk/sayur lokal pesisir yang dipilih siswa untuk menutupi defisit gizi (Isi Piringku):
          </p>

          {coastalSolutionsRank.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center text-xs font-bold text-slate-500">
              Belum ada solusi pangan pesisir yang dipilih.
            </div>
          ) : (
            <div className="space-y-3">
              {coastalSolutionsRank.map(([food, count], idx) => (
                <div
                  key={food}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#E0F2F1]/60 border-2 border-[#1A365D]"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#00796B]" />
                    <span className="font-black text-sm text-[#1A365D] truncate max-w-[240px]">
                      {food}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-[#81C784] text-[#1A365D] text-xs font-black rounded-xl border border-[#1A365D]">
                    {count} siswa memilih
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Structured Nutrition Logs Table */}
      <div className="bg-white p-6 rounded-3xl border-3 border-[#1A365D] shadow-[5px_5px_0px_#1A365D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black uppercase text-[#1A365D] font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Tabel Log Terstruktur Firestore (<code className="text-xs text-[#00796B]">nutrition_logs</code>)
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Menampilkan {filteredLogs.length} dari {logs.length} catatan refleksi sesi belajar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-logs-input"
                type="text"
                placeholder="Cari makanan / siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs font-bold rounded-xl border-2 border-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#4DB6AC] w-48 sm:w-56"
              />
            </div>

            {/* Filter by Nutrient */}
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="nutrient-filter-select"
                value={nutrientFilter}
                onChange={(e) => setNutrientFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs font-bold rounded-xl border-2 border-[#1A365D] bg-white focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Zat Gizi</option>
                <option value="protein">Protein</option>
                <option value="natrium">Natrium</option>
                <option value="karbohidrat">Karbohidrat</option>
                <option value="lemak">Lemak</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold">
            Memuat data terstruktur dari Firestore...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center">
            <Utensils className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-black text-[#1A365D]">Belum ada entri log yang cocok</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Setiap kali siswa menyelesaikan Langkah 4 di Asisten Gizi, data terstruktur akan langsung muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FFF9C4] border-2 border-[#1A365D] text-[#1A365D] font-black uppercase text-[10px] tracking-wider">
                  <th className="p-3">Waktu (Timestamp)</th>
                  <th className="p-3">Makanan Kemasan</th>
                  <th className="p-3">Zat Gizi Diselidiki</th>
                  <th className="p-3 text-center">% AKG</th>
                  <th className="p-3 text-center">% Defisit</th>
                  <th className="p-3">Solusi Pesisir Dipilih</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id || index}
                    className="hover:bg-amber-50/40 transition-colors border-b border-slate-200 font-medium"
                  >
                    <td className="p-3 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(log.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-black text-[#1A365D]">
                      {log.food_item}
                      {log.student_name && (
                        <span className="block text-[10px] font-bold text-slate-500">
                          Siswa: {log.student_name}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-300">
                        {log.selected_nutrient}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">
                      {log.akg_percentage}%
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-black ${
                          log.deficiency_percentage > 0
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {log.deficiency_percentage > 0 ? `-${log.deficiency_percentage}%` : 'Cukup'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#00796B]">
                      {log.chosen_local_solution}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.balanced_status ? 'Seimbang' : 'Kurang'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
