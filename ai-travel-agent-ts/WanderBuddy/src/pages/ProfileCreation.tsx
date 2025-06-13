import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, FileText, Heart } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:10000';

const ProfileCreation = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    nationality: '',
    country_of_residence: '',
    passport_number: '',
    passport_expiry: '',
    has_visa: false,
    visa_expiry: '',
    travel_persona: '',
    interests: '',
    preferred_languages: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        user_id: user?.id || user?.email || '',
        name: profileData.name,
        email: user?.email || '',
        nationality: profileData.nationality,
        country_of_residence: profileData.country_of_residence || null,
        passport_number: profileData.passport_number || null,
        passport_expiry: profileData.passport_expiry || null,
        has_visa: profileData.has_visa,
        visa_expiry: profileData.visa_expiry || null,
        travel_persona: profileData.travel_persona || 'flexible',
        interests: profileData.interests.split(',').map(i => i.trim()),
        preferred_languages: profileData.preferred_languages.split(',').map(i => i.trim()),
      };

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create profile');

      await response.json();
      toast({ title: 'Profile Created!', description: 'You’re all set!' });
      updateUser({ hasProfile: true, name: profileData.name });
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const travelPersonas = [
    'Adventure Seeker', 'Cultural Explorer', 'Luxury Traveler', 'Budget Backpacker',
    'Business Traveler', 'Family Vacationer', 'Solo Traveler', 'Romantic Getaway', 'flexible'
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-5xl backdrop-blur-sm bg-white/80 shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Travel Profile</CardTitle>
          <CardDescription>
            Personalize your travel experience with AI-powered planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Nationality *</Label>
                <Input
                  value={profileData.nationality}
                  onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Country of Residence</Label>
                <Input
                  value={profileData.country_of_residence}
                  onChange={(e) => setProfileData({ ...profileData, country_of_residence: e.target.value })}
                />
              </div>

              <div>
                <Label>Passport Number</Label>
                <Input
                  value={profileData.passport_number}
                  onChange={(e) => setProfileData({ ...profileData, passport_number: e.target.value })}
                />
              </div>
              <div>
                <Label>Passport Expiry</Label>
                <Input
                  type="date"
                  value={profileData.passport_expiry}
                  onChange={(e) => setProfileData({ ...profileData, passport_expiry: e.target.value })}
                />
              </div>
              <div className="flex items-center mt-6 space-x-2">
                <Checkbox
                  checked={profileData.has_visa}
                  onCheckedChange={(checked) =>
                    setProfileData({ ...profileData, has_visa: checked as boolean })
                  }
                />
                <Label>I have active travel visas</Label>
              </div>

              {profileData.has_visa && (
                <div className="col-span-3">
                  <Label>Visa Expiry</Label>
                  <Input
                    type="date"
                    value={profileData.visa_expiry}
                    onChange={(e) => setProfileData({ ...profileData, visa_expiry: e.target.value })}
                  />
                </div>
              )}

              <div className="col-span-1">
                <Label>Travel Persona</Label>
                <Select onValueChange={(value) => setProfileData({ ...profileData, travel_persona: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {travelPersonas.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label>Interests</Label>
                <Input
                  placeholder="e.g. hiking, food"
                  value={profileData.interests}
                  onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <Label>Languages</Label>
                <Input
                  placeholder="e.g. English, Arabic"
                  value={profileData.preferred_languages}
                  onChange={(e) => setProfileData({ ...profileData, preferred_languages: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Complete Profile & Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCreation;
