import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Edit,
  Save,
  Shield,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  bloodType: string;
  address: string;
  emergencyContact: string;
  allergies: string;
  medications: string;
}

const emptyProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  bloodType: "",
  address: "",
  emergencyContact: "",
  allergies: "",
  medications: "",
};

const requiredFields: (keyof UserProfile)[] = [
  "name",
  "email",
  "phone",
  "age",
  "gender",
  "bloodType",
  "emergencyContact",
  "allergies",
  "medications",
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [editProfile, setEditProfile] = useState<UserProfile>(emptyProfile);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    const missing = requiredFields.filter((f) => !editProfile[f].trim());
    if (missing.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all mandatory fields marked with * before saving.",
        variant: "destructive",
      });
      return;
    }

    setProfile(editProfile);
    setIsEditing(false);
    setIsSubmitted(true);
  };

  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditProfile((prev) => ({ ...prev, [field]: value }));
  };

  const isRequired = (field: keyof UserProfile) => requiredFields.includes(field);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground">
                  {isSubmitted
                    ? "Manage your account and medical information"
                    : "Please fill in your details to create your profile"}
                </p>
              </div>
            </div>

            {isSubmitted && !isEditing && (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Enter Your Information" : "Profile Details"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Fields marked with * are mandatory"
                : "Your saved profile information"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", field: "name" },
                { label: "Email Address", field: "email" },
                { label: "Phone Number", field: "phone" },
                { label: "Age", field: "age" },
                { label: "Gender", field: "gender" },
                { label: "Blood Type", field: "bloodType" },
                { label: "Address", field: "address" },
                {
                  label: "Emergency Contact (Name - Phone)",
                  field: "emergencyContact",
                },
                { label: "Known Problems", field: "allergies" },
                { label: "Current Medications", field: "medications" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {label}
                    {isRequired(field as keyof UserProfile) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {isEditing ? (
                    <Input
                      value={editProfile[field as keyof UserProfile]}
                      onChange={(e) =>
                        handleInputChange(field as keyof UserProfile, e.target.value)
                      }
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                  ) : (
                    <p className="text-foreground">
                      {profile[field as keyof UserProfile] || "Not provided"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Section */}
        {isSubmitted && !isEditing && (
          <Card className="mt-6 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Security & Privacy</span>
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Change Password
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
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
