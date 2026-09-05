import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  ShieldCheck,
  Send,
  Code,
  Copy,
  Check,
  AlertOctagon,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  KeyRound,
  FileJson,
  Activity,
  Info,
} from 'lucide-react';
import { NotificationEventType, NotificationSeverity } from '../types';

export const NotificationDirectivesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directive' | 'test' | 'schema'>('directive');
  const [testAlertType, setTestAlertType] = useState<NotificationEventType>('CRITICAL_SODIUM_ALERT');
  const [testEmail, setTestEmail] = useState<string>('guru.pjok@sdnegeri-pesisir.sch.id');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Fetch audit logs on mount
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/notifications/audit');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.history || []);
      }
    } catch (e) {
      console.warn('Could not fetch notification audit logs:', e);
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: testAlertType,
          testEmail: testEmail,
        }),
      });
      const data = await res.json();
      setTestResult(data);
      fetchAuditLogs();
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Gagal mengirimkan notifikasi uji coba',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const samplePayloadJson = JSON.stringify(
    {
      notificationId: 'notif_1725501234_abc89f',
      timestamp: '2026-09-05T03:15:00.000Z',
      eventType: 'CRITICAL_SODIUM_ALERT',
      severity: 'CRITICAL',
      recipient: {
        email: 'guru.pjok@sdnegeri-pesisir.sch.id',
        role: 'teacher',
        recipientName: 'Guru PJOK / Pembina UKS',
      },
      student: {
        id: 'siswa_pesisir_001',
        name: 'Budi Santoso',
        schoolClass: 'Kelas 6 SD Pesisir',
      },
      journalEntry: {
        foodName: 'Keripik Asin Renyah Ekstra Gurih',
        selectedNutrient: 'Natrium',
        akgPercentage: 42,
        deficiencyPercentage: 0,
        excessPercentage: 12,
        coastalSolutionChosen: 'Sayur Daun Kelor Bening & Air Putih',
        nutritionalSummary: {
          natrium: { amount: 640, unit: 'mg', akgPercent: 42 },
          protein: { amount: 2, unit: 'g', akgPercent: 3 },
          karbohidrat: { amount: 22, unit: 'g', akgPercent: 16 },
        },
      },
      actionRecommendation: {
        summary: 'Kandungan natrium kemasan mencapai 42% AKG (melebihi batas aman 30% untuk 1x makan).',
        pedagogicalAdvice: 'Imbau siswa minum air putih dan pilih lauk berkuah segar saat makan siang.',
        suggestedAction: 'IMMEDIATE_HYDRATION',
      },
      metadata: {
        sourceApp: 'Sahabat Sehat',
        version: '1.2.0',
        framework: 'Kurikulum Merdeka PJOK Fase C (Kelas 6 SD Pesisir)',
        dispatchedBy: 'auth_uid_siswa',
      },
    },
    null,
    2
  );

  const sampleCurl = `curl -X POST "https://your-cloudrun-url.run.app/api/notify-external" \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "foodName": "Keripik Asin Renyah",
    "selectedNutrient": "Natrium",
    "akgPercentage": 42,
    "deficiencyPercentage": 0,
    "excessPercentage": 12,
    "coastalSolutionChosen": "Sayur Bening Daun Kelor & Air Putih",
    "studentName": "Budi Santoso",
    "schoolClass": "Kelas 6 SD Pesisir"
  }'`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 bg-[#FFF9C4] rounded-3xl border-4 border-[#1A365D] shadow-[6px_6px_0px_#1A365D] relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#E65100] text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] shadow-[2px_2px_0px_#1A365D] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                Direktif Integrasi Eksternal
              </span>
              <span className="px-2.5 py-1 bg-white text-[#1A365D] rounded-xl text-xs font-black border-2 border-[#1A365D]">
                Spesifikasi API v1.2.0
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A365D] uppercase font-display tracking-tight">
              Sistem Notifikasi Eksternal & Peringatan Gizi
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 max-w-2xl">
              Memfasilitasi pemberitahuan otomatis ke guru PJOK, pembina UKS, atau sistem informasi eksternal sekolah saat terdeteksi jenis entri makanan tertentu (misal: <strong>Natrium Kritis</strong> atau <strong>Defisit Protein Signifikan</strong>).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/90 p-3 rounded-2xl border-2 border-[#1A365D] text-xs font-bold text-[#1A365D]">
            <ShieldCheck className="w-5 h-5 text-[#00796B]" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Kredensial API</div>
              <div>Zero-Hardcoding (Cloud Run Env)</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t-2 border-[#1A365D]/20">
          <button
            id="subtab-directive-btn"
            onClick={() => setActiveTab('directive')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] transition-all cursor-pointer ${
              activeTab === 'directive'
                ? 'bg-[#00796B] text-white shadow-[2px_2px_0px_#1A365D]'
                : 'bg-white hover:bg-slate-100 text-[#1A365D]'
            }`}
          >
            📋 Spesifikasi Direktif
          </button>
          <button
            id="subtab-test-btn"
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] transition-all cursor-pointer ${
              activeTab === 'test'
                ? 'bg-[#00796B] text-white shadow-[2px_2px_0px_#1A365D]'
                : 'bg-white hover:bg-slate-100 text-[#1A365D]'
            }`}
          >
            🚀 Uji Coba Pengiriman
          </button>
          <button
            id="subtab-schema-btn"
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A365D] transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-[#00796B] text-white shadow-[2px_2px_0px_#1A365D]'
                : 'bg-white hover:bg-slate-100 text-[#1A365D]'
            }`}
          >
            🧩 Skema Payload JSON
          </button>
        </div>
      </div>

      {/* TAB 1: SPECIFICATION & TRIGGER RULES */}
      {activeTab === 'directive' && (
        <div className="space-y-6">
          {/* Trigger Conditions Bento */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00796B]" />
              Aturan Pemicu Notifikasi (Trigger Rules)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alert 1 */}
              <div className="p-5 bg-white rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-[10px] font-black uppercase border border-rose-300 flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3 text-rose-600" />
                    CRITICAL_SODIUM_ALERT
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600 text-white rounded font-mono">
                    Severity: CRITICAL
                  </span>
                </div>
                <h5 className="font-black text-[#1A365D] text-sm">Peringatan Bahaya Natrium Tinggi</h5>
                <p className="text-xs text-slate-600 font-medium">
                  <strong>Pemicu:</strong> Natrium kemasan <code>&gt; 30% AKG</code> dalam 1x konsumsi atau <code>&gt; 400 mg</code>.
                </p>
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900 font-semibold">
                  💡 <strong>Rekomendasi Pedagogis:</strong> Instruksikan hidrasi air putih segera untuk meringankan beban osmotik ginjal siswa.
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-5 bg-white rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-[10px] font-black uppercase border border-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    HIGH_PROTEIN_DEFICIT
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-600 text-white rounded font-mono">
                    Severity: HIGH
                  </span>
                </div>
                <h5 className="font-black text-[#1A365D] text-sm">Defisit Protein Signifikan</h5>
                <p className="text-xs text-slate-600 font-medium">
                  <strong>Pemicu:</strong> Protein kemasan <code>&le; 10% AKG</code> (defisit &ge; 20% dari target ideal 30%).
                </p>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-semibold">
                  💡 <strong>Rekomendasi Pedagogis:</strong> Arahkan siswa melengkapi makan siang dengan sumber protein laut lokal (Ikan Kembung/Tongkol).
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-5 bg-white rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-[10px] font-black uppercase border border-purple-300">
                    EXCESS_SUGAR_CARB
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-600 text-white rounded font-mono">
                    Severity: MEDIUM
                  </span>
                </div>
                <h5 className="font-black text-[#1A365D] text-sm">Karbohidrat / Gula Olahan Berlebih</h5>
                <p className="text-xs text-slate-600 font-medium">
                  <strong>Pemicu:</strong> Karbohidrat kemasan <code>&gt; 35% AKG</code> dalam porsi kecil tanpa serat penyeimbang.
                </p>
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900 font-semibold">
                  💡 <strong>Rekomendasi Pedagogis:</strong> Edukasi pentingnya sayur daun kelor atau buah lokal untuk menstabilkan energi.
                </div>
              </div>

              {/* Alert 4 */}
              <div className="p-5 bg-white rounded-2xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-black uppercase border border-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    BALANCED_PLATE_LOGGED
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded font-mono">
                    Severity: INFO
                  </span>
                </div>
                <h5 className="font-black text-[#1A365D] text-sm">Jurnal Isi Piringku Berhasil Diseimbangkan</h5>
                <p className="text-xs text-slate-600 font-medium">
                  <strong>Pemicu:</strong> Siswa menuntaskan perhitungan selisih gizi dan memilih lauk pesisir untuk menutup defisit.
                </p>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-semibold">
                  💡 <strong>Rekomendasi Pedagogis:</strong> Berikan apresiasi portofolio belajar gizi PJOK Fase C.
                </div>
              </div>
            </div>
          </div>

          {/* Authentication & Credential Directives */}
          <div className="p-6 bg-white rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#00796B]" />
              Direktif Autentikasi & Pengelolaan Kredensial (Security Directives)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-[#1A365D] space-y-2">
                <div className="font-black text-[#1A365D] uppercase text-[11px] flex items-center gap-1.5">
                  <span>1. Inbound Authentication (Client &rarr; Server)</span>
                </div>
                <p>
                  Setiap panggilan ke endpoint <code>/api/notify-external</code> wajib menyertakan token Firebase ID pada header:
                </p>
                <code className="block p-2 bg-[#1A365D] text-[#81C784] rounded-lg font-mono text-[11px]">
                  Authorization: Bearer &lt;FIREBASE_ID_TOKEN&gt;
                </code>
                <p className="text-[11px] text-slate-500">
                  Server memverifikasi token JWT secara kriptografis terhadap Project ID Firebase.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-[#1A365D] space-y-2">
                <div className="font-black text-[#1A365D] uppercase text-[11px] flex items-center gap-1.5">
                  <span>2. Outbound Dispatch (Server &rarr; External Webhook)</span>
                </div>
                <p>
                  Permintaan keluar ke webhook pihak ketiga (SIM Sekolah / Email Relay) diautentikasi dengan:
                </p>
                <code className="block p-2 bg-[#1A365D] text-[#81C784] rounded-lg font-mono text-[11px]">
                  Authorization: Bearer &lt;NOTIFICATION_API_KEY&gt;
                </code>
                <p className="text-[11px] text-slate-500">
                  Kunci API tidak pernah terekspos ke browser; dimuat melalui Environment Variables Cloud Run.
                </p>
              </div>
            </div>

            {/* Environment Variables Table */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#1A365D]">
                Environment Variables Terdaftar (.env.example):
              </div>
              <div className="overflow-x-auto rounded-2xl border-2 border-[#1A365D]">
                <table className="w-full text-left text-xs font-semibold">
                  <thead className="bg-[#E0F2F1] text-[#1A365D] font-black uppercase text-[10px] border-b-2 border-[#1A365D]">
                    <tr>
                      <th className="p-2.5">Variabel</th>
                      <th className="p-2.5">Tujuan & Nilai Contoh</th>
                      <th className="p-2.5">Tingkat Sensitivitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5 font-mono text-[#00796B] font-bold">NOTIFICATION_WEBHOOK_URL</td>
                      <td className="p-2.5 text-slate-600">Endpoint tujuan pengiriman webhook notifikasi</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">Config URL</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[#00796B] font-bold">NOTIFICATION_API_KEY</td>
                      <td className="p-2.5 text-slate-600">Token rahasia autentikasi permintaan keluar</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">Secret (Server Only)</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[#00796B] font-bold">NOTIFICATION_EMAIL_RECIPIENT</td>
                      <td className="p-2.5 text-slate-600">Email guru PJOK (guru.pjok@sdnegeri-pesisir.sch.id)</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Recipient Email</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE TEST DISPATCHER */}
      {activeTab === 'test' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#00796B]" />
              Pengujian Pengiriman Notifikasi Langsung (Live Simulation & Webhook)
            </h4>
            <p className="text-xs font-semibold text-slate-600">
              Gunakan formulir ini untuk menguji format payload dan direktif autentikasi. Jika webhook eksternal belum dikonfigurasi, sistem akan mengeksekusi simulasi pengiriman email audit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#1A365D] mb-1">
                  Pilih Jenis Peringatan
                </label>
                <select
                  value={testAlertType}
                  onChange={(e) => setTestAlertType(e.target.value as NotificationEventType)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border-2 border-[#1A365D] text-xs font-bold text-[#1A365D]"
                >
                  <option value="CRITICAL_SODIUM_ALERT">🚨 Natrium Kritis (&gt; 30% AKG)</option>
                  <option value="HIGH_PROTEIN_DEFICIT">⚠️ Defisit Protein Signifikan (&gt; 20%)</option>
                  <option value="EXCESS_SUGAR_CARB">🍞 Karbohidrat / Gula Kemasan Tinggi</option>
                  <option value="BALANCED_PLATE_LOGGED">🥗 Jurnal Makan Seimbang (Normal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1A365D] mb-1">
                  Alamat Email Penerima (Guru / UKS)
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="guru.pjok@sekolah.sch.id"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border-2 border-[#1A365D] text-xs font-bold text-[#1A365D]"
                />
              </div>
            </div>

            <button
              id="dispatch-test-notif-btn"
              onClick={handleSendTestNotification}
              disabled={isSendingTest}
              className="w-full sm:w-auto px-6 py-3 bg-[#E65100] hover:bg-[#BF360C] disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-3 border-[#1A365D] shadow-[3px_3px_0px_#1A365D] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSendingTest ? 'Memproses Pengiriman...' : 'Kirim Notifikasi Uji Coba Sekarang'}</span>
            </button>

            {/* Test Result Feedback */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl border-2 border-[#1A365D] text-xs font-semibold ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-600'
                    : 'bg-rose-50 text-rose-900 border-rose-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black uppercase flex items-center gap-1.5">
                    {testResult.success ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                    )}
                    {testResult.success ? 'Notifikasi Berhasil Diproses' : 'Gagal Mengirimkan Notifikasi'}
                  </span>
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#1A365D]">
                    ID: {testResult.data?.notificationId || '-'}
                  </span>
                </div>
                <p className="text-[11px] mb-2">{testResult.data?.message || testResult.error}</p>

                {testResult.payload && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-bold text-[10px] text-slate-600 uppercase">
                      Lihat Payload Terkirim
                    </summary>
                    <pre className="mt-2 p-3 bg-[#1A365D] text-[#81C784] rounded-xl font-mono text-[10px] overflow-x-auto">
                      {JSON.stringify(testResult.payload, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* Audit History Log */}
          <div className="p-6 bg-white rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
                <FileJson className="w-4 h-4 text-[#00796B]" />
                Log Riwayat Notifikasi Eksternal ({auditLogs.length})
              </h4>
              <button
                onClick={fetchAuditLogs}
                className="text-[10px] font-black uppercase text-[#00796B] hover:underline cursor-pointer"
              >
                Muat Ulang
              </button>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-medium">
                Belum ada notifikasi eksternal yang tercatat. Lakukan pengujian di atas atau catat jurnal makan berkategori khusus.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border-2 border-[#1A365D]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E0F2F1] text-[#1A365D] font-black uppercase text-[10px] border-b-2 border-[#1A365D]">
                    <tr>
                      <th className="p-2.5">Waktu</th>
                      <th className="p-2.5">Jenis Event</th>
                      <th className="p-2.5">Penerima</th>
                      <th className="p-2.5">Kanal</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 text-[11px] font-mono">
                          {new Date(log.dispatchedAt).toLocaleTimeString('id-ID')}
                        </td>
                        <td className="p-2.5 font-bold text-[#1A365D]">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              log.eventType === 'CRITICAL_SODIUM_ALERT'
                                ? 'bg-rose-100 text-rose-800'
                                : log.eventType === 'HIGH_PROTEIN_DEFICIT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {log.eventType}
                          </span>
                        </td>
                        <td className="p-2.5 text-[11px] truncate max-w-[150px]">{log.destination}</td>
                        <td className="p-2.5 text-[11px] font-mono">{log.channel}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PAYLOAD SCHEMA & CURL SPEC */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
                <Code className="w-4 h-4 text-[#00796B]" />
                Contoh Skema Payload JSON Standar
              </h4>
              <button
                onClick={() => copyToClipboard(samplePayloadJson)}
                className="px-3 py-1.5 bg-[#E0F2F1] hover:bg-[#B2DFDB] text-[#00796B] rounded-xl text-xs font-black uppercase border border-[#00796B] flex items-center gap-1 cursor-pointer transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Disalin' : 'Salin JSON'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#1A365D] text-[#81C784] rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto border-2 border-[#1A365D]">
              {samplePayloadJson}
            </pre>
          </div>

          <div className="p-6 bg-white rounded-3xl border-3 border-[#1A365D] shadow-[4px_4px_0px_#1A365D] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#1A365D] flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#00796B]" />
                Contoh Perintah cURL Pemanggilan API
              </h4>
              <button
                onClick={() => copyToClipboard(sampleCurl)}
                className="px-3 py-1.5 bg-[#E0F2F1] hover:bg-[#B2DFDB] text-[#00796B] rounded-xl text-xs font-black uppercase border border-[#00796B] flex items-center gap-1 cursor-pointer transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Disalin' : 'Salin cURL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#1A365D] text-[#FFF9C4] rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto border-2 border-[#1A365D]">
              {sampleCurl}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
