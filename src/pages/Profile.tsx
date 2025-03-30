import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CreditCard, Mail, MapPin, Phone, Shield, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Initial user data
const initialUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "New York, NY",
  memberSince: "Jan 2023",
  avatarUrl: "/avatar-placeholder.jpg",
  plan: "Premium Investor",
  planPrice: "$29.99/month",
  cardNumber: "**** **** **** 4567",
  cardExpiry: "06/25",
  cardCvc: "***"
};

const Profile: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [userData, setUserData] = useState(initialUserData);
  const [formData, setFormData] = useState(initialUserData);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check URL for tab parameter (e.g., ?tab=security)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    
    if (tabParam === "settings") {
      setActiveTab("security"); // Map "settings" to the security tab
    } else if (tabParam === "general" || tabParam === "security" || tabParam === "billing") {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Save general profile changes
  const handleSaveChanges = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUserData(formData);
      setIsLoading(false);
      setIsEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };

  // Handle password update
  const handlePasswordUpdate = () => {
    setIsLoading(true);
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsLoading(false);
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    }, 1000);
  };

  // Handle payment method update
  const handleUpdatePayment = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUserData(prev => ({
        ...prev,
        cardNumber: formData.cardNumber,
        cardExpiry: formData.cardExpiry,
        cardCvc: formData.cardCvc,
      }));
      setIsLoading(false);
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been updated successfully.",
      });
    }, 1000);
  };

  // Toggle edit profile mode
  const toggleEditProfile = () => {
    if (isEditingProfile) {
      // Discard changes
      setFormData(userData);
      setIsEditingProfile(false);
    } else {
      setIsEditingProfile(true);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData.avatarUrl} alt="Profile" />
              <AvatarFallback>{`${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`}</AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold">{`${userData.firstName} ${userData.lastName}`}</h3>
              <p className="text-muted-foreground">{userData.plan}</p>
            </div>
            
            <div className="w-full space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <span className="text-sm">{userData.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                <span className="text-sm">{userData.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <span className="text-sm">{userData.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <span className="text-sm">Member since {userData.memberSince}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={toggleEditProfile}
              variant={isEditingProfile ? "outline" : "default"}
            >
              {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Update your account information and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>
              
              {/* General Tab */}
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange}
                      disabled={!isEditingProfile} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      disabled={!isEditingProfile} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      disabled={!isEditingProfile} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      disabled={!isEditingProfile} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={formData.address} 
                      onChange={handleInputChange}
                      disabled={!isEditingProfile} 
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSaveChanges} 
                    disabled={!isEditingProfile || isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handlePasswordUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <h3 className="font-medium">{userData.plan}</h3>
                    <p className="text-sm text-muted-foreground">{userData.planPrice}</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input 
                      id="cardExpiry" 
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input 
                      id="cardCvc" 
                      value={formData.cardCvc}
                      type="password"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleUpdatePayment}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Payment Method"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 