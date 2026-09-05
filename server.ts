import express from 'express';
import path from 'path';
import { verifyFirebaseIdToken } from './server/auth';
import { analyzeNutritionLabel } from './server/gemini';
import firebaseConfig from './firebase-applet-config.json';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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
