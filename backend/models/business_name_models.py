"""
Pydantic models for Business Name Generator API
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class BusinessNameRequest(BaseModel):
    """Request model for business name generation"""
    business_description: str = Field(..., min_length=10, max_length=1000, description="Description of the business")
    industry: Optional[str] = Field(None, description="Industry category")
    include_keywords: Optional[str] = Field(None, description="Keywords to include (comma-separated)")
    exclude_keywords: Optional[str] = Field(None, description="Keywords to exclude (comma-separated)")
    state: Optional[str] = Field(None, max_length=2, description="US state code for incorporation")
    entity_type: Optional[str] = Field(None, description="Preferred entity type (LLC, Inc, Corp, etc.)")
    num_suggestions: Optional[int] = Field(10, ge=1, le=50, description="Number of name suggestions")
    founder_name: Optional[str] = Field(None, description="Founder's full name for compatibility analysis")
    founder_birthdate: Optional[str] = Field(None, description="Founder's birthdate (YYYY-MM-DD)")
    
    @validator('founder_birthdate')
    def validate_birthdate(cls, v):
        if v:
            try:
                datetime.strptime(v, '%Y-%m-%d')
            except ValueError:
                raise ValueError('Birthdate must be in YYYY-MM-DD format')
        return v
    
    @validator('state')
    def validate_state(cls, v):
        if v:
            v = v.upper()
            valid_states = [
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
            ]
            if v not in valid_states:
                raise ValueError('Invalid US state code')
        return v

class NumerologyResult(BaseModel):
    """Numerology calculation result"""
    expression: int
    destiny: int
    meaning: str
    harmonyScore: float

class DomainInfo(BaseModel):
    """Domain availability information"""
    available: bool
    value: int
    priority: str

class TrademarkResult(BaseModel):
    """Trademark check result"""
    status: str
    similarMarks: int
    riskLevel: str
    score: int

class EntityCompliance(BaseModel):
    """Entity type compliance result"""
    LLC: bool = True
    Inc: bool = True
    Corp: bool = True
    conflicts: List[str] = []
    score: int

class ScoreBreakdown(BaseModel):
    """Score breakdown by category"""
    numerology: int
    domains: int
    trademark: int
    entity: int

class BusinessNameResult(BaseModel):
    """Single business name analysis result"""
    id: str
    name: str
    overallScore: int
    scoreBreakdown: ScoreBreakdown
    numerology: Dict[str, Any]  # Changed from Dict[str, NumerologyResult] to accept overallHarmony as float
    domainAvailability: Dict[str, DomainInfo]
    domainScore: int
    trademark: TrademarkResult
    entityCompliance: EntityCompliance

class FounderAnalysis(BaseModel):
    """Founder numerological analysis"""
    name: str
    birthdate: str
    numerology: Dict[str, Any]
    compatibility: Dict[str, int]

class OptimalDate(BaseModel):
    """Optimal incorporation date"""
    date: str
    numerologyValue: int
    compatibility: int
    energyType: str
    description: str
    dayOfWeek: str
    planetaryInfluence: str

class BusinessNameResponse(BaseModel):
    """Complete business name generation response"""
    names: List[BusinessNameResult]
    founderAnalysis: Optional[FounderAnalysis]
    optimalDates: List[OptimalDate]
    metadata: Dict[str, Any]

class GenerationRecord(BaseModel):
    """Database record for generation requests"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    session_id: str
    business_description: str
    industry: Optional[str] = None
    include_keywords: Optional[str] = None
    exclude_keywords: Optional[str] = None
    us_state: Optional[str] = None
    preferred_entity_type: Optional[str] = None
    num_suggestions: int = 10
    founder_name: Optional[str] = None
    founder_birthdate: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class GeneratedName(BaseModel):
    """Database record for generated names"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    name: str
    generated_order: int
    overall_score: int
    numerology_data: Dict[str, Any]
    domain_data: Dict[str, Any]
    trademark_data: Dict[str, Any]
    entity_data: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)