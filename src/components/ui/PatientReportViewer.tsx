import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar, User, Activity, Stethoscope, Download } from 'lucide-react';
import ShareButton from './ShareButton';

interface PatientReport {
  id: string;
  title: string;
  date: string;
  doctor: string;
  type: string;
  status: string;
  summary: string;
  details: {
    patientInfo: {
      name: string;
      age: number;
      gender: string;
      id: string;
    };
    vitals: {
      bloodPressure: string;
      heartRate: string;
      temperature: string;
      oxygenSaturation: string;
    };
    diagnosis: string;
    medications: string[];
    recommendations: string[];
    followUp: string;
  };
}

const mockReports: PatientReport[] = [
  {
    id: '1',
    title: 'Annual Health Checkup Report',
    date: '2024-03-15',
    doctor: 'Dr. Sarah Johnson',
    type: 'General Consultation',
    status: 'Complete',
    summary: 'Comprehensive health examination with blood work analysis. Patient shows good overall health with minor recommendations for lifestyle improvements.',
    details: {
      patientInfo: {
        name: 'Anand Kumar',
        age: 45,
        gender: 'Male',
        id: 'P-2024-001'
      },
      vitals: {
        bloodPressure: '128/82 mmHg',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        oxygenSaturation: '98%'
      },
      diagnosis: 'Healthy adult with pre-hypertension. Mild vitamin D deficiency detected.',
      medications: [
        'Vitamin D3 1000 IU daily',
        'Omega-3 fish oil 1000mg daily'
      ],
      recommendations: [
        'Reduce sodium intake to <2300mg daily',
        'Increase physical activity to 150 minutes/week',
        'Regular blood pressure monitoring',
        'Follow Mediterranean diet pattern'
      ],
      followUp: 'Schedule follow-up in 6 months for blood pressure and vitamin D level check'
    }
  },
  {
    id: '2',
    title: 'Cardiology Consultation Report',
    date: '2024-02-28',
    doctor: 'Dr. Michael Chen',
    type: 'Specialist Consultation',
    status: 'Complete',
    summary: 'Patient referred for chest pain evaluation. ECG and stress test performed with normal results. Recommended lifestyle modifications.',
    details: {
      patientInfo: {
        name: 'Anand Kumar',
        age: 45,
        gender: 'Male',
        id: 'P-2024-001'
      },
      vitals: {
        bloodPressure: '135/88 mmHg',
        heartRate: '78 bpm',
        temperature: '98.4°F',
        oxygenSaturation: '99%'
      },
      diagnosis: 'Non-cardiac chest pain. Likely musculoskeletal origin. Normal cardiac function.',
      medications: [
        'Ibuprofen 400mg as needed for chest discomfort',
        'Continue current medications'
      ],
      recommendations: [
        'Stress management techniques',
        'Ergonomic workplace assessment',
        'Regular cardiovascular exercise',
        'Avoid prolonged sitting'
      ],
      followUp: 'Return if symptoms worsen or new cardiac symptoms develop'
    }
  },
  {
    id: '3',
    title: 'Blood Work Analysis',
    date: '2024-01-20',
    doctor: 'Dr. Lisa Park',
    type: 'Laboratory Results',
    status: 'Complete',
    summary: 'Comprehensive metabolic panel and lipid profile analysis. Most values within normal range with slightly elevated cholesterol.',
    details: {
      patientInfo: {
        name: 'Anand Kumar',
        age: 45,
        gender: 'Male',
        id: 'P-2024-001'
      },
      vitals: {
        bloodPressure: '130/85 mmHg',
        heartRate: '75 bpm',
        temperature: '98.5°F',
        oxygenSaturation: '98%'
      },
      diagnosis: 'Borderline high cholesterol (LDL: 145 mg/dL). Otherwise normal metabolic panel.',
      medications: [
        'Consider statin therapy if lifestyle changes insufficient',
        'Omega-3 supplementation'
      ],
      recommendations: [
        'Low saturated fat diet',
        'Increase soluble fiber intake',
        'Regular aerobic exercise',
        'Recheck lipid panel in 3 months'
      ],
      followUp: 'Lipid panel recheck in 12 weeks'
    }
  }
];

export default function PatientReportViewer() {
  const [selectedReport, setSelectedReport] = useState<PatientReport | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Patient Reports</h3>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          {mockReports.length} Reports Available
        </Badge>
      </div>

      {mockReports.map((report) => (
        <Card key={report.id} className="shadow-card hover:shadow-primary transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{report.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{report.doctor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Stethoscope className="w-3 h-3" />
                      <span>{report.type}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.summary}
                  </p>
                  <Badge 
                    variant="outline" 
                    className="mt-2 bg-accent/10 text-accent-dark"
                  >
                    {report.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-primary" />
                        <span>{report.title}</span>
                      </DialogTitle>
                      <DialogDescription>
                        {report.doctor} • {new Date(report.date).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <ScrollArea className="max-h-[60vh] pr-4">
                      <div className="space-y-6">
                        {/* Patient Information */}
                        <div className="bg-gradient-card p-4 rounded-lg border border-border">
                          <h5 className="font-semibold text-foreground mb-3">Patient Information</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Name:</span>
                              <p className="font-medium text-foreground">{report.details.patientInfo.name}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Patient ID:</span>
                              <p className="font-medium text-foreground">{report.details.patientInfo.id}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Age:</span>
                              <p className="font-medium text-foreground">{report.details.patientInfo.age} years</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Gender:</span>
                              <p className="font-medium text-foreground">{report.details.patientInfo.gender}</p>
                            </div>
                          </div>
                        </div>

                        {/* Vital Signs */}
                        <div className="bg-gradient-card p-4 rounded-lg border border-border">
                          <h5 className="font-semibold text-foreground mb-3">Vital Signs</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Blood Pressure:</span>
                              <p className="font-medium text-foreground">{report.details.vitals.bloodPressure}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Heart Rate:</span>
                              <p className="font-medium text-foreground">{report.details.vitals.heartRate}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Temperature:</span>
                              <p className="font-medium text-foreground">{report.details.vitals.temperature}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Oxygen Saturation:</span>
                              <p className="font-medium text-foreground">{report.details.vitals.oxygenSaturation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Diagnosis */}
                        <div className="bg-gradient-card p-4 rounded-lg border border-border">
                          <h5 className="font-semibold text-foreground mb-3">Diagnosis</h5>
                          <p className="text-sm text-foreground">{report.details.diagnosis}</p>
                        </div>

                        {/* Medications */}
                        <div className="bg-gradient-card p-4 rounded-lg border border-border">
                          <h5 className="font-semibold text-foreground mb-3">Medications</h5>
                          <ul className="space-y-2">
                            {report.details.medications.map((med, index) => (
                              <li key={index} className="text-sm text-foreground flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span>{med}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-gradient-card p-4 rounded-lg border border-border">
                          <h5 className="font-semibold text-foreground mb-3">Recommendations</h5>
                          <ul className="space-y-2">
                            {report.details.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-foreground flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Follow-up */}
                        <div className="bg-gradient-card p-4 rounded-lg border border-border">
                          <h5 className="font-semibold text-foreground mb-3">Follow-up Instructions</h5>
                          <p className="text-sm text-foreground">{report.details.followUp}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                          <ShareButton
                            title={report.title}
                            text={`Medical Report: ${report.summary}`}
                          />
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}