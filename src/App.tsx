import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { auth, googleProvider, db } from './lib/firebase';
import {
  UserProfile,
  UserRole,
  NutrientKey,
  NutritionAnalysisResponse,
  FoodLogEntry,
  StructuredNutritionLog,
} from './types';
import { Navbar } from './components/Navbar';
import { AuthCard } from './components/AuthCard';
import { Step1Input } from './components/Step1Input';
import { Step2NutritionTable } from './components/Step2NutritionTable';
import { Step3Calculator } from './components/Step3Calculator';
import { Step4CoastalRecommendations } from './components/Step4CoastalRecommendations';
import { FoodJournal } from './components/FoodJournal';
import { IsiPiringkuGuide } from './components/IsiPiringkuGuide';
import { SecurityModal } from './components/SecurityModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Bell, X, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'assistant' | 'journal' | 'guide' | 'dashboard'>('assistant');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Assistant Flow State (Steps 1 - 4)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [foodName, setFoodName] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Analysis result
  const [analysisResult, setAnalysisResult] = useState<NutritionAnalysisResponse | null>(null);
  const [selectedNutrientKey, setSelectedNutrientKey] = useState<NutrientKey>('protein');
  const [confirmedDeficit, setConfirmedDeficit] = useState<number>(0);
  const [isSavingJournal, setIsSavingJournal] = useState<boolean>(false);

  // Firestore Journal State
  const [journalLogs, setJournalLogs] = useState<FoodLogEntry[]>([]);
  const [journalLoading, setJournalLoading] = useState<boolean>(false);

  // Firestore Structured Nutrition Logs for Teacher / Class Dashboard (Directive 2)
  const [classNutritionLogs, setClassNutritionLogs] = useState<StructuredNutritionLog[]>([]);
  const [classLogsLoading, setClassLogsLoading] = useState<boolean>(false);

  // External Notification Toast state
  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);

  // Auto-dismiss notification toast
  useEffect(() => {
    if (notificationToast?.show) {
      const timer = setTimeout(() => {
        setNotificationToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [notificationToast]);

  // Validate connection to Firestore on initial boot (Firebase Skill Guideline)
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error('Please check your Firebase configuration.');
        }
      }
    }
    testConnection();
  }, []);

  // Listen to Firebase Auth state & determine User Role (RBAC)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        let role: UserRole = 'student';
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            role = (userDocSnap.data()?.role as UserRole) || 'student';
          } else {
            await setDoc(
              userDocRef,
              {
                uid: user.uid,
                displayName: user.displayName || 'Siswa Kelas 6 SD',
                email: user.email,
                photoURL: user.photoURL,
                role: 'student',
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        } catch (e: any) {
          console.warn('Note loading user role:', e.message);
        }

        setUserRole(role);
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName || 'Siswa Kelas 6 SD',
          email: user.email,
          photoURL: user.photoURL,
          role,
        });
      } else {
        // Check if demo user was active in session
        const demoUserJson = sessionStorage.getItem('sahabat_sehat_demo_user');
        if (demoUserJson) {
          try {
            const parsed = JSON.parse(demoUserJson);
            setCurrentUser(parsed);
            setUserRole(parsed.role || 'student');
          } catch (e) {
            setCurrentUser(null);
            setUserRole('student');
          }
        } else {
          setCurrentUser(null);
          setUserRole('student');
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore Food Logs for current authenticated user
  useEffect(() => {
    if (!currentUser) {
      setJournalLogs([]);
      return;
    }

    setJournalLoading(true);

    try {
      const effectiveUid = auth.currentUser?.uid || currentUser.uid;
      const logsRef = collection(db, 'users', effectiveUid, 'food_logs');
      const q = query(logsRef, orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const logs: FoodLogEntry[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              timestamp: data.timestamp,
              foodName: data.foodName || 'Makanan',
              imageUrl: data.imageUrl,
              nutritionalData: data.nutritionalData || {
                karbohidrat: { amount: 0, unit: 'g', akgPercent: 0 },
                lemak: { amount: 0, unit: 'g', akgPercent: 0 },
                natrium: { amount: 0, unit: 'mg', akgPercent: 0 },
                protein: { amount: 0, unit: 'g', akgPercent: 0 },
              },
              selectedNutrient: data.selectedNutrient || 'Protein',
              selectedNutrientKey: data.selectedNutrientKey || 'protein',
              deficit: data.deficit || 0,
              localFoodSolution: data.localFoodSolution || '',
              studentReflection: data.studentReflection || '',
              userId: currentUser.uid,
            };
          });
          setJournalLogs(logs);
          setJournalLoading(false);
        },
        (error) => {
          console.warn('Firestore real-time subscription note:', error.message);
          // If Firestore is still initializing or offline in demo mode, try local storage fallback
          const localCache = localStorage.getItem(`food_logs_${currentUser.uid}`);
          if (localCache) {
            try {
              setJournalLogs(JSON.parse(localCache));
            } catch (e) {
              setJournalLogs([]);
            }
          }
          setJournalLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error setting up Firestore listener:', err);
      setJournalLoading(false);
    }
  }, [currentUser]);

  // Listen to Firestore Structured `nutrition_logs` collection (Directive 2)
  useEffect(() => {
    if (!currentUser) {
      setClassNutritionLogs([]);
      return;
    }

    setClassLogsLoading(true);

    try {
      const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';
      const effectiveUid = auth.currentUser?.uid || currentUser.uid;
      const logsRef = collection(db, 'nutrition_logs');

      // Teacher reads all class logs; student only reads own logs
      const q = isTeacherOrAdmin
        ? query(logsRef, orderBy('timestamp', 'desc'))
        : query(logsRef, where('student_id', '==', effectiveUid), orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const logs: StructuredNutritionLog[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              student_id: data.student_id,
              student_name: data.student_name,
              timestamp: data.timestamp,
              food_item: data.food_item || 'Camilan Kemasan',
              selected_nutrient: data.selected_nutrient || 'Protein',
              akg_percentage: Number(data.akg_percentage) || 0,
              deficiency_percentage: Number(data.deficiency_percentage) || 0,
              chosen_local_solution: data.chosen_local_solution || '',
              balanced_status: Boolean(data.balanced_status),
            };
          });
          setClassNutritionLogs(logs);
          setClassLogsLoading(false);
        },
        (error) => {
          console.warn('Firestore nutrition_logs listener note:', error.message);
          // Fallback to local cache if offline
          const localCached = localStorage.getItem('nutrition_logs_cache');
          if (localCached) {
            try {
              setClassNutritionLogs(JSON.parse(localCached));
            } catch (e) {
              setClassNutritionLogs([]);
            }
          }
          setClassLogsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error setting up nutrition_logs listener:', err);
      setClassLogsLoading(false);
    }
  }, [currentUser, userRole]);

  // Valid Educator Authorization PINs
  const VALID_TEACHER_PINS = ['GURU2026', '772601', 'UKS2026'];

  // Access Protection & Route Guard (Prevent Data Leakage - Directive 2)
  useEffect(() => {
    if (activeTab === 'dashboard') {
      const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';
      if (!isTeacherOrAdmin) {
        console.warn('Unauthorized access attempt to Teacher Dashboard blocked. Redirecting to assistant.');
        setActiveTab('assistant');
        setClassNutritionLogs([]); // Prevent class data leakage into student memory
        setNotificationToast({
          show: true,
          type: 'critical',
          title: 'Akses Dasbor Terproteksi (Data Leakage Protection)',
          message: 'Dasbor Pantau Kelas dan data agregat siswa terproteksi hanya untuk Guru PJOK atau Pembina UKS.',
        });
      }
    }
  }, [activeTab, userRole]);

  // Role Switcher Handler
  const handleSwitchRole = async (newRole: UserRole) => {
    if (newRole === 'teacher' && userRole !== 'teacher' && userRole !== 'admin') {
      const enteredPin = window.prompt(
        'Verifikasi Pendidik: Masukkan PIN Guru PJOK (Demo: GURU2026):'
      );
      if (!enteredPin || !VALID_TEACHER_PINS.includes(enteredPin.trim().toUpperCase())) {
        alert('PIN Guru tidak valid. Akses ke Dasbor Kelas ditolak.');
        return;
      }
    }

    setUserRole(newRole);
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('sahabat_sehat_demo_user', JSON.stringify(updatedUser));

      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid), { role: newRole }, { merge: true });
        } catch (e: any) {
          console.warn('Note updating user role doc in Firestore:', e.message);
        }
      }
    }

    if (newRole === 'teacher') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('assistant');
      setClassNutritionLogs([]);
    }
  };

  // Google Sign In handler with Pre-Login Role selection & Teacher PIN verification
  const handleGoogleSignIn = async (targetRole: UserRole = 'student', teacherPin?: string) => {
    setAuthLoading(true);
    setAuthError(null);

    // Verify Teacher credential if teacher role requested
    if (targetRole === 'teacher') {
      const trimmedPin = (teacherPin || '').trim().toUpperCase();
      if (!trimmedPin || !VALID_TEACHER_PINS.includes(trimmedPin)) {
        setAuthLoading(false);
        setAuthError('PIN Guru tidak valid. Masukkan PIN resmi (Demo: GURU2026) untuk login sebagai Guru.');
        return;
      }
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      sessionStorage.removeItem('sahabat_sehat_demo_user');
      if (result.user) {
        let assignedRole: UserRole = targetRole === 'teacher' ? 'teacher' : 'student';

        // Check if user already has an existing role in Firestore doc
        try {
          const userDocRef = doc(db, 'users', result.user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists() && userSnap.data()?.role === 'teacher') {
            assignedRole = 'teacher';
          } else {
            await setDoc(
              userDocRef,
              {
                uid: result.user.uid,
                displayName:
                  result.user.displayName ||
                  (assignedRole === 'teacher' ? 'Guru PJOK' : 'Siswa Kelas 6 SD'),
                email: result.user.email,
                photoURL: result.user.photoURL,
                role: assignedRole,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        } catch (docErr: any) {
          console.warn('Note updating user role doc in Firestore:', docErr.message);
        }

        setUserRole(assignedRole);
        setCurrentUser({
          uid: result.user.uid,
          displayName:
            result.user.displayName ||
            (assignedRole === 'teacher' ? 'Guru PJOK' : 'Siswa Kelas 6 SD'),
          email: result.user.email,
          photoURL: result.user.photoURL,
          role: assignedRole,
        });

        if (assignedRole === 'teacher') {
          setActiveTab('dashboard');
        } else {
          setActiveTab('assistant');
        }
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.code === 'auth/popup-blocked' || error.message?.includes('popup')) {
        setAuthError(
          'Popup login terblokir oleh browser/iframe. Kamu dapat mengizinkan popup atau gunakan tombol "Masuk Cepat" di bawah.'
        );
      } else {
        setAuthError(`Gagal masuk: ${error.message || 'Silakan coba lagi.'}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Demo student/teacher sign-in (allows testing in any restricted iframe environment)
  const handleDemoSignIn = async (role: UserRole = 'student', teacherPin?: string) => {
    if (role === 'teacher') {
      const trimmedPin = (teacherPin || 'GURU2026').trim().toUpperCase();
      if (!VALID_TEACHER_PINS.includes(trimmedPin)) {
        setAuthError('PIN Guru tidak valid. Gunakan PIN resmi (Demo: GURU2026).');
        return;
      }
    }

    let effectiveUid = role === 'teacher' ? 'demo_guru_pesisir_001' : 'demo_siswa_pesisir_001';

    try {
      if (!auth.currentUser) {
        const anonCred = await signInAnonymously(auth);
        if (anonCred.user) {
          effectiveUid = anonCred.user.uid;
        }
      } else {
        effectiveUid = auth.currentUser.uid;
      }
    } catch (anonErr: any) {
      console.info('Demo guest mode active with local UID:', anonErr.message);
    }

    const demoUser: UserProfile = {
      uid: effectiveUid,
      displayName: role === 'teacher' ? 'Ibu Ratna, S.Pd. (Guru PJOK)' : 'Budi Santoso (Siswa Kelas 6)',
      email: role === 'teacher' ? 'ratna.guru@sdnegeri-pesisir.sch.id' : 'budi.santoso@siswa.sdnegeri-pesisir.sch.id',
      photoURL: null,
      role,
      schoolClass: 'Kelas 6 SD Pesisir',
    };
    sessionStorage.setItem('sahabat_sehat_demo_user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setUserRole(role);
    setAuthError(null);

    // Direct role routing
    if (role === 'teacher') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('assistant');
    }

    // Also persist user profile doc in Firestore if possible
    try {
      await setDoc(
        doc(db, 'users', effectiveUid),
        {
          uid: effectiveUid,
          displayName: demoUser.displayName,
          email: demoUser.email,
          role: demoUser.role,
          schoolClass: demoUser.schoolClass,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (docErr: any) {
      console.warn('Note updating user document in Firestore:', docErr.message);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    sessionStorage.removeItem('sahabat_sehat_demo_user');
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setStep(1);
    setAnalysisResult(null);
  };

  // Analyze Nutrition Label with Gemini via Backend API
  const handleAnalyzeNutrition = async () => {
    if (!currentUser) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Get Firebase Auth ID Token if real user, or dummy token for demo
      let token = 'demo-token';
      if (auth.currentUser) {
        try {
          token = await auth.currentUser.getIdToken();
        } catch (tokErr) {
          console.warn('Using fallback auth token');
        }
      }

      // Convert image to base64 if selected
      let imageBase64: string | undefined = undefined;
      let imageMimeType: string | undefined = undefined;

      if (imagePreview) {
        if (imagePreview.startsWith('data:image/')) {
          const matches = imagePreview.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (matches) {
            imageMimeType = matches[1];
            imageBase64 = matches[2];
          }
        }
      }

      const payload = {
        foodName: foodName.trim() || 'Camilan Kemasan Pesisir',
        imageBase64,
        imageMimeType,
        studentName: currentUser.displayName?.split(' ')[0] || 'Siswa',
      };

      const response = await fetch('/api/analyze-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Analisis gagal (Status ${response.status})`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setAnalysisResult(result.data);
        // Default investigated nutrient to protein if protein has deficit, else karbohidrat
        const nutrients = result.data.nutrients;
        if (nutrients?.protein && nutrients.protein.akgPercent < 30) {
          setSelectedNutrientKey('protein');
        } else if (nutrients?.karbohidrat && nutrients.karbohidrat.akgPercent < 30) {
          setSelectedNutrientKey('karbohidrat');
        } else {
          setSelectedNutrientKey('protein');
        }
        setStep(2);
      } else {
        throw new Error('Hasil analisis tidak valid.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(
        err.message || 'Gagal memproses gambar. Pastikan gambar jelas atau gunakan nama makanan.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Proceed to Step 4 after calculating deficit
  const handleProceedToStep4 = (deficit: number) => {
    setConfirmedDeficit(deficit);
    setStep(4);
  };

  // Save entry to Firestore food_logs
  const handleSaveToJournal = async (chosenFoodSolution: string, reflection: string) => {
    if (!currentUser || !analysisResult) return;

    setIsSavingJournal(true);
    try {
      const activeNutrient = analysisResult.nutrients[selectedNutrientKey];
      const effectiveUid = auth.currentUser?.uid || currentUser.uid;

      const newLogData = {
        foodName: analysisResult.foodName,
        imageUrl: imagePreview || '',
        nutritionalData: {
          karbohidrat: {
            amount: analysisResult.nutrients.karbohidrat.amount,
            unit: analysisResult.nutrients.karbohidrat.unit,
            akgPercent: analysisResult.nutrients.karbohidrat.akgPercent,
          },
          lemak: {
            amount: analysisResult.nutrients.lemak.amount,
            unit: analysisResult.nutrients.lemak.unit,
            akgPercent: analysisResult.nutrients.lemak.akgPercent,
          },
          natrium: {
            amount: analysisResult.nutrients.natrium.amount,
            unit: analysisResult.nutrients.natrium.unit,
            akgPercent: analysisResult.nutrients.natrium.akgPercent,
          },
          protein: {
            amount: analysisResult.nutrients.protein.amount,
            unit: analysisResult.nutrients.protein.unit,
            akgPercent: analysisResult.nutrients.protein.akgPercent,
          },
        },
        selectedNutrient: activeNutrient.label,
        selectedNutrientKey: selectedNutrientKey,
        deficit: confirmedDeficit,
        localFoodSolution: chosenFoodSolution,
        studentReflection: reflection,
        userId: effectiveUid,
        timestamp: serverTimestamp(),
      };

      try {
        const logsRef = collection(db, 'users', effectiveUid, 'food_logs');
        await addDoc(logsRef, newLogData);
      } catch (firestoreError: any) {
        console.warn('Saving to local storage fallback due to Firestore permission/offline state:', firestoreError.message);
        // Fallback local storage state
        const localLogs = [...journalLogs];
        const newEntry: FoodLogEntry = {
          id: 'local_' + Date.now(),
          timestamp: new Date(),
          ...newLogData,
        };
        localLogs.unshift(newEntry);
        setJournalLogs(localLogs);
        localStorage.setItem(`food_logs_${effectiveUid}`, JSON.stringify(localLogs));
      }

      // 2. Structured Data Output for Class Dashboard (Directive 2 Requirement)
      const structuredLog: StructuredNutritionLog = {
        student_id: effectiveUid,
        student_name: currentUser.displayName || 'Siswa',
        timestamp: new Date().toISOString(),
        food_item: analysisResult.foodName,
        selected_nutrient: activeNutrient.label,
        akg_percentage: activeNutrient.akgPercent,
        deficiency_percentage: confirmedDeficit,
        chosen_local_solution: chosenFoodSolution,
        balanced_status: true,
      };

      try {
        const nutritionLogsRef = collection(db, 'nutrition_logs');
        await addDoc(nutritionLogsRef, structuredLog);
      } catch (nutritionErr: any) {
        console.warn('Saving structured nutrition log note:', nutritionErr.message);
        const localClassLogs: StructuredNutritionLog[] = JSON.parse(
          localStorage.getItem('nutrition_logs_cache') || '[]'
        );
        localClassLogs.unshift({ id: 'loc_' + Date.now(), ...structuredLog });
        localStorage.setItem('nutrition_logs_cache', JSON.stringify(localClassLogs));
        setClassNutritionLogs(localClassLogs);
      }

      // 3. Trigger External Notification Integration (Directives Trigger)
      try {
        let token = 'demo-token';
        if (auth.currentUser) {
          try {
            token = await auth.currentUser.getIdToken();
          } catch (tokErr) {
            console.warn('Fallback auth token');
          }
        }

        const notifyRes = await fetch('/api/notify-external', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            foodName: analysisResult.foodName,
            selectedNutrient: activeNutrient.label,
            akgPercentage: activeNutrient.akgPercent,
            deficiencyPercentage: confirmedDeficit,
            coastalSolutionChosen: chosenFoodSolution,
            nutritionalSummary: analysisResult.nutrients,
            studentName: currentUser.displayName,
          }),
        });

        if (notifyRes.ok) {
          const notifyResult = await notifyRes.json();
          const evt = notifyResult.data?.eventType;
          if (evt === 'CRITICAL_SODIUM_ALERT') {
            setNotificationToast({
              show: true,
              type: 'critical',
              title: 'Peringatan Gizi Dikirimkan',
              message: 'Kandungan natrium tinggi terdeteksi (>30% AKG). Notifikasi telah dikirimkan ke guru PJOK.',
            });
          } else if (evt === 'HIGH_PROTEIN_DEFICIT') {
            setNotificationToast({
              show: true,
              type: 'warning',
              title: 'Notifikasi Defisit Protein',
              message: 'Catatan defisit protein kemasan diteruskan ke portal guru untuk pemantauan lauk pesisir.',
            });
          }
        }
      } catch (notifErr: any) {
        console.warn('External notification dispatch note:', notifErr.message);
      }

      // Celebrate with confetti!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Reset and switch to Journal tab
      setStep(1);
      setFoodName('');
      setImagePreview(null);
      setSelectedFile(null);
      setAnalysisResult(null);
      setActiveTab('journal');
    } catch (err: any) {
      console.error('Error saving to journal:', err);
      alert('Gagal menyimpan ke jurnal: ' + err.message);
    } finally {
      setIsSavingJournal(false);
    }
  };

  // Delete log entry
  const handleDeleteLog = async (id: string) => {
    if (!currentUser) return;
    if (!confirm('Apakah kamu yakin ingin menghapus catatan piring ini?')) return;

    const effectiveUid = auth.currentUser?.uid || currentUser.uid;

    try {
      if (id.startsWith('local_')) {
        const updated = journalLogs.filter((l) => l.id !== id);
        setJournalLogs(updated);
        localStorage.setItem(`food_logs_${effectiveUid}`, JSON.stringify(updated));
      } else {
        const docRef = doc(db, 'users', effectiveUid, 'food_logs', id);
        await deleteDoc(docRef);
      }
    } catch (err: any) {
      console.error('Error deleting doc:', err);
      alert('Gagal menghapus: ' + err.message);
    }
  };

  // Start new meal from journal
  const handleStartNewMeal = () => {
    setStep(1);
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] text-[#1A365D] flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onSignOut={handleSignOut}
        onSignIn={handleGoogleSignIn}
        journalCount={journalLogs.length}
        userRole={userRole}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {authLoading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#00796B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-black uppercase tracking-wider text-[#1A365D]">
              Menghubungkan ke Sahabat Sehat...
            </p>
          </div>
        ) : !currentUser ? (
          /* Unauthenticated Landing / Login Screen */
          <AuthCard
            onGoogleSignIn={handleGoogleSignIn}
            onDemoSignIn={handleDemoSignIn}
            loading={authLoading}
            error={authError}
          />
        ) : (
          /* Authenticated Dashboard */
          <div>
            {activeTab === 'assistant' && (
              <div className="space-y-6">
                {/* Visual Step Progress Bar with Artistic Flair */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border-3 border-[#1A365D] p-4 sm:p-5 shadow-[4px_4px_0px_#1A365D]">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    <span className={step >= 1 ? 'text-[#00796B]' : ''}>
                      1. Menu & Foto
                    </span>
                    <span className={step >= 2 ? 'text-[#00796B]' : ''}>
                      2. Ekstraksi Nilai Gizi
                    </span>
                    <span className={step >= 3 ? 'text-[#00796B]' : ''}>
                      3. Hitung Defisit
                    </span>
                    <span className={step >= 4 ? 'text-[#00796B]' : ''}>
                      4. Pangan Pesisir
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 border-2 border-[#1A365D] overflow-hidden p-0.5">
                    <div
                      className="bg-[#4DB6AC] h-full rounded-full transition-all duration-300 border-r border-[#1A365D]"
                      style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step Content */}
                {step === 1 && (
                  <Step1Input
                    user={currentUser}
                    foodName={foodName}
                    setFoodName={setFoodName}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    onAnalyze={handleAnalyzeNutrition}
                    isAnalyzing={isAnalyzing}
                    error={analysisError}
                  />
                )}

                {step === 2 && analysisResult && (
                  <Step2NutritionTable
                    analysis={analysisResult}
                    selectedNutrientKey={selectedNutrientKey}
                    setSelectedNutrientKey={setSelectedNutrientKey}
                    onProceedToStep3={() => setStep(3)}
                    onBackToStep1={() => setStep(1)}
                  />
                )}

                {step === 3 && analysisResult && (
                  <Step3Calculator
                    analysis={analysisResult}
                    selectedNutrientKey={selectedNutrientKey}
                    onProceedToStep4={handleProceedToStep4}
                    onBackToStep2={() => setStep(2)}
                  />
                )}

                {step === 4 && analysisResult && (
                  <Step4CoastalRecommendations
                    analysis={analysisResult}
                    selectedNutrientKey={selectedNutrientKey}
                    confirmedDeficit={confirmedDeficit}
                    onSaveToJournal={handleSaveToJournal}
                    onBackToStep3={() => setStep(3)}
                    isSaving={isSavingJournal}
                  />
                )}
              </div>
            )}

            {activeTab === 'journal' && (
              <FoodJournal
                logs={journalLogs}
                loading={journalLoading}
                onDeleteLog={handleDeleteLog}
                onStartNewMeal={handleStartNewMeal}
              />
            )}

            {activeTab === 'guide' && <IsiPiringkuGuide />}

            {activeTab === 'dashboard' && (
              <TeacherDashboard
                logs={classNutritionLogs}
                loading={classLogsLoading}
                userRole={userRole}
              />
            )}
          </div>
        )}
      </main>

      {/* Security & Threat Model Inspector Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Floating External Notification Alert Toast */}
      {notificationToast && (
        <div
          id="external-notification-toast"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-white p-4 rounded-2xl border-4 border-[#1A365D] shadow-[6px_6px_0px_#1A365D] transition-all animate-bounce"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl border-2 border-[#1A365D] flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_#1A365D] ${
                notificationToast.type === 'critical'
                  ? 'bg-[#E65100]'
                  : notificationToast.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-[#00796B]'
              }`}
            >
              <Bell className="w-5 h-5" />
            </div>

            <div className="flex-1 pr-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 rounded border border-[#1A365D]/30 text-[#1A365D]">
                  Notifikasi Eksternal
                </span>
                <span className="text-[10px] font-bold text-emerald-700">Terkirim</span>
              </div>
              <h4 className="text-xs font-black text-[#1A365D] uppercase">{notificationToast.title}</h4>
              <p className="text-xs font-medium text-slate-700 mt-0.5 leading-snug">
                {notificationToast.message}
              </p>
            </div>

            <button
              onClick={() => setNotificationToast(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer with Artistic Flair */}
      <footer className="mt-auto border-t-3 border-[#1A365D] bg-[#FDF8F1] py-6 text-center text-xs text-[#1A365D]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-black uppercase tracking-wider">
            <strong>Sahabat Sehat</strong> • PJOK Kelas 6 SD Kurikulum Merdeka (Fase C Pesisir)
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-600">
            <span>Isi Piringku</span>
            <span>•</span>
            <span>Gemini Vision</span>
            <span>•</span>
            <span>Cloud Firestore</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
