import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user!, ...profileData };
      updateUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      let table = '';
      if (user.role === 'student') table = 'students';
      else if (user.role === 'professor') table = 'professors';
      else table = 'admins';
      const { data, error } = await supabase
        .from(table)
        .select('id, password')
        .eq('email', user.email)
        .single();
      if (error || !data) {
        toast({ title: "Error", description: "User not found.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const passwordMatch = bcrypt.compareSync(passwordData.currentPassword, data.password);
      if (!passwordMatch) {
        toast({ title: "Authentication failed", description: "Current password is incorrect.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const hashedPassword = bcrypt.hashSync(passwordData.newPassword, 10);
      const { error: updateError } = await supabase
        .from(table)
        .update({ password: hashedPassword })
        .eq('id', data.id);
      if (updateError) {
        toast({ title: "Error", description: "Failed to change password. Please try again.", variant: "destructive" });
      } else {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast({ title: "Password changed", description: "Your password has been updated successfully." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to change password. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={user?.role === 'student' || user?.role === 'professor'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={user?.role === 'student' || user?.role === 'professor'}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={user?.role === 'student' || user?.role === 'professor'}
                  />
                </div>

                {(user?.role === 'administrator' || user?.role === 'super_admin') && (
                  <div>
                    <span className="text-sm text-gray-500">Role:</span>
                    <p className="font-medium capitalize">{user?.role.replace('_', ' ')}</p>
                  </div>
                )}

                {(user?.role === 'administrator' || user?.role === 'super_admin') && (
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={isLoading}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-w-md">
                  <div className="relative flex items-center">
                    <Input
                      id="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="pr-10 w-full"
                      style={{ maxWidth: 400 }}
                      placeholder="Current Password"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswords((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 h-8 w-8"
                      style={{ minWidth: 0 }}
                      tabIndex={-1}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div>
                    <Input
                      id="newPassword"
                      type={showPasswords ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full"
                      style={{ maxWidth: 400 }}
                      placeholder="New Password"
                    />
                  </div>
                  <div>
                    <Input
                      id="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full"
                      style={{ maxWidth: 400 }}
                      placeholder="Confirm New Password"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handlePasswordChange} 
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                  className="w-full md:w-auto"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Notification preferences coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
