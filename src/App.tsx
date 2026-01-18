import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeScenarioData } from '@/utils/initializeScenarioData';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdaptiveDrillPage } from '@/pages/AdaptiveDrillPage';
import { ScenarioPreviewPage } from '@/pages/ScenarioPreviewPage';
import { ScenarioSelectPage } from '@/pages/ScenarioSelectPage';
import { ProgressPage } from '@/pages/ProgressPage';

function App(): JSX.Element {
  useEffect(() => {
    // Set application title
    document.title = 'Diamond IQ';
    // Validate scenario dataset on app load
    initializeScenarioData();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/preview" element={<ScenarioPreviewPage />} />
          <Route
            path="/drill"
            element={
              <ProtectedRoute>
                <AdaptiveDrillPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ScenarioSelectPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
