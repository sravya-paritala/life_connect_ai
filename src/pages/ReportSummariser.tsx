import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DataVisualization } from '@/components/ui/DataVisualization';
import { FileText, Upload, Camera, Download, Share2, Volume2, Highlighter, Square, Play, Pause } from 'lucide-react';
import ShareButton from '@/components/ui/ShareButton';

const supportedFormats = ['PDF', 'JPG', 'PNG', 'DOCX'];

export default function ReportSummariser() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [currentText, setCurrentText] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Dummy translations for all supported languages
  const translations = {
    Telugu: `**రోగి నివేదిక సారాంశం**\n\n**రోగి సమాచారం:** జాన్ డో, 45 సంవత్సరాలు, పురుషుడు\n\n**ప్రధాన కనుగొనబడిన అంశాలు:**\n• రక్తపోత్తు: 140/90 mmHg (అధికం)\n• గుండె వేగం: 82 bpm (సాధారణం)\n• రక్తంలో చక్కెర: 180 mg/dL (అధికం)`,
    Hindi: `**मरीज़ रिपोर्ट सारांश**\n\n**मरीज़ की जानकारी:** जॉन डो, 45 वर्ष, पुरुष\n\n**मुख्य निष्कर्ष:**\n• रक्तचाप: 140/90 mmHg (उच्च)\n• हृदय गति: 82 bpm (सामान्य)\n• रक्त शर्करा: 180 mg/dL (उच्च)`,
    Tamil: `**நோயாளர் அறிக்கை சுருக்கம்**\n\n**நோயாளர் தகவல்:** ஜான் டோ, 45 வயது, ஆண்\n\n**முக்கிய கண்டுபிடிப்புகள்:**\n• இரத்த அழுத்தம்: 140/90 mmHg (அதிகம்)\n• இதய துடிப்பு: 82 bpm (சாதாரணம்)`,
    Malayalam: `**രോഗി റിപ്പോർട്ട് സംഗ്രഹം**\n\n**രോഗി വിവരങ്ങൾ:** ജോൺ ഡോ, 45 വയസ്സ്, പുരുഷൻ\n\n**പ്രധാന കണ്ടെത്തലുകൾ:**\n• രക്തസമ്മർദ്ദം: 140/90 mmHg (ഉയർന്നത്)\n• ഹൃദയമിടിപ്പ്: 82 bpm (സാധാരണം)`,
    Kannada: `**ರೋಗಿಯ ವರದಿ ಸಾರಾಂಶ**\n\n**ರೋಗಿಯ ಮಾಹಿತಿ:** ಜಾನ್ ಡೋ, 45 ವರ್ಷ, ಪುರುಷ\n\n**ಮುಖ್ಯ ಸಂಶೋಧನೆಗಳು:**\n• ರಕ್ತದೊತ್ತಡ: 140/90 mmHg (ಅಧಿಕ)\n• ಹೃದಯ ಬಡಿತ: 82 bpm (ಸಾಮಾನ್ಯ)`,
    Bengali: `**রোগীর রিপোর্ট সারসংক্ষেপ**\n\n**রোগীর তথ্য:** জন ডো, ৪৫ বছর, পুরুষ\n\n**প্রধান অনুসন্ধানসমূহ:**\n• রক্তচাপ: ১৪০/৯০ mmHg (উচ্চ)\n• হৃদস্পন্দন: ৮২ bpm (স্বাভাবিক)`,
    Rajasthani: `**मरीज री रिपोर्ट सारांश**\n\n**मरीज री जानकारी:** जॉन डो, 45 साल, पुरुष\n\n**मुख्य बात:**\n• ब्लड प्रेशर: 140/90 mmHg (ज्यादा)\n• दिल री धड़कन: 82 bpm (सामान्य)`,
    Marathi: `**रुग्ण अहवाल सारांश**\n\n**रुग्ण माहिती:** जॉन डो, ४५ वर्षे, पुरुष\n\n**मुख्य निष्कर्ष:**\n• रक्तदाब: १४०/९० mmHg (जास्त)\n• हृदयाचे ठोके: ८२ bpm (सामान्य)`
  };

  const handleTranslate = (language: string) => {
    if (language === 'English') {
      setCurrentText(summary);
    } else if (translations[language as keyof typeof translations]) {
      setCurrentText(translations[language as keyof typeof translations]);
    }
    setCurrentLanguage(language);
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        // Stop reading
        window.speechSynthesis.cancel();
        setIsReading(false);
        setSpeechUtterance(null);
      } else {
        // Start reading
        const utterance = new SpeechSynthesisUtterance(currentText || summary);
        
        // Set language-specific voice
        const voices = window.speechSynthesis.getVoices();
        let preferredVoice = null;
        
        const langMap: { [key: string]: string } = {
          'Telugu': 'te-IN',
          'Hindi': 'hi-IN',
          'Tamil': 'ta-IN',
          'Malayalam': 'ml-IN',
          'Kannada': 'kn-IN',
          'Bengali': 'bn-IN',
          'Rajasthani': 'hi-IN',
          'Marathi': 'mr-IN'
        };
        
        utterance.lang = langMap[currentLanguage] || 'en-US';
        
        if (currentLanguage !== 'English') {
          preferredVoice = voices.find(voice => 
            voice.lang.includes(utterance.lang.split('-')[0]) || 
            voice.lang.includes('hi-IN')
          );
        } else {
          preferredVoice = voices.find(voice => voice.lang.includes('en'));
        }
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsReading(false);
          setSpeechUtterance(null);
        };
        
        setSpeechUtterance(utterance);
        setIsReading(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.log('Speech synthesis not supported');
    }
  };

  const handleScanDocument = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const handleCaptureDocument = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
      
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        const defaultSummary = `**Patient Report Summary**\n\n**Patient Information:** John Doe, 45 years old, Male\n\n**Key Findings:**\n• Blood pressure: 140/90 mmHg (elevated)\n• Heart rate: 82 bpm (normal)\n• Blood glucose: 180 mg/dL (high)\n• Cholesterol: 245 mg/dL (borderline high)\n\n**Diagnosis:** Hypertension with diabetes mellitus type 2\n\n**Recommendations:**\n• Start antihypertensive medication\n• Begin diabetes management protocol\n• Lifestyle modifications recommended\n• Follow-up in 2 weeks\n\n**Priority Level:** Medium - requires ongoing monitoring and treatment adjustments.`;
        setSummary(defaultSummary);
        setCurrentText(defaultSummary);
        setCurrentLanguage('English');
        setIsProcessing(false);
      }, 3000);
    }
  };

  const handleHighlight = () => {
    setIsHighlighted(!isHighlighted);
  };

  const handleDownloadPDF = () => {
    // Create a simple text file for demonstration
    const element = document.createElement('a');
    const file = new Blob([currentText || summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'medical-report-summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      
      // Simulate AI processing
      setTimeout(() => {
        const defaultSummary = `
**Patient Report Summary**

**Patient Information:** John Doe, 45 years old, Male

**Key Findings:**
• Blood pressure: 140/90 mmHg (elevated)
• Heart rate: 82 bpm (normal)
• Blood glucose: 180 mg/dL (high)
• Cholesterol: 245 mg/dL (borderline high)

**Diagnosis:** Hypertension with diabetes mellitus type 2

**Recommendations:**
• Start antihypertensive medication
• Begin diabetes management protocol
• Lifestyle modifications recommended
• Follow-up in 2 weeks

**Priority Level:** Medium - requires ongoing monitoring and treatment adjustments.
        `;
        setSummary(defaultSummary);
        setCurrentText(defaultSummary);
        setCurrentLanguage('English');
        setIsProcessing(false);
      }, 3000);
    }
  };

  const handleAction = (action: string) => {
    if (action === 'speak') {
      handleReadAloud();
    } else {
      console.log(`Performing action: ${action}`);
      // In real implementation, these would call respective APIs
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Report Summariser</h1>
              <p className="text-muted-foreground">AI-powered medical report analysis and summarization</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Upload Medical Report</span>
            </CardTitle>
            <CardDescription>
              Upload your medical report for AI-powered analysis and summarization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Supported Formats */}
              <div>
                <h4 className="font-medium mb-3">Supported Formats:</h4>
                <div className="flex flex-wrap gap-2">
                  {supportedFormats.map((format) => (
                    <Badge key={format} variant="outline" className="bg-accent/10 text-accent-dark">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-gradient-primary rounded-full">
                      <Upload className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-2">
                        Click to upload your medical report
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Or drag and drop your file here
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Alternative Upload Methods */}
              <div className="flex justify-center space-x-4">
                <Button variant="outline" className="flex items-center space-x-2" onClick={handleScanDocument}>
                  <Camera className="w-4 h-4" />
                  <span>Scan Document</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Status */}
        {uploadedFile && (
          <Card className="mb-8 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {isProcessing ? (
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {isProcessing ? 'Processing your report...' : 'Report processed successfully'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    File: {uploadedFile.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Scan Document</h3>
              <video ref={videoRef} autoPlay className="w-full rounded-lg mb-4" />
              <div className="flex gap-3">
                <Button onClick={handleCaptureDocument} className="flex-1">
                  Capture
                </Button>
                <Button variant="outline" onClick={() => {
                  if (videoRef.current) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                  }
                  setIsCameraOpen(false);
                }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Results */}
        {summary && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI-Generated Summary ({currentLanguage})</span>
                <Badge variant="secondary" className="bg-accent/20 text-accent-dark">
                  Ready to Share
                </Badge>
              </CardTitle>
              <CardDescription>
                Your medical report has been analyzed and summarized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Overview Section */}
                <div className="bg-gradient-card p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Overview</h4>
                  <div className="text-sm text-muted-foreground">
                    <strong>Patient:</strong> John Doe, 45 years, Male<br/>
                    <strong>Risk Level:</strong> Medium<br/>
                    <strong>Key Issues:</strong> Hypertension, Diabetes Type 2
                  </div>
                </div>

                {/* Detailed Summary Content */}
                <div className="bg-gradient-card p-6 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-3">Detailed Summary</h4>
                  <pre 
                    className={`whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed ${
                      isHighlighted ? 'highlight-key-points' : ''
                    }`}
                    style={isHighlighted ? {
                      background: 'linear-gradient(120deg, transparent 0%, rgba(255, 255, 0, 0.3) 20%, rgba(255, 255, 0, 0.3) 80%, transparent 100%)'
                    } : {}}
                  >
                    {currentText || summary}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <ShareButton
                    title="Medical Report Summary"
                    text={currentText || summary}
                  />
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={handleHighlight}
                  >
                    <Highlighter className="w-4 h-4" />
                    <span>{isHighlighted ? 'Remove Highlight' : 'Highlight'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={handleReadAloud}
                  >
                    {isReading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isReading ? 'Stop Reading' : 'Read Aloud'}</span>
                  </Button>
                </div>

                {/* Translation Options */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Available languages:</span>
                  {['English', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'Bengali', 'Rajasthani', 'Marathi'].map((lang) => (
                    <Badge 
                      key={lang} 
                      variant={currentLanguage === lang ? "default" : "outline"} 
                      className={`cursor-pointer transition-colors ${
                        currentLanguage === lang 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent/10'
                      }`}
                      onClick={() => handleTranslate(lang)}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>

                {/* Data Visualization */}
                <DataVisualization />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}