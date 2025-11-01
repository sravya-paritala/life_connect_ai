import { useEffect, useState } from "react";
import {
  Lock,
  FolderOpen,
  Search,
  Plus,
  Upload,
  FileText,
  Eye,
  Download,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShareButton from "@/components/ui/ShareButton";
import PatientReportViewer from "@/components/ui/PatientReportViewer";

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  category: string;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Blood Test Results - March 2024", type: "PDF", date: "2024-03-15", size: "2.3 MB", category: "Lab Results" },
  { id: "2", name: "Chest X-Ray Report", type: "PDF", date: "2024-02-28", size: "1.8 MB", category: "Imaging" },
  { id: "3", name: "Cardiology Consultation", type: "PDF", date: "2024-02-15", size: "512 KB", category: "Consultation" },
  { id: "4", name: "Prescription - Dr. Smith", type: "PDF", date: "2024-01-30", size: "256 KB", category: "Prescription" },
];

export default function PatientHistory() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"login" | "signup" | null>(null);

  // ✅ Restore from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const savedUserType = localStorage.getItem("userType") as "login" | "signup" | null;
    if (savedAuth === "true" && savedUserType) {
      setIsAuthenticated(true);
      setUserType(savedUserType);
    }
  }, []);

  // ✅ Sync changes to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    if (userType) {
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("userType");
    }
  }, [isAuthenticated, userType]);

  return (
    <div className="min-h-screen p-6">
      {!isAuthenticated ? (
        <AuthPage
          onLogin={() => {
            setIsAuthenticated(true);
            setUserType("login");
          }}
          onSignup={() => {
            setIsAuthenticated(true);
            setUserType("signup");
          }}
        />
      ) : (
        <PatientDashboard
          userType={userType}
          onLogout={() => {
            setIsAuthenticated(false);
            setUserType(null);
            localStorage.clear(); // clear storage on logout
          }}
        />
      )}
    </div>
  );
}

function AuthPage({
  onLogin,
  onSignup,
}: {
  onLogin: () => void;
  onSignup: () => void;
}) {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto p-4 bg-gradient-to-br from-accent-dark to-accent rounded-full w-fit mb-4">
            <Lock className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {isSignup ? "Create Your Account" : "Login to Your Account"}
          </CardTitle>
          <CardDescription>
            Secure access to your patient history data
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Mobile Number / Email
              </label>
              <Input placeholder="Enter your mobile number or email" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <Input type="password" placeholder="Enter your password" />
            </div>

            {isSignup && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Confirm Password
                </label>
                <Input type="password" placeholder="Re-enter your password" />
              </div>
            )}

            <Button
              className="w-full bg-gradient-primary hover:shadow-glow"
              onClick={isSignup ? onSignup : onLogin}
            >
              {isSignup ? "Sign Up" : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsSignup(false)}
                    className="text-accent-dark cursor-pointer font-medium hover:underline"
                  >
                    Login
                  </span>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setIsSignup(true)}
                    className="text-accent-dark cursor-pointer font-medium hover:underline"
                  >
                    Sign Up
                  </span>
                </>
              )}
            </p>

            <div className="bg-gradient-card p-4 rounded-lg border border-border mt-4">
              <div className="flex items-center space-x-2 text-accent-dark mb-2">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Why Authentication?</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your medical records contain sensitive information. Authentication ensures
                only you and authorized healthcare providers can access your data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PatientDashboard({
  userType,
  onLogout,
}: {
  userType: "login" | "signup" | null;
  onLogout: () => void;
}) {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Lab Results", "Imaging", "Consultation", "Prescription", "Other"];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showNoRecords = userType === "signup";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-accent-dark to-accent rounded-xl">
            <FolderOpen className="w-8 h-8 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Patient History Management
            </h1>
            <p className="text-muted-foreground">
              Securely store and manage your medical records
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Search + Upload Section */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary" />
              <span>Search Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search your medical documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-secondary" />
              <span>Upload Document</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-br from-secondary to-secondary/80 hover:shadow-glow">
              <Upload className="w-4 h-4 mr-2" />
              Add New Document
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Patient Reports */}
      <Card className="mb-8 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Patient Reports</span>
          </CardTitle>
          <CardDescription>
            {showNoRecords
              ? "No Records Available"
              : "View detailed medical reports and consultation summaries"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showNoRecords ? (
            <PatientReportViewer />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No Records Available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents and Storage - only for login users */}
      {!showNoRecords && (
        <>
          <div className="grid gap-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Your Medical Documents ({filteredDocuments.length})
              </h2>
            </div>

            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="shadow-card hover:shadow-primary transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-primary rounded-lg">
                        <FileText className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Type: {doc.type}</span>
                          <span>Size: {doc.size}</span>
                          <span>Date: {new Date(doc.date).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className="mt-2 bg-accent/10 text-accent-dark">
                          {doc.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>

                      <ShareButton
                        title={`Medical Document: ${doc.name}`}
                        text={`Document Type: ${doc.type}, Date: ${new Date(doc.date).toLocaleDateString()}, Category: ${doc.category}`}
                        variant="outline"
                        size="sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Storage Usage</h3>
                  <p className="text-sm text-muted-foreground">
                    You've used 5.2 GB of your 10 GB storage limit
                  </p>
                </div>
                <div className="w-48">
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full"
                      style={{ width: "52%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">52% used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}