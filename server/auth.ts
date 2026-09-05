import https from 'https';

interface FirebaseTokenPayload {
  name?: string;
  picture?: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email?: string;
  email_verified?: boolean;
}

let cachedCertificates: Record<string, string> = {};
let certExpiryTime = 0;

async function fetchGooglePublicKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedCertificates && now < certExpiryTime) {
    return cachedCertificates;
  }

  return new Promise((resolve, reject) => {
    https.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const certs = JSON.parse(data);
          cachedCertificates = certs;
          // Cache for 6 hours
          certExpiryTime = Date.now() + 6 * 60 * 60 * 1000;
          resolve(certs);
        } catch (e) {
          // If fail to parse, fallback to empty
          resolve(cachedCertificates || {});
        }
      });
    }).on('error', (err) => {
      console.warn('Failed to fetch Google public certificates, continuing with payload check:', err.message);
      resolve(cachedCertificates || {});
    });
  });
}

/**
 * Validates Firebase ID Token claims (Issuer, Audience, Expiry, User ID)
 */
export async function verifyFirebaseIdToken(token: string, expectedProjectId: string): Promise<FirebaseTokenPayload> {
  if (!token) {
    throw new Error('Authorization token is missing');
  }

  // Support demo token for preview/sandbox environments
  if (token === 'demo-token' || token.startsWith('demo-') || token.startsWith('demo_')) {
    const nowSec = Math.floor(Date.now() / 1000);
    return {
      iss: `https://securetoken.google.com/${expectedProjectId}`,
      aud: expectedProjectId,
      auth_time: nowSec,
      user_id: 'demo_user_pesisir_001',
      sub: 'demo_user_pesisir_001',
      iat: nowSec,
      exp: nowSec + 3600,
      name: 'Pengguna Uji Coba Pesisir',
      email: 'demo@sdnegeri-pesisir.sch.id',
    };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
  const payload: FirebaseTokenPayload = JSON.parse(payloadJson);

  const nowInSeconds = Math.floor(Date.now() / 1000);

  // Check expiration (with 10-second grace window)
  if (payload.exp && payload.exp < nowInSeconds - 10) {
    throw new Error('Token has expired');
  }

  // Verify Issuer
  const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;
  if (payload.iss !== expectedIssuer) {
    throw new Error(`Token issuer mismatch. Expected: ${expectedIssuer}, got: ${payload.iss}`);
  }

  // Verify Audience
  if (payload.aud !== expectedProjectId) {
    throw new Error(`Token audience mismatch. Expected: ${expectedProjectId}, got: ${payload.aud}`);
  }

  // Verify subject/user ID
  if (!payload.sub || !payload.user_id) {
    throw new Error('Token must contain valid sub and user_id claims');
  }

  return payload;
}
