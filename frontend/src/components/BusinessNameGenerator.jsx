import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Sparkles, Search, Calendar as CalendarIcon, User, Building, TrendingUp } from 'lucide-react';
import { mockGeneratedNames, mockFounderAnalysis, mockOptimalDates, usStates, industries, entityTypes } from '../mockData';

const BusinessNameGenerator = () => {
  const [formData, setFormData] = useState({
    businessDescription: '',
    industry: '',
    includeKeywords: '',
    excludeKeywords: '',
    state: '',
    entityType: '',
    numSuggestions: 10,
    founderName: '',
    founderBirthdate: ''
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateNames = async () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setResults({
        names: mockGeneratedNames,
        founderAnalysis: mockFounderAnalysis,
        optimalDates: mockOptimalDates
      });
      setLoading(false);
      setActiveTab('results');
    }, 2000);
  };

  const ScoreCircle = ({ score, size = 60 }) => {
    const circumference = 2 * Math.PI * 18;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size/2}
            cy={size/2}
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size/2}
            cy={size/2}
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className="text-emerald-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-sm font-bold text-gray-900">{score}</span>
      </div>
    );
  };

  const NumerologyCard = ({ system, data }) => (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
      <h4 className="font-semibold text-purple-900 mb-2 capitalize">{system}</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Expression:</span>
          <span className="font-medium text-purple-800">{data.expression}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Destiny:</span>
          <span className="font-medium text-purple-800">{data.destiny}</span>
        </div>
        <p className="text-xs text-purple-700 mt-2">{data.meaning}</p>
      </div>
    </div>
  );

  const DomainStatus = ({ domains, domainScore }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-700">Domain Score</span>
        <span className="font-bold text-blue-600">{domainScore}/30</span>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {Object.entries(domains).map(([domain, info]) => (
          <div key={domain} className="text-center">
            <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
              info.available ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600">{domain}</span>
            <div className="text-xs text-gray-500">
              {info.available ? `+${info.value}` : '0'}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        .com = 25pts • .net = 1pt • .org/.co/.io = 1pt • .biz = 1pt
      </div>
    </div>
  );

  const ScoreBreakdown = ({ breakdown, overallScore }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-3 text-gray-800">Score Breakdown</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Numerology Harmony</span>
          <span className="font-medium text-purple-600">{breakdown.numerology}/40</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Domain Availability</span>
          <span className="font-medium text-blue-600">{breakdown.domains}/30</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Trademark Status</span>
          <span className="font-medium text-green-600">{breakdown.trademark}/20</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Entity Compliance</span>
          <span className="font-medium text-orange-600">{breakdown.entity}/10</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-semibold">
            <span className="text-gray-800">Total Score</span>
            <span className="text-indigo-600">{overallScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Business Name Generator
          </h1>
          <p className="text-xl text-gray-600">
            Powered by AI & Ancient Numerology Wisdom
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="founder" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Founder Analysis
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Optimal Dates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Tell us about your business idea and we'll generate perfect names with numerological analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Description</label>
                      <Textarea
                        placeholder="Describe your business idea, products, or services..."
                        value={formData.businessDescription}
                        onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                        className="min-h-[100px] border-2 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry</label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="border-2 focus:border-purple-500">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Include Keywords</label>
                      <Input
                        placeholder="Keywords to include (comma-separated)"
                        value={formData.includeKeywords}
                        onChange={(e) => handleInputChange('includeKeywords', e.target.value)}
                        className="border-2 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Exclude Keywords</label>
                      <Input
                        placeholder="Keywords to avoid (comma-separated)"
                        value={formData.excludeKeywords}
                        onChange={(e) => handleInputChange('excludeKeywords', e.target.value)}
                        className="border-2 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">US State</label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className="border-2 focus:border-purple-500">
                          <SelectValue placeholder="Select state for incorporation" />
                        </SelectTrigger>
                        <SelectContent>
                          {usStates.map(state => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Entity Type</label>
                      <Select value={formData.entityType} onValueChange={(value) => handleInputChange('entityType', value)}>
                        <SelectTrigger className="border-2 focus:border-purple-500">
                          <SelectValue placeholder="Select entity type" />
                        </SelectTrigger>
                        <SelectContent>
                          {entityTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Founder Name</label>
                      <Input
                        placeholder="Enter founder's full name"
                        value={formData.founderName}
                        onChange={(e) => handleInputChange('founderName', e.target.value)}
                        className="border-2 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Founder Birthdate</label>
                      <Input
                        type="date"
                        value={formData.founderBirthdate}
                        onChange={(e) => handleInputChange('founderBirthdate', e.target.value)}
                        className="border-2 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Suggestions</label>
                      <Select value={formData.numSuggestions.toString()} onValueChange={(value) => handleInputChange('numSuggestions', parseInt(value))}>
                        <SelectTrigger className="border-2 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 names</SelectItem>
                          <SelectItem value="10">10 names</SelectItem>
                          <SelectItem value="25">25 names</SelectItem>
                          <SelectItem value="50">50 names</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={generateNames}
                  disabled={loading || !formData.businessDescription}
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Names...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Business Names
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {results ? (
              <div className="grid gap-6">
                {results.names.map((nameResult, index) => (
                  <Card key={nameResult.id} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {nameResult.name}
                          </h3>
                          <Badge 
                            variant={nameResult.trademark.status === 'clear' ? 'default' : 'destructive'}
                            className="mb-2"
                          >
                            Trademark: {nameResult.trademark.status}
                          </Badge>
                        </div>
                        <ScoreCircle score={nameResult.overallScore} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <NumerologyCard system="pythagorean" data={nameResult.numerology.pythagorean} />
                        <NumerologyCard system="chaldean" data={nameResult.numerology.chaldean} />
                        <NumerologyCard system="kabbalistic" data={nameResult.numerology.kabbalistic} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Domain Availability
                          </h4>
                          <DomainStatus domains={nameResult.domainAvailability} />
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Entity Compliance</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(nameResult.entityCompliance)
                              .filter(([key]) => key !== 'conflicts')
                              .map(([entity, available]) => (
                              <Badge 
                                key={entity} 
                                variant={available ? 'default' : 'secondary'}
                                className={available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                              >
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Yet</h3>
                  <p className="text-gray-500">Generate some business names to see results here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="founder">
            {results ? (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Founder Numerological Analysis
                  </CardTitle>
                  <CardDescription>
                    Personal energy analysis and business name compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <NumerologyCard system="pythagorean" data={results.founderAnalysis.numerology.pythagorean} />
                    <NumerologyCard system="chaldean" data={results.founderAnalysis.numerology.chaldean} />
                    <NumerologyCard system="kabbalistic" data={results.founderAnalysis.numerology.kabbalistic} />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Name Compatibility Scores</h4>
                    <div className="space-y-3">
                      {Object.entries(results.founderAnalysis.compatibility).map(([name, score]) => (
                        <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{name}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="font-bold text-purple-600">{score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Founder Analysis Yet</h3>
                  <p className="text-gray-500">Generate business names with founder information to see personal analysis</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dates">
            {results ? (
              <div className="grid gap-6">
                {results.optimalDates.map((dateResult, index) => (
                  <Card key={index} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {new Date(dateResult.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <Badge className="bg-indigo-100 text-indigo-800">
                            {dateResult.energyType}
                          </Badge>
                        </div>
                        <ScoreCircle score={dateResult.compatibility} size={50} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Numerology Value</p>
                          <p className="font-semibold text-lg text-purple-600">{dateResult.numerologyValue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Planetary Influence</p>
                          <p className="font-medium text-gray-800">{dateResult.planetaryInfluence}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mt-4 p-3 bg-gray-50 rounded-lg">
                        {dateResult.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Date Analysis Yet</h3>
                  <p className="text-gray-500">Generate business names to see optimal incorporation dates</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessNameGenerator;