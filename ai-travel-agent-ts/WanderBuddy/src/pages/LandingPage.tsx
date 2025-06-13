
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Plane, Globe, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    if (user) {
      if (user.hasProfile) {
        console.log('User has profile, navigating to home');
        navigate('/home');
      } else {
        navigate('/profile-setup');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (type: 'login' | 'register') => {
    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      toast({
        title: `${type === 'login' ? 'Login' : 'Registration'} successful!`,
        description: `Welcome${type === 'register' ? ' to Wander Buddy' : ' back'}!`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `${type === 'login' ? 'Login' : 'Registration'} failed. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Hero Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative">
                  <Plane className="h-12 w-12 text-blue-600 animate-pulse" />
                  <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Wander Buddy
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Your intelligent companion for discovering extraordinary journeys. 
                Let AI craft the perfect travel experience tailored just for you.
              </p>
              
              {/* Feature Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">AI Powered</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Global Coverage</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">Smart Planning</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Get personalized travel suggestions based on your preferences</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Explore destinations worldwide with comprehensive travel packages</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Intelligent itinerary planning that considers your visa status and budget</p>
                </div>
              </div>
            </div>

            {/* Right Side - Authentication */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 shadow-2xl border-0">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Start Your Journey
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Join thousands of travelers who trust AI to plan their adventures
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="login-email" className="text-xs">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="login-password" className="text-xs">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <Button 
                        onClick={() => handleSubmit('login')} 
                        className="w-full bg-blue-600 hover:bg-blue-700 h-9"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="register" className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="register-name" className="text-xs">Full Name</Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="register-email" className="text-xs">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="register-password" className="text-xs">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <Button 
                        onClick={() => handleSubmit('register')} 
                        className="w-full bg-purple-600 hover:bg-purple-700 h-9"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
