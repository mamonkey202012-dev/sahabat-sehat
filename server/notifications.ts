/**
 * Notification Service & API Directives: External Email & Webhook Integration
 * Module for dispatching real-time notifications to external systems
 * (e.g. Teacher email, School Health / UKS portal, parental dashboard)
 * when specific journal entry types are parsed (e.g., critical sodium, high protein deficit).
 */

export type NotificationEventType =
  | 'CRITICAL_SODIUM_ALERT'
  | 'HIGH_PROTEIN_DEFICIT'
  | 'EXCESS_SUGAR_CARB'
  | 'BALANCED_PLATE_LOGGED';

export type NotificationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export interface NotificationPayload {
  notificationId: string;
  timestamp: string;
  eventType: NotificationEventType;
  severity: NotificationSeverity;
  recipient: {
    email: string;
    role: 'teacher' | 'parent' | 'health_officer';
    recipientName?: string;
  };
  student: {
    id: string;
    name: string;
    schoolClass?: string;
  };
  journalEntry: {
    foodName: string;
    selectedNutrient: string;
    akgPercentage: number;
    deficiencyPercentage: number;
    excessPercentage?: number;
    coastalSolutionChosen?: string;
    nutritionalSummary?: {
      karbohidrat?: { amount: number; unit: string; akgPercent: number };
      lemak?: { amount: number; unit: string; akgPercent: number };
      natrium?: { amount: number; unit: string; akgPercent: number };
      protein?: { amount: number; unit: string; akgPercent: number };
    };
  };
  actionRecommendation: {
    summary: string;
    pedagogicalAdvice: string;
    suggestedAction: 'IMMEDIATE_HYDRATION' | 'COASTAL_PROTEIN_INTERVENTION' | 'MONITORING' | 'COMMENDATION';
  };
  metadata: {
    sourceApp: 'Sahabat Sehat';
    version: '1.2.0';
    framework: 'Kurikulum Merdeka PJOK Fase C (Kelas 6 SD Pesisir)';
    dispatchedBy: string;
  };
}

export interface DispatchResult {
  success: boolean;
  notificationId: string;
  eventType: NotificationEventType;
  status: 'dispatched' | 'simulated_success' | 'failed';
  channel: 'external_webhook' | 'email_simulation';
  destination: string;
  dispatchedAt: string;
  message: string;
  error?: string;
}

// In-memory audit log of recently dispatched notifications for teacher review
const notificationAuditHistory: DispatchResult[] = [];

/**
 * Evaluates whether an extracted/logged journal entry matches any alert criteria
 */
export function evaluateJournalAlert(data: {
  foodName: string;
  selectedNutrient: string;
  akgPercentage: number;
  deficiencyPercentage: number;
  nutritionalSummary?: any;
  coastalSolutionChosen?: string;
  studentName?: string;
  studentId?: string;
}): { shouldAlert: boolean; eventType: NotificationEventType; severity: NotificationSeverity; advice: { summary: string; pedagogicalAdvice: string; suggestedAction: any } } {
  const { selectedNutrient, akgPercentage, deficiencyPercentage, nutritionalSummary } = data;

  const natriumPercent = nutritionalSummary?.natrium?.akgPercent ?? (selectedNutrient.toLowerCase().includes('natrium') ? akgPercentage : 0);
  const proteinAkg = nutritionalSummary?.protein?.akgPercent ?? (selectedNutrient.toLowerCase().includes('protein') ? akgPercentage : 0);
  const karboAkg = nutritionalSummary?.karbohidrat?.akgPercent ?? (selectedNutrient.toLowerCase().includes('karbo') ? akgPercentage : 0);

  // 1. Critical Sodium (> 30% AKG in a single snack)
  if (natriumPercent > 30 || (selectedNutrient.toLowerCase().includes('natrium') && akgPercentage > 30)) {
    return {
      shouldAlert: true,
      eventType: 'CRITICAL_SODIUM_ALERT',
      severity: 'CRITICAL',
      advice: {
        summary: `Kandungan natrium kemasan mencapai ${natriumPercent}% AKG (melebihi batas aman 30% untuk sekali makan).`,
        pedagogicalAdvice:
          'Siswa perlu segera diimbau minum air putih yang cukup dan menghindari camilan asin tambahan saat istirahat sekolah.',
        suggestedAction: 'IMMEDIATE_HYDRATION',
      },
    };
  }

  // 2. High Protein Deficit (Protein <= 10% AKG, deficit > 20%)
  if ((selectedNutrient.toLowerCase().includes('protein') && deficiencyPercentage >= 20) || (proteinAkg > 0 && proteinAkg < 10)) {
    return {
      shouldAlert: true,
      eventType: 'HIGH_PROTEIN_DEFICIT',
      severity: 'HIGH',
      advice: {
        summary: `Camilan ini sangat minim protein (defisit ${deficiencyPercentage}% dari target 30%).`,
        pedagogicalAdvice:
          'Arahkan siswa memilih lauk hewani pesisir seperti Ikan Kembung, Ikan Tongkol, atau Telur untuk makan siang.',
        suggestedAction: 'COASTAL_PROTEIN_INTERVENTION',
      },
    };
  }

  // 3. Excess Carbohydrates / Sugar (> 30% AKG)
  if (karboAkg > 35 || (selectedNutrient.toLowerCase().includes('karbohidrat') && akgPercentage > 35)) {
    return {
      shouldAlert: true,
      eventType: 'EXCESS_SUGAR_CARB',
      severity: 'MEDIUM',
      advice: {
        summary: `Karbohidrat/gula mencapai ${karboAkg}% AKG dalam porsi kecil.`,
        pedagogicalAdvice:
          'Jelaskan konsep energi cepat habis akibat gula olahan dan pentingnya sumber serat pesisir.',
        suggestedAction: 'MONITORING',
      },
    };
  }

  // 4. Default: Balanced Plate Journal
  return {
    shouldAlert: false,
    eventType: 'BALANCED_PLATE_LOGGED',
    severity: 'INFO',
    advice: {
      summary: 'Entri jurnal makan seimbang berhasil dicatat.',
      pedagogicalAdvice: 'Apresiasi pemahaman siswa dalam menyelaraskan Isi Piringku dengan pangan pesisir.',
      suggestedAction: 'COMMENDATION',
    },
  };
}

