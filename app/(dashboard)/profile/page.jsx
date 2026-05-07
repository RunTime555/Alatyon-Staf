import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { mockPatient } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
      <Header title="Profile" />

      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <DashboardCard>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={mockPatient.avatar || undefined}
                  alt={mockPatient.fullName}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {mockPatient.firstName[0]}
                  {mockPatient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {mockPatient.fullName}
                </h1>
                <p className="text-muted-foreground">
                  Patient ID: #{mockPatient.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  MRN: {mockPatient.mrn}
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </DashboardCard>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-medium text-foreground">
                    {new Date(mockPatient.dateOfBirth).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
                  <span className="text-sm font-medium">G</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium text-foreground">{mockPatient.gender}</p>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{mockPatient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{mockPatient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">{mockPatient.address}</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
