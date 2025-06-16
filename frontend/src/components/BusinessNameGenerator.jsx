import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/AlignUI';
import { Button } from './ui/AlignUI';
import { Input, Textarea, Select, SelectOption, Badge, Label } from './ui/AlignUI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/AlignUI';
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
    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-purple-900 capitalize">{system}</h4>
        <div className="text-right">
          <div className="text-xs text-purple-600">Harmony</div>
          <div className="font-bold text-purple-800">{data.harmonyScore}/10</div>
        </div>
      </div>
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
            <div className={`w-4 h-4 rounded-full mx-auto mb-1 transition-all duration-300 ${
              info.available ? 'bg-green-500 shadow-lg' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600">{domain}</span>
            <div className="text-xs text-gray-500">
              {info.available ? `+${info.value}` : '0'}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
        .com = 25pts • .net = 1pt • .org/.co/.io = 1pt • .biz = 1pt
      </div>
    </div>
  );

  const ScoreBreakdown = ({ breakdown, overallScore }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold mb-3 text-gray-800">Score Breakdown</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Numerology Harmony</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(breakdown.numerology/40)*100}%` }}
              />
            </div>
            <span className="font-medium text-purple-600">{breakdown.numerology}/40</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Domain Availability</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(breakdown.domains/30)*100}%` }}
              />
            </div>
            <span className="font-medium text-blue-600">{breakdown.domains}/30</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Trademark Status</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(breakdown.trademark/20)*100}%` }}
              />
            </div>
            <span className="font-medium text-green-600">{breakdown.trademark}/20</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Entity Compliance</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(breakdown.entity/10)*100}%` }}
              />
            </div>
            <span className="font-medium text-orange-600">{breakdown.entity}/10</span>
          </div>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center font-semibold">
            <span className="text-gray-800">Total Score</span>
            <span className="text-2xl font-bold text-indigo-600">{overallScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight">
            Business Name Generator
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Powered by AI & Ancient Numerology Wisdom
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Enhanced with Domain Scoring</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger 
                value="generator" 
                active={activeTab === 'generator'}
                onClick={() => setActiveTab('generator')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generator
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                active={activeTab === 'results'}
                onClick={() => setActiveTab('results')}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Results
              </TabsTrigger>
              <TabsTrigger 
                value="founder" 
                active={activeTab === 'founder'}
                onClick={() => setActiveTab('founder')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Founder
              </TabsTrigger>
              <TabsTrigger 
                value="dates" 
                active={activeTab === 'dates'}
                onClick={() => setActiveTab('dates')}
                className="flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                Dates
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generator" activeTab={activeTab}>
            <Card className="max-w-6xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-6 h-6 text-purple-600" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Tell us about your business idea and we'll generate perfect names with comprehensive numerological analysis including domain availability scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Business Description</Label>
                      <Textarea
                        placeholder="Describe your business idea, products, or services..."
                        value={formData.businessDescription}
                        onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label>Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectOption value="">Select your industry</SelectOption>
                        {industries.map(industry => (
                          <SelectOption key={industry} value={industry}>{industry}</SelectOption>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label>Include Keywords</Label>
                      <Input
                        placeholder="Keywords to include (comma-separated)"
                        value={formData.includeKeywords}
                        onChange={(e) => handleInputChange('includeKeywords', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Exclude Keywords</Label>
                      <Input
                        placeholder="Keywords to avoid (comma-separated)"
                        value={formData.excludeKeywords}
                        onChange={(e) => handleInputChange('excludeKeywords', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>US State</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectOption value="">Select state for incorporation</SelectOption>
                        {usStates.map(state => (
                          <SelectOption key={state.code} value={state.code}>
                            {state.name}
                          </SelectOption>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label>Entity Type</Label>
                      <Select value={formData.entityType} onValueChange={(value) => handleInputChange('entityType', value)}>
                        <SelectOption value="">Select entity type</SelectOption>
                        {entityTypes.map(type => (
                          <SelectOption key={type.value} value={type.value}>
                            {type.label}
                          </SelectOption>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label>Founder Name</Label>
                      <Input
                        placeholder="Enter founder's full name"
                        value={formData.founderName}
                        onChange={(e) => handleInputChange('founderName', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Founder Birthdate</Label>
                      <Input
                        type="date"
                        value={formData.founderBirthdate}
                        onChange={(e) => handleInputChange('founderBirthdate', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Number of Suggestions</Label>
                      <Select value={formData.numSuggestions.toString()} onValueChange={(value) => handleInputChange('numSuggestions', parseInt(value))}>
                        <SelectOption value="5">5 names</SelectOption>
                        <SelectOption value="10">10 names</SelectOption>
                        <SelectOption value="25">25 names</SelectOption>
                        <SelectOption value="50">50 names</SelectOption>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={generateNames}
                  disabled={loading || !formData.businessDescription}
                  className="w-full py-6 text-lg font-bold"
                  size="xlarge"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Names with Domain Analysis...
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

          <TabsContent value="results" activeTab={activeTab}>
            {results ? (
              <div className="grid gap-6 max-w-6xl mx-auto">
                {results.names.map((nameResult, index) => (
                  <Card key={nameResult.id} className="hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {nameResult.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge 
                              variant={nameResult.trademark.status === 'clear' ? 'success' : 'error'}
                            >
                              Trademark: {nameResult.trademark.status}
                            </Badge>
                            <Badge variant="secondary">
                              Domain Score: {nameResult.domainScore}/30
                            </Badge>
                          </div>
                        </div>
                        <ScoreCircle score={nameResult.overallScore} size={80} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-lg">Numerological Analysis</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <NumerologyCard system="pythagorean" data={nameResult.numerology.pythagorean} />
                            <NumerologyCard system="chaldean" data={nameResult.numerology.chaldean} />
                            <NumerologyCard system="kabbalistic" data={nameResult.numerology.kabbalistic} />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <ScoreBreakdown breakdown={nameResult.scoreBreakdown} overallScore={nameResult.overallScore} />
                          
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              Domain Availability Analysis
                            </h4>
                            <DomainStatus domains={nameResult.domainAvailability} domainScore={nameResult.domainScore} />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-semibold mb-3">Entity Compliance</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(nameResult.entityCompliance)
                            .filter(([key]) => key !== 'conflicts' && key !== 'score')
                            .map(([entity, available]) => (
                            <Badge 
                              key={entity} 
                              variant={available ? 'success' : 'secondary'}
                            >
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Yet</h3>
                  <p className="text-gray-500">Generate some business names to see results with domain scoring analysis</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="founder" activeTab={activeTab}>
            {results ? (
              <Card className="max-w-4xl mx-auto">
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
                    <h4 className="font-semibold mb-4 text-lg">Name Compatibility Scores</h4>
                    <div className="space-y-4">
                      {Object.entries(results.founderAnalysis.compatibility).map(([name, score]) => (
                        <div key={name} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <span className="font-medium text-lg">{name}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-40 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="font-bold text-purple-600 text-lg">{score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Founder Analysis Yet</h3>
                  <p className="text-gray-500">Generate business names with founder information to see personal analysis</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dates" activeTab={activeTab}>
            {results ? (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {results.optimalDates.map((dateResult, index) => (
                  <Card key={index}>
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
                          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                            {dateResult.energyType}
                          </Badge>
                        </div>
                        <ScoreCircle score={dateResult.compatibility} size={60} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600 mb-1">Numerology Value</p>
                          <p className="font-bold text-2xl text-purple-800">{dateResult.numerologyValue}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <p className="text-sm text-indigo-600 mb-1">Planetary Influence</p>
                          <p className="font-medium text-indigo-800">{dateResult.planetaryInfluence}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-gray-700 font-medium">{dateResult.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
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