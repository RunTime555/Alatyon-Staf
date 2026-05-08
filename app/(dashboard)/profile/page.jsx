"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Camera, Save, X, Upload } from "lucide-react";
import { mockPatient } from "@/lib/mock-data";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  
  // የፕሮፋይል ዳታ ስቴት
  const [profile, setProfile] = useState({
    fullName: mockPatient.fullName,
    email: "rehmet@example.com",
    phone: "+251 911 22 33 44",
    address: "Bahir Dar, Ethiopia",
    avatar: null // ለተሰቀለው ፎቶ
  });

  // ፎቶ ሲመረጥ የሚሰራ ተግባር
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // እዚህ ጋር ከ Backend ጋር የሚገናኝ logic ይጨመራል
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50">
      <Header title="My Profile" />
      
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* የላይኛው ሰማያዊ ቦክስ (Header Box) */}
        <DashboardCard className="relative overflow-hidden p-0 border-none shadow-md">
          {/* ሰማያዊ ዳራ (Dark Blue Background) */}
          <div className="h-40 bg-[#004a7c] w-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent" />
          </div>
          
          <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-10">
            {/* የፎቶ መስቀያ ክፍል */}
            <div className="relative group">
              <div className="h-36 w-36 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-lg">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-[#004a7c]">
                    {profile.fullName[0]}
                  </span>
                )}
              </div>
              
              {/* የካሜራ ምልክት (ሲነካ ፋይል መምረጫ ይከፍታል) */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition-colors border border-slate-200 text-[#004a7c]"
                title="Upload Photo"
              >
                <Camera size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-2xl font-bold text-slate-800">{profile.fullName}</h1>
              <p className="text-slate-500 font-medium">Patient ID: #{mockPatient.mrn}</p>
            </div>

            <div className="mb-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-[#004a7c] hover:bg-[#003a63] gap-2">
                    <Save size={16} /> Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                    <X size={16} /> Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-[#004a7c] hover:bg-[#003a63]"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </DashboardCard>

        {/* የዝርዝር መረጃዎች Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard className="border-t-4 border-t-[#004a7c]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <User size={18} className="text-[#004a7c]" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Full Name</Label>
                {isEditing ? (
                  <Input 
                    value={profile.fullName} 
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})} 
                    className="focus:ring-[#004a7c]"
                  />
                ) : (
                  <p className="p-2 bg-slate-50 rounded border text-slate-700 font-medium">{profile.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600">Email Address</Label>
                {isEditing ? (
                  <Input 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})} 
                  />
                ) : (
                  <p className="p-2 bg-slate-50 rounded border text-slate-700 font-medium">{profile.email}</p>
                )}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="border-t-4 border-t-[#004a7c]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <Phone size={18} className="text-[#004a7c]" /> Contact Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Phone Number</Label>
                {isEditing ? (
                  <Input 
                    value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                  />
                ) : (
                  <p className="p-2 bg-slate-50 rounded border text-slate-700 font-medium">{profile.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600">Home Address</Label>
                {isEditing ? (
                  <Input 
                    value={profile.address} 
                    onChange={(e) => setProfile({...profile, address: e.target.value})} 
                  />
                ) : (
                  <p className="p-2 bg-slate-50 rounded border text-slate-700 font-medium">{profile.address}</p>
                )}
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}