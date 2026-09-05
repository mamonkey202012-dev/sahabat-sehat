import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { auth, googleProvider, db } from './lib/firebase';
import {
  UserProfile,
  NutrientKey,
  NutritionAnalysisResponse,
  FoodLogEntry,
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

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'assistant' | 'journal' | 'guide'>('assistant');
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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName || 'Siswa Kelas 6 SD',
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        // Check if demo user was active in session
        const demoUserJson = sessionStorage.getItem('sahabat_sehat_demo_user');
        if (demoUserJson) {
          try {
            setCurrentUser(JSON.parse(demoUserJson));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
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
      const logsRef = collection(db, 'users', currentUser.uid, 'food_logs');
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

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      sessionStorage.removeItem('sahabat_sehat_demo_user');
      if (result.user) {
        setCurrentUser({
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        });
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.code === 'auth/popup-blocked' || error.message?.includes('popup')) {
        setAuthError(
          'Popup login terblokir oleh browser/iframe. Kamu dapat mengizinkan popup atau gunakan tombol "Masuk sebagai Siswa Uji Coba" di bawah.'
        );
      } else {
        setAuthError(`Gagal masuk: ${error.message || 'Silakan coba lagi.'}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Demo student sign-in (allows testing in any restricted iframe environment)
  const handleDemoSignIn = () => {
    const demoUser: UserProfile = {
      uid: 'siswa-demo-pesisir-01',
      displayName: 'Budi (Siswa SD Pesisir)',
      email: 'budi.pesisir@sekolah.id',
      photoURL: null,
    };
    sessionStorage.setItem('sahabat_sehat_demo_user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setAuthError(null);
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
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
      };

      try {
        const logsRef = collection(db, 'users', currentUser.uid, 'food_logs');
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
        localStorage.setItem(`food_logs_${currentUser.uid}`, JSON.stringify(localLogs));
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

    try {
      if (id.startsWith('local_')) {
        const updated = journalLogs.filter((l) => l.id !== id);
        setJournalLogs(updated);
        localStorage.setItem(`food_logs_${currentUser.uid}`, JSON.stringify(updated));
      } else {
        const docRef = doc(db, 'users', currentUser.uid, 'food_logs', id);
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
          </div>
        )}
      </main>

      {/* Security & Threat Model Inspector Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

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