/**
 * Dispatches an external notification using configured API directives
 */
export async function dispatchExternalNotification(
  payload: NotificationPayload
): Promise<DispatchResult> {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  const apiKey = process.env.NOTIFICATION_API_KEY;
  const destinationEmail = payload.recipient.email || process.env.NOTIFICATION_EMAIL_RECIPIENT || 'guru.pjok@sdnegeri-pesisir.sch.id';

  const timestamp = new Date().toISOString();

  // If webhook URL is configured in environment, dispatch HTTP POST with secure Bearer header
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'SahabatSehat-AlertDispatcher/1.2.0',
        'X-Sahabat-Sehat-Event': payload.eventType,
        'X-Sahabat-Sehat-Severity': payload.severity,
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}: ${response.statusText}`);
      }

      const result: DispatchResult = {
        success: true,
        notificationId: payload.notificationId,
        eventType: payload.eventType,
        status: 'dispatched',
        channel: 'external_webhook',
        destination: webhookUrl,
        dispatchedAt: timestamp,
        message: `Notifikasi berhasil dikirimkan ke webhook eksternal (${payload.eventType}).`,
      };

      notificationAuditHistory.unshift(result);
      if (notificationAuditHistory.length > 50) notificationAuditHistory.pop();

      return result;
    } catch (dispatchErr: any) {
      console.error('Failed to dispatch webhook:', dispatchErr.message);

      const failResult: DispatchResult = {
        success: false,
        notificationId: payload.notificationId,
        eventType: payload.eventType,
        status: 'failed',
        channel: 'external_webhook',
        destination: webhookUrl,
        dispatchedAt: timestamp,
        message: 'Gagal mengirimkan notifikasi ke webhook eksternal.',
        error: dispatchErr.message,
      };

      notificationAuditHistory.unshift(failResult);
      return failResult;
    }
  }

  // Simulated Email & External Dispatch (When NOTIFICATION_WEBHOOK_URL is not yet connected to a live SMTP/webhook)
  const simResult: DispatchResult = {
    success: true,
    notificationId: payload.notificationId,
    eventType: payload.eventType,
    status: 'simulated_success',
    channel: 'email_simulation',
    destination: destinationEmail,
    dispatchedAt: timestamp,
    message: `Notifikasi email tersimulasi ke "${destinationEmail}" untuk jenis entri: ${payload.eventType}. Direktif API siap dihubungkan dengan webhook produksi.`,
  };

  notificationAuditHistory.unshift(simResult);
  if (notificationAuditHistory.length > 50) notificationAuditHistory.pop();

  return simResult;
}

/**
 * Returns recent notification audit history
 */
export function getNotificationAuditHistory(): DispatchResult[] {
  return [...notificationAuditHistory];
}

/**
 * Returns official Notification API Directive Specification & Payload Schema
 */
export function getNotificationDirectiveSpec() {
  return {
    title: 'Direktif API Notifikasi Eksternal (External Notification & Email API)',
    version: '1.2.0',
    description:
      'Spesifikasi pengiriman peringatan dan laporan gizi dari aplikasi Sahabat Sehat ke sistem eksternal (Email Guru PJOK, SIM UKS Sekolah, atau Webhook Sistem Informasi Kesehatan).',
    authenticationDirectives: {
      inbound: {
        type: 'Firebase Auth ID Token',
        header: 'Authorization: Bearer <ID_TOKEN>',
        description:
          'Semua permintaan API internal divalidasi dengan token otentikasi Firebase ID Token untuk memastikan identitas siswa atau guru terverifikasi.',
      },
      outbound: {
        type: 'Bearer API Key or Secret Signature',
        header: 'Authorization: Bearer <NOTIFICATION_API_KEY>',
        envVariables: [
          'NOTIFICATION_WEBHOOK_URL (URL endpoint webhook penerima eksternal)',
          'NOTIFICATION_API_KEY (Token rahasia autentikasi ke server eksternal)',
          'NOTIFICATION_EMAIL_RECIPIENT (Email guru PJOK penerima peringatan gizi)',
          'NOTIFICATION_SENDER_NAME (Identitas pengirim notifikasi)',
        ],
        securityRule:
          'Dilarang melakukan hardcoding kunci API. Semua kredensial wajib dimuat dari Google Secret Manager atau Environment Variables server-side.',
      },
    },
    supportedEventTypes: [
      {
        type: 'CRITICAL_SODIUM_ALERT',
        severity: 'CRITICAL',
        triggerCondition: 'Kandungan natrium kemasan > 30% AKG dalam 1 porsi (berisiko dehidrasi/beban ginjal).',
        recommendedPedagogy: 'Imbauan minum air putih segera dan edukasi batas konsumsi garam.',
      },
      {
        type: 'HIGH_PROTEIN_DEFICIT',
        severity: 'HIGH',
        triggerCondition: 'Protein kemasan < 10% AKG atau defisit protein >= 20% dari target 30%.',
        recommendedPedagogy: 'Intervensi lauk hewani pesisir (ikan kembung, tongkol, cakalang).',
      },
      {
        type: 'EXCESS_SUGAR_CARB',
        severity: 'MEDIUM',
        triggerCondition: 'Kandungan karbohidrat/gula kemasan > 35% AKG.',
        recommendedPedagogy: 'Peringatan lonjakan gula darah dan penyeimbangan dengan sayuran berserat.',
      },
      {
        type: 'BALANCED_PLATE_LOGGED',
        severity: 'INFO',
        triggerCondition: 'Siswa berhasil menuntaskan refleksi dan memilih pasangan pangan lokal pesisir.',
        recommendedPedagogy: 'Apresiasi dan pencatatan portofolio PJOK Kurikulum Merdeka.',
      },
    ],
    payloadSchema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      required: ['notificationId', 'timestamp', 'eventType', 'severity', 'recipient', 'student', 'journalEntry'],
      properties: {
        notificationId: { type: 'string', format: 'uuid' },
        timestamp: { type: 'string', format: 'date-time' },
        eventType: {
          type: 'string',
          enum: ['CRITICAL_SODIUM_ALERT', 'HIGH_PROTEIN_DEFICIT', 'EXCESS_SUGAR_CARB', 'BALANCED_PLATE_LOGGED'],
        },
        severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] },
        recipient: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['teacher', 'parent', 'health_officer'] },
            recipientName: { type: 'string' },
          },
        },
        student: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            schoolClass: { type: 'string' },
          },
        },
        journalEntry: {
          type: 'object',
          properties: {
            foodName: { type: 'string' },
            selectedNutrient: { type: 'string' },
            akgPercentage: { type: 'number' },
            deficiencyPercentage: { type: 'number' },
            excessPercentage: { type: 'number' },
            coastalSolutionChosen: { type: 'string' },
          },
        },
        actionRecommendation: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            pedagogicalAdvice: { type: 'string' },
            suggestedAction: { type: 'string' },
          },
        },
      },
    },
    curlExample: `curl -X POST "https://your-domain.com/api/notify-external" \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "CRITICAL_SODIUM_ALERT",
    "foodName": "Keripik Asin Ekstra Gurih",
    "selectedNutrient": "Natrium",
    "akgPercentage": 42,
    "deficiencyPercentage": 0,
    "studentName": "Budi Santoso",
    "coastalSolutionChosen": "Ikan Kembung Kukus & Sayur Kelor"
  }'`,
  };
}
