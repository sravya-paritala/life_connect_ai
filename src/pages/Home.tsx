import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LearnMoreModal } from '@/components/ui/LearnMoreModal';
import { Logo } from '@/components/ui/Logo';
import { FileText, Phone, FolderOpen, Sparkles, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import hospitalWallpaper from '@/assets/hospital-wallpaper.jpg';

const features = [
  {
    icon: FileText,
    title: 'Report Summariser',
    description: 'Upload medical reports and get AI-powered summaries instantly. Shareable, translatable, and readable aloud.',
    gradient: 'bg-gradient-to-br from-primary to-primary-glow',
    steps: [
      { title: 'Upload Document', description: 'Choose from PDF, JPG, PNG, or DOCX formats and upload your medical report.' },
      { title: 'AI Processing', description: 'Our AI analyzes and extracts key information from your document.' },
      { title: 'Review Summary', description: 'Get a clear, concise summary of the medical report.' },
      { title: 'Share & Translate', description: 'Share via link/PDF or translate to Telugu, Hindi, or English.' },
      { title: 'Listen', description: 'Use text-to-speech to have the summary read aloud.' }
    ],
    features: ['Multi-format Upload', 'AI Summarization', 'Multi-language Support', 'Text-to-Speech', 'Easy Sharing']
  },
  {
    icon: Phone,
    title: 'Emergency Report Transmitter',
    description: 'Voice-driven emergency questionnaire for quick medical assessment and report generation.',
    gradient: 'bg-gradient-to-br from-secondary to-secondary/80',
    steps: [
      { title: 'Choose User Type', description: 'Select between General Public or Hospital Staff for appropriate questionnaire.' },
      { title: 'Voice Questions', description: 'Answer medical questions via voice or text input.' },
      { title: 'AI Processing', description: 'Responses are converted into a comprehensive medical summary.' },
      { title: 'Review Summary', description: 'Check the generated medical assessment summary.' },
      { title: 'Share Instantly', description: 'Send via WhatsApp/SMS to medical professionals or emergency contacts.' }
    ],
    features: ['Voice Recognition', 'Smart Questionnaire', 'Instant Reports', 'Emergency Sharing', 'Professional Format']
  },
  {
    icon: FolderOpen,
    title: 'Patient History Management',
    description: 'Securely store, organize, and manage medical records with authentication and doctor consent features.',
    gradient: 'bg-gradient-to-br from-accent-dark to-accent',
    steps: [
      { title: 'Secure Login', description: 'Create account or log in to access your personal medical records.' },
      { title: 'Upload Documents', description: 'Store medical reports with custom filenames for easy organization.' },
      { title: 'Organize Records', description: 'Categorize and manage your medical history efficiently.' },
      { title: 'Doctor Access', description: 'Grant permission to healthcare providers when needed.' },
      { title: 'Profile Management', description: 'Update personal information and medical preferences.' }
    ],
    features: ['Secure Storage', 'Doctor Consent', 'File Organization', 'Access Control', 'Profile Management']
  }
];

const highlights = [
  { icon: Sparkles, text: 'AI-Powered Intelligence' },
  { icon: Shield, text: 'Secure & Private' },
  { icon: Zap, text: 'Lightning Fast' }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Logo */}
      <Logo />
      
      {/* Hero Section with Hospital Wallpaper */}
      <div 
        className="relative h-96 bg-cover bg-center flex flex-col items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${hospitalWallpaper})` 
        }}
      >
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-primary-foreground px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            LifeConnectAI
          </h1>
          <p className="text-lg md:text-xl mb-4 max-w-2xl mx-auto">
            Your AI-powered healthcare companion for smarter medical management
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="flex items-center space-x-2 bg-primary-foreground/20 px-3 py-1 rounded-full">
                  <Icon className="w-3 h-3" />
                  <span className="text-xs font-medium">{highlight.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* App Purpose Section */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Revolutionizing Healthcare with AI
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            LifeConnectAI combines artificial intelligence with healthcare to provide instant medical report analysis, 
            emergency response assistance, and secure patient data management. Our platform empowers both patients 
            and healthcare professionals with intelligent tools for better medical outcomes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto space-y-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-primary transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  <div className={`w-full lg:w-2/3 p-6 ${feature.gradient}`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-primary-foreground/20 rounded-xl">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-primary-foreground">
                          {feature.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                          AI-Powered
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-primary-foreground/90 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                  
                  <div className="w-full lg:w-1/3 p-6 bg-card">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {feature.features.slice(0, 3).map((feat, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {feat}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-3">
                        <LearnMoreModal
                          title={feature.title}
                          description={feature.description}
                          steps={feature.steps}
                          features={feature.features}
                        />
                        <Link to={feature.title === 'Report Summariser' ? '/report-summariser' : 
                                 feature.title === 'Emergency Report Transmitter' ? '/emergency' : 
                                 '/patient-history'}>
                          <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all">
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* App Benefits */}
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-card rounded-2xl border border-border">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Why Choose LifeConnectAI?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Intelligent Analysis</h4>
              <p className="text-sm text-muted-foreground">Get instant AI-powered medical insights in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Enterprise-grade security keeps your data protected.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-dark to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Lightning Fast</h4>
              <p className="text-sm text-muted-foreground">Process medical reports in seconds, not minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}