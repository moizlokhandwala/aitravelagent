import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Send, Filter, MapPin, Calendar, DollarSign, Users, Sparkles, LogOut, FileText } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:10000';

const HomePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [packages, setPackages] = useState<any[]>([]);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  const toggleDetails = (packageId: string) => {
  setExpandedPackageId(prev => (prev === packageId ? null : packageId));
};


  // Prompt state
  const [prompt, setPrompt] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    destination: '',
    budget: '',
    travel_type: 'flexible',
  });

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      console.log('Generating packages from prompt:', prompt);
      
      const response = await fetch(`${API_BASE_URL}/suggest-packages/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          user_id: user?.id || user?.email || '',
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setPackages(data.packages || []);
      toast({
        title: 'Packages Generated!',
        description: 'AI has created personalized travel packages for you.',
      });
    } catch (error) {
      console.error('Prompt generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate packages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = async () => {
    if (!filters.from_date || !filters.to_date || !filters.destination || !filters.budget) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required filter fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Generating packages from filters:', filters);
      
      const response = await fetch(`${API_BASE_URL}/suggest-packages/filters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          user_id: user?.id || user?.email || '',
          from_date: filters.from_date,
          to_date: filters.to_date,
          destination: filters.destination,
          budget: filters.budget,
          travel_type: filters.travel_type,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setPackages(data.packages || []);
      toast({
        title: 'Filtered Packages Ready!',
        description: 'Found packages matching your criteria.',
      });
    } catch (error) {
      console.error('Filter generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate packages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveItinerary = async (selectedPackage: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/itinerary/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          user_id: user?.id || user?.email || '',
          selected_package: selectedPackage,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      toast({
        title: 'Itinerary Saved!',
        description: 'Your selected package has been saved to your itineraries.',
      });
    } catch (error) {
      console.error('Save itinerary error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save itinerary. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Wander Buddy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name || user?.email}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Input Options */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl">Plan Your Journey</CardTitle>
                <CardDescription>
                  Use AI to create your perfect travel experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="prompt" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="prompt" className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Prompt</span>
                    </TabsTrigger>
                    <TabsTrigger value="filters" className="flex items-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="prompt" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="travel-prompt">Describe your dream trip</Label>
                      <Textarea
                        id="travel-prompt"
                        placeholder="I want to go on a romantic trip to Europe for my honeymoon, visiting historical sites and enjoying local cuisine..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handlePromptSubmit}
                      disabled={isLoading || !prompt.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? 'Generating...' : 'Generate Travel Packages'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="filters" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="from-date">From Date *</Label>
                          <Input
                            id="from-date"
                            type="date"
                            value={filters.from_date}
                            onChange={(e) => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="to-date">To Date *</Label>
                          <Input
                            id="to-date"
                            type="date"
                            value={filters.to_date}
                            onChange={(e) => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination *</Label>
                        <Input
                          id="destination"
                          placeholder="e.g., Paris, Tokyo, Thailand"
                          value={filters.destination}
                          onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget *</Label>
                        <Input
                          id="budget"
                          placeholder="e.g., $2000, $5000"
                          value={filters.budget}
                          onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="travel-type">Travel Type</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, travel_type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select travel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flexible">Flexible</SelectItem>
                            <SelectItem value="solo">Solo Travel</SelectItem>
                            <SelectItem value="couple">Couple</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="group">Group</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleFilterSubmit}
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isLoading ? 'Searching...' : 'Find Packages'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            {packages.length === 0 ? (
              <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready to Explore?
                  </h3>
                  <p className="text-gray-500">
                    Use the prompt or filters to generate personalized travel packages
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recommended Packages
                  </h2>
                  <Badge variant="secondary" className="text-sm">
                    {packages.length} packages found
                  </Badge>
                </div>
                
                <div className="grid gap-6">
                  {packages.map((pkg) => (
                    <Card key={pkg.package_id} className="backdrop-blur-sm bg-white/80 shadow-lg border-0 hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl text-blue-900">{pkg.title}</CardTitle>
                            <CardDescription className="text-gray-600 mt-1">
                              {pkg.days?.length || 0} days itinerary
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{pkg.total_cost_estimate}</div>
                            <div className="text-sm text-gray-500">estimated cost</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">{pkg.days?.length || 0} days</span>
                          </div>
                          {pkg.visa_required !== null && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-700">
                                Visa {pkg.visa_required ? 'Required' : 'Not Required'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {pkg.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">{pkg.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex space-x-3">
                          <Button 
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => saveItinerary(pkg)}
                          >
                            Save Itinerary
                          </Button>
                          <Button 
                              variant="outline" 
                              className="flex-1"
                                onClick={() => toggleDetails(pkg.package_id)}
                          >         
                                {expandedPackageId === pkg.package_id ? 'Hide Details' : 'View Details'}
                            </Button>

                        </div>

                        {expandedPackageId === pkg.package_id && (
  <div className="mt-4 bg-gray-50 p-4 rounded border">
    {pkg.days?.map((day: any) => (
      <div key={day.day} className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-1">
          Day {day.day} – {day.date}
        </h4>
        <ul className="ml-4 list-disc space-y-1 text-sm text-gray-700">
          {day.activities?.map((act: any, idx: number) => (
            <li key={idx}>
              <strong>{act.time}</strong> at <em>{act.place}</em>: {act.activity} (<span className="text-green-600">{act.cost}</span>)
            </li>
          ))}
        </ul>
      </div>
    ))}

    <div className="text-sm text-gray-800">
      <p><strong>Accommodation:</strong> {pkg.accommodation?.name} ({pkg.accommodation?.cost_per_night}/night)</p>
      <p><strong>Amenities:</strong> {pkg.accommodation?.amenities?.join(', ')}</p>
      <p><strong>Transport:</strong> {pkg.local_transport?.join(', ')}</p>
      <p><strong>Notes:</strong> {pkg.notes}</p>
    </div>
  </div>
)}


                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
