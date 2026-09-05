import express from 'express';
import path from 'path';
import { verifyFirebaseIdToken } from './server/auth';
import { analyzeNutritionLabel } from './server/gemini';
import {
  dispatchExternalNotification,
  evaluateJournalAlert,
  getNotificationAuditHistory,
  getNotificationDirectiveSpec,
  NotificationPayload,
} from './server/notifications';
import firebaseConfig from './firebase-applet-config.json';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Detect production environment reliably across Cloud Run containers
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.K_SERVICE) ||
    Boolean(process.env.K_REVISION) ||
    (Boolean(process.argv[1]) && (process.argv[1].endsWith('.cjs') || process.argv[1].includes('dist')));

  // Fast health check endpoint for Cloud Run readiness / liveness probes
  app.get(['/health', '/api/health', '/ping', '/_healthz'], (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'Sahabat Sehat API',
      env: isProduction ? 'production' : 'development',
      port: PORT,
      timestamp: new Date().toISOString(),
    });
  });

  // JSON Body parser with 5MB limit for nutrition label photos
  app.use(express.json({ limit: '5mb' }));

  // Multimodal Nutrition Analysis Endpoint
  app.post('/api/analyze-nutrition', async (req, res) => {
    try {
      // 1. Verify Authentication Token (Firebase ID Token)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Autentikasi diperlukan. Silakan login terlebih dahulu.',
        });
      }

      const idToken = authHeader.split('Bearer ')[1].trim();
      const expectedProjectId = firebaseConfig.projectId || 'lexical-raceway-507508-s7';

      let userPayload;
      try {
        userPayload = await verifyFirebaseIdToken(idToken, expectedProjectId);
      } catch (authError: any) {
        console.warn('Authentication token verification failed:', authError.message);
        return res.status(401).json({
          error: 'Sesi login tidak valid atau sudah kedaluwarsa. Silakan login kembali.',
          details: authError.message,
        });
      }

      // 2. Validate Request Body
      const { foodName, imageBase64, imageMimeType, studentName } = req.body;

      if (!foodName && !imageBase64) {
        return res.status(400).json({
          error: 'Harap sertakan nama makanan atau foto tabel nilai gizi.',
        });
      }

      if (imageBase64) {
        // Enforce max 4MB size validation
        const approxSizeInBytes = (imageBase64.length * 3) / 4;
        if (approxSizeInBytes > 4 * 1024 * 1024) {
          return res.status(400).json({
            error: 'Ukuran foto melebihi batas maksimum 4MB. Harap gunakan foto yang lebih kecil.',
          });
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (imageMimeType && !allowedMimes.includes(imageMimeType)) {
          return res.status(400).json({
            error: 'Format foto harus berupa JPEG, PNG, atau WebP.',
          });
        }
      }

      // 3. Process with Gemini API
      const analysisResult = await analyzeNutritionLabel({
        imageBase64,
        imageMimeType: imageMimeType || 'image/jpeg',
        foodName: foodName || 'Makanan Ringan',
        studentName: studentName || userPayload.name || 'Siswa',
      });

      return res.json({
        success: true,
        data: analysisResult,
        verifiedUser: {
          uid: userPayload.user_id,
          name: userPayload.name,
        },
      });
    } catch (err: any) {
      console.error('Error analyzing nutrition label:', err);
      return res.status(500).json({
        error: err.message || 'Terjadi kesalahan saat menganalisis informasi gizi.',
      });
    }
  });

  // ==========================================
  // EXTERNAL NOTIFICATION API DIRECTIVES
  // ==========================================

  // 1. Get Notification Directive & Payload Schema (Public/Developer Documentation)
  app.get('/api/notification-directive', (req, res) => {
    const spec = getNotificationDirectiveSpec();
    res.json({
      success: true,
      spec,
    });
  });

  // 2. Get Audit History of Dispatched Notifications
  app.get('/api/notifications/audit', (req, res) => {
    const history = getNotificationAuditHistory();
    res.json({
      success: true,
      count: history.length,
      history,
    });
  });

  // 3. Dispatch Notification when a specific journal entry is parsed/logged
  app.post('/api/notify-external', async (req, res) => {
    try {
      // Authenticate caller
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Autentikasi diperlukan untuk memicu notifikasi eksternal.',
        });
      }

      const idToken = authHeader.split('Bearer ')[1].trim();
      const expectedProjectId = firebaseConfig.projectId || 'lexical-raceway-507508-s7';

      let userPayload;
      try {
        userPayload = await verifyFirebaseIdToken(idToken, expectedProjectId);
      } catch (authError: any) {
        return res.status(401).json({
          error: 'Sesi login tidak valid atau sudah kedaluwarsa.',
          details: authError.message,
        });
      }

      const {
        foodName,
        selectedNutrient,
        akgPercentage,
        deficiencyPercentage,
        excessPercentage,
        coastalSolutionChosen,
        nutritionalSummary,
        studentName,
        schoolClass,
        customEventType,
        targetEmail,
      } = req.body;

      if (!foodName || !selectedNutrient) {
        return res.status(400).json({
          error: 'Parameter foodName dan selectedNutrient wajib disertakan.',
        });
      }

      // Evaluate alert criteria
      const evaluation = evaluateJournalAlert({
        foodName,
        selectedNutrient,
        akgPercentage: Number(akgPercentage) || 0,
        deficiencyPercentage: Number(deficiencyPercentage) || 0,
        nutritionalSummary,
        coastalSolutionChosen,
        studentName: studentName || userPayload.name,
        studentId: userPayload.user_id,
      });

      const eventType = customEventType || evaluation.eventType;
      const severity = evaluation.severity;

      // Construct typed NotificationPayload strictly complying with Directive Schema
      const notificationPayload: NotificationPayload = {
        notificationId: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        eventType,
        severity,
        recipient: {
          email: targetEmail || process.env.NOTIFICATION_EMAIL_RECIPIENT || 'guru.pjok@sdnegeri-pesisir.sch.id',
          role: 'teacher',
          recipientName: 'Guru PJOK / Pembina UKS',
        },
        student: {
          id: userPayload.user_id,
          name: studentName || userPayload.name || 'Siswa Kelas 6',
          schoolClass: schoolClass || 'Kelas 6 SD Pesisir',
        },
        journalEntry: {
          foodName,
          selectedNutrient,
          akgPercentage: Number(akgPercentage) || 0,
          deficiencyPercentage: Number(deficiencyPercentage) || 0,
          excessPercentage: excessPercentage ? Number(excessPercentage) : undefined,
          coastalSolutionChosen: coastalSolutionChosen || undefined,
          nutritionalSummary,
        },
        actionRecommendation: {
          summary: evaluation.advice.summary,
          pedagogicalAdvice: evaluation.advice.pedagogicalAdvice,
          suggestedAction: evaluation.advice.suggestedAction,
        },
        metadata: {
          sourceApp: 'Sahabat Sehat',
          version: '1.2.0',
          framework: 'Kurikulum Merdeka PJOK Fase C (Kelas 6 SD Pesisir)',
          dispatchedBy: userPayload.user_id,
        },
      };

      // Dispatch to external system
      const dispatchResult = await dispatchExternalNotification(notificationPayload);

      return res.json({
        success: dispatchResult.success,
        data: dispatchResult,
        payload: notificationPayload,
      });
    } catch (err: any) {
      console.error('Error in notify-external:', err);
      return res.status(500).json({
        error: err.message || 'Gagal memproses notifikasi eksternal.',
      });
    }
  });

  // 4. Test Notification Trigger Endpoint (for teachers/administrators)
  app.post('/api/test-notification', async (req, res) => {
    try {
      const { alertType, testEmail } = req.body;

      const sampleEntry =
        alertType === 'CRITICAL_SODIUM_ALERT'
          ? {
              foodName: 'Keripik Renyah Ekstra Garam (Uji Coba)',
              selectedNutrient: 'Natrium',
              akgPercentage: 42,
              deficiencyPercentage: 0,
              excessPercentage: 12,
              coastalSolutionChosen: 'Sayur Daun Kelor Bening & Air Putih',
            }
          : {
              foodName: 'Biskuit Manis Salty (Uji Coba)',
              selectedNutrient: 'Protein',
              akgPercentage: 4,
              deficiencyPercentage: 26,
              excessPercentage: 0,
              coastalSolutionChosen: 'Ikan Kembung Kukus Bumbu Kuning',
            };

      const evaluation = evaluateJournalAlert({
        foodName: sampleEntry.foodName,
        selectedNutrient: sampleEntry.selectedNutrient,
        akgPercentage: sampleEntry.akgPercentage,
        deficiencyPercentage: sampleEntry.deficiencyPercentage,
      });

      const notificationPayload: NotificationPayload = {
        notificationId: `test_notif_${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: (alertType as any) || evaluation.eventType,
        severity: evaluation.severity,
        recipient: {
          email: testEmail || process.env.NOTIFICATION_EMAIL_RECIPIENT || 'guru.pjok@sdnegeri-pesisir.sch.id',
          role: 'teacher',
          recipientName: 'Guru PJOK (Simulasi Pengujian)',
        },
        student: {
          id: 'siswa_demo_001',
          name: 'Budi Santoso (Simulasi Uji)',
          schoolClass: 'Kelas 6 SD Pesisir',
        },
        journalEntry: sampleEntry,
        actionRecommendation: {
          summary: evaluation.advice.summary,
          pedagogicalAdvice: evaluation.advice.pedagogicalAdvice,
          suggestedAction: evaluation.advice.suggestedAction,
        },
        metadata: {
          sourceApp: 'Sahabat Sehat',
          version: '1.2.0',
          framework: 'Kurikulum Merdeka PJOK Fase C (Kelas 6 SD Pesisir)',
          dispatchedBy: 'system_test',
        },
      };

      const result = await dispatchExternalNotification(notificationPayload);

      return res.json({
        success: result.success,
        data: result,
        payload: notificationPayload,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development or static serving for production
  if (isProduction) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Sahabat Sehat production server running on port ${PORT}`);
    });
  } else {
    // Dynamic import for Vite so production bundles never require Vite runtime
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Sahabat Sehat dev server running on port ${PORT}`);
    });
  }
}

startServer();
