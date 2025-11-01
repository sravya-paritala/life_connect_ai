import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { MainLayout } from "./components/layout/MainLayout";
import Home from "./pages/Home";
import ReportSummariser from "./pages/ReportSummariser";
import Emergency from "./pages/Emergency";
import PatientHistory from "./pages/PatientHistory";
import Profile from "./pages/Profile";
import Pharmacy from "./pages/Pharmacy";
import HealthLibrary from "./pages/HealthLibrary";
import NotFound from "./pages/NotFound";
import OCRUpload from "./components/layout/OCRUpload";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report-summariser" element={<ReportSummariser />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/patient-history" element={<PatientHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/health-library" element={<HealthLibrary />} />
            
            {/* Add all custom routes above the catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile", element: <Profile /> },
        { path: "/emergency", element: <Emergency /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
export default App;