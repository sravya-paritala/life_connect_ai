"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Phone, Users, UserCheck, Volume2, AlertTriangle, VolumeX, MapPin, Download, Send, Search } from 'lucide-react';
import ShareButton from '@/components/ui/ShareButton';
import { toast } from '@/hooks/use-toast';

/**
 * Local types for Web Speech API to avoid using `any` and satisfy ESLint
 * These mimic the minimal parts we use.
 */
declare global {
  interface Window {
    webkitSpeechRecognition?: {
      new (): SpeechRecognitionDef;
    };
    SpeechRecognition?: {
      new (): SpeechRecognitionDef;
    };
  }
}

interface SpeechRecognitionResultItem {
  0: { transcript: string };
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResultItem;
  length: number;
}

interface SpeechRecognitionEventDef {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionDef {
  lang: string;
  interimResults: boolean;
  maxAlternatives?: number;
  onresult?: ((e: SpeechRecognitionEventDef) => void) | null;
  onerror?: ((e: unknown) => void) | null;
  onend?: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
}

type UserType = 'general' | 'hospital' | null;
type QuestionnaireState = 'selection' | 'questions' | 'summary';
type QuestionType = 'text' | 'radio' | 'location';

interface Question {
  text: string;
  type: QuestionType;
  options?: string[];
}

const questions: Record<'general' | 'hospital', Question[]> = {
  general: [
    {
      text: "What is the emergency? (Describe briefly)",
      type: "radio",
      options: ["Accident", "Unconscious person", "Chest pain", "Fire", "Fall", "Other"]
    },
    {
      text: "Is the person conscious and responsive?",
      type: "radio",
      options: ["Yes - awake and responding", "No - unconscious", "Semi-conscious / confused"]
    },
    {
      text: "Is the person breathing normally?",
      type: "radio",
      options: ["Yes", "No / struggling to breathe", "Gasping / abnormal breathing"]
    },
    {
      text: "Are there visible injuries or bleeding?",
      type: "radio",
      options: ["Severe bleeding", "Minor bleeding", "Broken bone suspected", "Burns", "No visible injuries"]
    }
  ],
  hospital: [
    {
      text: "Primary complaint / reason for emergency",
      type: "radio",
      options: ["Skip", "Chest pain", "Dyspnea", "Trauma", "Seizure", "Altered consciousness", "Other"]
    },
    {
      text: "Time of onset / when symptoms started",
      type: "text",
      options: ["Skip"]
    },
    {
      text: "Patient's level of consciousness (AVPU)",
      type: "radio",
      options: ["Skip", "A - Alert", "V - Responds to voice", "P - Responds to pain", "U - Unresponsive"]
    },
    {
      text: "Vital signs (if available) - Heart rate",
      type: "text",
      options: ["Skip"]
    },
    {
      text: "Vital signs - Blood pressure",
      type: "text",
      options: ["Skip"]
    },
    {
      text: "Current breathing status",
      type: "radio",
      options: ["Skip", "Normal", "Respiratory distress", "Cyanosis", "Wheezing / crackles", "Not breathing / cardiac arrest"]
    },
    {
      text: "History of present illness (brief summary)",
      type: "text",
      options: ["Skip"]
    },
    {
      text: "Past medical history",
      type: "radio",
      options: ["Skip", "Diabetes", "Hypertension", "Cardiac disease", "Stroke", "Asthma/COPD", "None", "Other"]
    },
    {
      text: "Medications / Allergies",
      type: "text",
      options: ["Skip"]
    }
  ]
};

const dummyHospitals = [
  { id: 1, name: "CityCare Multi-Specialty Hospital", lat: 17.3850, lng: 78.4867, distance: "2.3 km" },
  { id: 2, name: "Lifeline Emergency Center", lat: 17.3900, lng: 78.4900, distance: "3.1 km" },
  { id: 3, name: "HealthFirst Trauma Unit", lat: 17.3800, lng: 78.4800, distance: "1.8 km" },
  { id: 4, name: "MetroAid Medical Hospital", lat: 17.3950, lng: 78.4950, distance: "4.5 km" }
];

export default function Emergency() {
  const [userType, setUserType] = useState<UserType>(null);
  const [state, setState] = useState<QuestionnaireState>('selection');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [flowActive, setFlowActive] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionDef | null>(null);
  const timerRef = useRef<number | null>(null);

  const [transcript, setTranscript] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');
  const manualAnswerRef = useRef<string>('');
  const transcriptRef = useRef<string>('');
  const [textInput, setTextInput] = useState('');
  const [radioValue, setRadioValue] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isReadingPaused, setIsReadingPaused] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [status, setStatus] = useState<'idle'|'asking'|'listening'|'processing'|'done'>('idle');
  const [emergencyContacts] = useState([
    { name: 'John Smith', phone: '+91 9876543210', relation: 'Family' },
    { name: 'Sarah Johnson', phone: '+91 9876543211', relation: 'Friend' },
    { name: 'Dr. Michael Brown', phone: '+91 9876543212', relation: 'Doctor' }
  ]);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setState('questions');
    setCurrentQuestion(0);
    setResponses([]);
    setFlowActive(true);
  };

  const generateSummary = (allResponses: string[]) => {
    if (userType === 'general') {
      const hospitalName = selectedHospital ? dummyHospitals.find(h => h.id === selectedHospital)?.name : 'Not selected';
      setSummary(`Emergency Report Summary:
Emergency Type: ${allResponses[0]}
Patient Consciousness: ${allResponses[1]}
Breathing Status: ${allResponses[2]}
Injuries/Bleeding: ${allResponses[3]}
Selected Hospital: ${hospitalName}

Immediate medical attention recommended. Report has been sent to the selected hospital.`);
    } else {
      setSummary(`Emergency Medical Report:
Primary Complaint: ${allResponses[0]}
Time of Onset: ${allResponses[1]}
Consciousness (AVPU): ${allResponses[2]}
Heart Rate: ${allResponses[3]}
Blood Pressure: ${allResponses[4]}
Breathing Status: ${allResponses[5]}
History of Present Illness: ${allResponses[6]}
Past Medical History: ${allResponses[7]}
Medications/Allergies: ${allResponses[8]}

Recommendation: Immediate emergency care required. Report has been sent to the hospital.`);
    }
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Promise.resolve();
    try { window.speechSynthesis.cancel(); } catch (err) { /* ignore cancellation errors */ }
    return new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 1;
      u.pitch = 1;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  };

  const startRecognition = () => {
    const SRConstructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SRConstructor) { recognitionRef.current = null; return null; }

    // Create recognition instance using our typed constructor
    const rec = new SRConstructor() as SpeechRecognitionDef;
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    setTranscript('');
    transcriptRef.current = '';

    rec.onresult = (e: SpeechRecognitionEventDef) => {
      let collected = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        collected += e.results[i][0].transcript + ' ';
      }
      collected = collected.trim();
      setTranscript(collected);
      transcriptRef.current = collected;
    };

    rec.onerror = () => {
      // ignore recognition errors for now
    };

    try {
      rec.start();
    } catch (err) {
      // ignore start errors (e.g., permission denied or already started)
    }

    recognitionRef.current = rec;
    return rec;
  };

  const stopRecognition = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.onresult = null;
        rec.onerror = null;
        rec.stop();
      } catch (err) {
        // ignore stop errors
      }
    }
    recognitionRef.current = null;
  };

  const goNext = (answer: string) => {
    stopRecognition();
    setManualAnswer('');
    manualAnswerRef.current = '';
    setTextInput('');
    setRadioValue('');
    setStatus('processing');

    setResponses((prev) => {
      const normalized = answer ? answer : 'No response';
      const newRes = [...prev, normalized];
      const total = userType ? questions[userType].length : 0;
      if (newRes.length >= total) {
        try { window.speechSynthesis?.cancel(); } catch (err) { /* ignore */ }
        generateSummary(newRes);
        setState('summary');
        setFlowActive(false);
        setStatus('done');
        toast({
          title: "Report Generated",
          description: "Emergency report has been sent to the hospital (simulated)",
        });
      } else {
        setCurrentQuestion((q) => q + 1);
      }
      return newRes;
    });
  };

  const askAndWait = async () => {
    if (!userType) return;
    setStatus('asking');
    setTranscript('');
    transcriptRef.current = '';
    const currentQ = questions[userType][currentQuestion];
    await speak(currentQ.text);
    setStatus('listening');
    startRecognition();
    if (timerRef.current) { clearTimeout(timerRef.current); }
    timerRef.current = window.setTimeout(() => {
      const manual = manualAnswerRef.current?.trim();
      const voice = transcriptRef.current?.trim();
      const radio = radioValue?.trim();
      const answer = radio || manual || voice || 'No response';
      goNext(answer);
    }, 5000); // 5 seconds wait for response
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      stopRecognition();
      try { window.speechSynthesis?.cancel(); } catch (err) { /* ignore */ }
    };
  }, []);

  useEffect(() => {
    if (state === 'questions' && userType && flowActive) {
      askAndWait();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, userType, currentQuestion]);

  const handleManualSubmit = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    const manual = manualAnswerRef.current?.trim();
    const voice = transcriptRef.current?.trim();
    const radio = radioValue?.trim();
    const hospital = selectedHospital ? dummyHospitals.find(h => h.id === selectedHospital)?.name : '';
    const answer = hospital || radio || manual || voice || textInput || 'No response';
    goNext(answer);
  };

  const resetQuestionnaire = () => {
    setUserType(null);
    setState('selection');
    setCurrentQuestion(0);
    setResponses([]);
    setSummary('');
    setTranscript('');
    transcriptRef.current = '';
    setManualAnswer('');
    manualAnswerRef.current = '';
    setTextInput('');
    setRadioValue('');
    setSelectedHospital(null);
    setLocationEnabled(false);
    setFlowActive(false);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    stopRecognition();
    try { window.speechSynthesis?.cancel(); } catch (err) { /* ignore */ }
    setStatus('idle');
  };

  const handleLocationEnable = () => {
    setLocationEnabled(true);
    toast({
      title: "Location Enabled",
      description: "Showing nearby hospitals on the map",
    });
  };

  const handleHospitalSelect = (hospitalId: number) => {
    setSelectedHospital(hospitalId);
    const hospital = dummyHospitals.find(h => h.id === hospitalId);
    if (hospital) {
      setTextInput(hospital.name);
      setManualAnswer(hospital.name);
      manualAnswerRef.current = hospital.name;
      toast({
        title: "Hospital Selected",
        description: `${hospital.name} selected`,
      });
    }
  };

  const currentQ = userType && currentQuestion < questions[userType].length
    ? questions[userType][currentQuestion]
    : null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Alert Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl">
                <Phone className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Emergency Report Transmitter</h1>
                <p className="text-muted-foreground">Voice-driven emergency questionnaire system</p>
              </div>
            </div>

            {/* Alert Button - Top Right */}
            {state === 'selection' && (
              <Button
                variant="destructive"
                size="lg"
                onClick={() => {
                  emergencyContacts.forEach(contact => {
                    console.log(`🚨 Sending emergency alert to ${contact.name} at ${contact.phone}`);
                  });
                  toast({
                    title: "🚨 Alert Sent!",
                    description: `Emergency alert sent to ${emergencyContacts.length} contacts successfully (simulated)`,
                    variant: "destructive"
                  });
                }}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>ALERT</span>
              </Button>
            )}
          </div>
        </div>

        {/* User Type Selection */}
        {state === 'selection' && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Select User Type</CardTitle>
              <CardDescription>
                Choose your role to get the appropriate emergency questionnaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  className="cursor-pointer hover:shadow-primary transition-all duration-200 border-2 hover:border-primary/30"
                  onClick={() => handleUserTypeSelect('general')}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-gradient-primary rounded-full">
                        <Users className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">General Public</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          For family members, bystanders, or non-medical personnel reporting an emergency
                        </p>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          4 Questions
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-primary transition-all duration-200 border-2 hover:border-primary/30"
                  onClick={() => handleUserTypeSelect('hospital')}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-gradient-to-br from-accent-dark to-accent rounded-full">
                        <UserCheck className="w-8 h-8 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">Hospital Staff</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          For medical professionals with access to detailed patient information
                        </p>
                        <Badge variant="outline" className="bg-accent/10 text-accent-dark">
                          9 Questions
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questionnaire - Different layouts for General Public vs Hospital Staff */}
        {state === 'questions' && userType && currentQ && (
          <div className="space-y-6">
            {/* General Public Layout: Summary at top, Map at bottom */}
            {userType === 'general' && (
              <>
                {/* Emergency Medical Summary Card - Top */}
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Emergency Questionnaire</CardTitle>
                        <CardDescription>
                          Question {currentQuestion + 1} of {questions[userType].length}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-secondary/10 text-secondary">
                        General Public
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestion + 1) / questions[userType].length) * 100}%` }}
                        ></div>
                      </div>

                      {/* Current Question */}
                      <div className="bg-gradient-card p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          {currentQ.text}
                        </h3>

                        {/* Question Input Based on Type */}
                        {currentQ.type === 'text' && (
                          <Input
                            placeholder="Type your answer here"
                            value={textInput}
                            onChange={(e) => {
                              setTextInput(e.target.value);
                              setManualAnswer(e.target.value);
                              manualAnswerRef.current = e.target.value;
                            }}
                          />
                        )}

                        {currentQ.type === 'radio' && currentQ.options && (
                          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                            <div className="space-y-3">
                              {currentQ.options.map((opt) => (
                                <div key={opt} className="flex items-center space-x-2">
                                  <RadioGroupItem value={opt} id={opt} />
                                  <Label htmlFor={opt} className="cursor-pointer">{opt}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        )}

                        {/* Voice Status */}
                        <div className="mt-4 flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-secondary animate-pulse' : status === 'asking' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                          <span className="text-sm text-muted-foreground">
                            {status === 'asking' && '🎤 Reading question...'}
                            {status === 'listening' && '👂 Listening for your response...'}
                            {status === 'processing' && '⚙️ Processing...'}
                          </span>
                        </div>

                        {/* Detected Response */}
                        {(transcript || textInput || radioValue) && (
                          <div className="mt-4 bg-muted/30 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Detected Response:</p>
                            <p className="text-foreground font-medium">
                              {radioValue || textInput || transcript}
                            </p>
                          </div>
                        )}

                        <Button onClick={handleManualSubmit} className="w-full mt-4">
                          Submit & Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Card with Hospital Search - Always visible at bottom */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Hospital Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Hospital Search Bar */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search hospital by name or location"
                            value={hospitalSearch}
                            onChange={(e) => setHospitalSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        {!locationEnabled && (
                          <Button onClick={handleLocationEnable} size="sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            Enable Location
                          </Button>
                        )}
                      </div>

                      {/* Filtered Hospital List */}
                      <div className="space-y-2">
                        {dummyHospitals
                          .filter(h =>
                            hospitalSearch === '' ||
                            h.name.toLowerCase().includes(hospitalSearch.toLowerCase())
                          )
                          .map((hospital) => (
                            <div
                              key={hospital.id}
                              onClick={() => handleHospitalSelect(hospital.id)}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedHospital === hospital.id
                                  ? 'bg-primary/10 border-primary'
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-foreground">{hospital.name}</p>
                                  <p className="text-sm text-muted-foreground">{hospital.distance} away</p>
                                </div>
                                {selectedHospital === hospital.id && (
                                  <Badge className="bg-primary">Selected</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Live Map Visualization */}
                      {locationEnabled && (
                        <div className="mt-4">
                          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
                            <div className="relative w-full h-64 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg border overflow-hidden">
                              {/* Roads */}
                              <div className="absolute inset-0">
                                <div className="absolute top-8 left-0 w-full h-1 bg-gray-400"></div>
                                <div className="absolute top-16 left-0 w-full h-1 bg-gray-400"></div>
                                <div className="absolute top-24 left-0 w-full h-1 bg-gray-400"></div>
                                <div className="absolute left-8 top-0 w-1 h-full bg-gray-400"></div>
                                <div className="absolute left-16 top-0 w-1 h-full bg-gray-400"></div>
                                <div className="absolute left-24 top-0 w-1 h-full bg-gray-400"></div>
                              </div>

                              {/* Hospital Pins */}
                              {dummyHospitals.map((hospital, idx) => (
                                <div
                                  key={hospital.id}
                                  className={`absolute cursor-pointer transform hover:scale-110 transition-transform ${selectedHospital === hospital.id ? 'z-10' : ''}`}
                                  style={{
                                    top: `${20 + idx * 15}%`,
                                    left: `${15 + idx * 20}%`
                                  }}
                                  onClick={() => handleHospitalSelect(hospital.id)}
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedHospital === hospital.id ? 'bg-green-500 ring-4 ring-green-300' : 'bg-blue-500'}`}>
                                    <span className="text-white text-xs">🏥</span>
                                  </div>
                                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                                    {hospital.name}
                                  </div>
                                </div>
                              ))}

                              {/* User Location */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                              </div>
                            </div>

                            <div className="mt-4 text-xs text-muted-foreground">
                              Click on hospital pins to select
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Hospital Staff Layout: Full screen summary, no map */}
            {userType === 'hospital' && (
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Emergency Medical Questionnaire</CardTitle>
                      <CardDescription>
                        Question {currentQuestion + 1} of {questions[userType].length}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-accent/10 text-accent-dark">
                      Hospital Staff
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions[userType].length) * 100}%` }}
                      ></div>
                    </div>

                    {/* Current Question */}
                    <div className="bg-gradient-card p-6 rounded-lg border border-border">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {currentQ.text}
                      </h3>

                      {/* Question Input Based on Type */}
                      {currentQ.type === 'text' && (
                        <div className="space-y-4">
                          {currentQ.options && (
                            <RadioGroup value={radioValue} onValueChange={(val) => {
                              setRadioValue(val);
                              setTextInput(val);
                              setManualAnswer(val);
                              manualAnswerRef.current = val;
                            }}>
                              <div className="space-y-3">
                                {currentQ.options.map((opt) => (
                                  <div key={opt} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt} id={`hospital-${opt}`} />
                                    <Label htmlFor={`hospital-${opt}`} className="cursor-pointer">{opt}</Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                          <Input
                            placeholder="Or type your answer here"
                            value={textInput}
                            onChange={(e) => {
                              setTextInput(e.target.value);
                              setManualAnswer(e.target.value);
                              manualAnswerRef.current = e.target.value;
                            }}
                          />
                        </div>
                      )}

                      {currentQ.type === 'radio' && currentQ.options && (
                        <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                          <div className="space-y-3">
                            {currentQ.options.map((opt) => (
                              <div key={opt} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`hospital-radio-${opt}`} />
                                <Label htmlFor={`hospital-radio-${opt}`} className="cursor-pointer">{opt}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}

                      {/* Voice Status */}
                      <div className="mt-4 flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-secondary animate-pulse' : status === 'asking' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                        <span className="text-sm text-muted-foreground">
                          {status === 'asking' && '🎤 Reading question...'}
                          {status === 'listening' && '👂 Listening for your response...'}
                          {status === 'processing' && '⚙️ Processing...'}
                        </span>
                      </div>

                      {/* Detected Response */}
                      {(transcript || textInput || radioValue) && (
                        <div className="mt-4 bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Detected Response:</p>
                          <p className="text-foreground font-medium">
                            {radioValue || textInput || transcript}
                          </p>
                        </div>
                      )}

                      <Button onClick={handleManualSubmit} className="w-full mt-4">
                        Submit & Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Summary */}
        {state === 'summary' && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Emergency Medical Summary</span>
                <Badge variant="secondary" className="bg-accent/20 text-accent-dark">
                  Report Generated
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-generated medical summary based on the questionnaire responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Language Selection & Translation */}
                {isTranslating && (
                  <div className="mb-4">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="ml">Malayalam</SelectItem>
                        <SelectItem value="kn">Kannada</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="raj">Rajasthani</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Summary Content */}
                <div className="bg-gradient-card p-6 rounded-lg border border-border">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                    {translatedSummary || summary}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => {
                      if (!isReading) {
                        setIsReading(true);
                        const utterance = new SpeechSynthesisUtterance(summary);
                        speechRef.current = utterance;
                        speechSynthesis.speak(utterance);
                        utterance.onend = () => setIsReading(false);
                      }
                    }}
                    disabled={isReading}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Read Aloud</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => {
                      if (isReading) {
                        speechSynthesis.cancel();
                        setIsReading(false);
                        setIsReadingPaused(false);
                      }
                    }}
                    disabled={!isReading}
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Reading</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => {
                      const blob = new Blob([summary], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `emergency-report-${Date.now()}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast({
                        title: "Report Downloaded",
                        description: "Emergency report has been downloaded as a text file",
                      });
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => {
                      toast({
                        title: "Report Sent",
                        description: "Emergency report has been sent to the hospital (simulated)",
                      });
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Hospital</span>
                  </Button>
                </div>

                {/* Reset Button */}
                <div className="pt-4">
                  <Button
                    variant="ghost"
                    onClick={resetQuestionnaire}
                    className="w-full"
                  >
                    Start New Emergency Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
