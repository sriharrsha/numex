"""
USPTO Trademark Service using RapidAPI
"""

import requests
import asyncio
import aiohttp
import logging
from typing import Dict, Any, List
import os
import re

logger = logging.getLogger(__name__)

class TrademarkService:
    """Service for checking USPTO trademark status"""
    
    def __init__(self):
        self.rapidapi_key = os.getenv('RAPIDAPI_KEY')
        if not self.rapidapi_key:
            raise ValueError("RAPIDAPI_KEY environment variable is required")
        
        self.base_url = "https://uspto-trademark.p.rapidapi.com/v1"
        self.headers = {
            'x-rapidapi-host': 'uspto-trademark.p.rapidapi.com',
            'x-rapidapi-key': self.rapidapi_key
        }
    
    async def check_trademark_availability(self, business_name: str, industry: str = "") -> Dict[str, Any]:
        """Check trademark availability and conflicts"""
        try:
            # Clean the business name for trademark search
            search_term = self._clean_trademark_name(business_name)
            
            async with aiohttp.ClientSession() as session:
                # Check exact match
                exact_result = await self._check_exact_trademark(session, search_term)
                
                # Check similar trademarks
                similar_results = await self._check_similar_trademarks(session, search_term)
                
                # Calculate risk assessment
                risk_assessment = self._assess_trademark_risk(exact_result, similar_results, industry)
                
                return {
                    'status': risk_assessment['status'],
                    'similarMarks': len(similar_results),
                    'riskLevel': risk_assessment['risk_level'],
                    'score': risk_assessment['score'],
                    'details': {
                        'exactMatch': exact_result,
                        'similarMarks': similar_results[:5],  # Limit to top 5
                        'searchTerm': search_term
                    }
                }
        
        except Exception as e:
            logger.error(f"Error checking trademark: {str(e)}")
            return self._get_fallback_trademark_data()
    
    async def _check_exact_trademark(self, session: aiohttp.ClientSession, search_term: str) -> Dict[str, Any]:
        """Check for exact trademark matches"""
        try:
            url = f"{self.base_url}/trademarkAvailable/{search_term}"
            
            async with session.get(url, headers=self.headers, timeout=15) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_trademark_response(data, search_term)
                else:
                    logger.warning(f"Trademark API returned status {response.status}")
                    return {'available': True, 'details': 'API error'}
        
        except Exception as e:
            logger.error(f"Error checking exact trademark: {str(e)}")
            return {'available': True, 'details': 'Check failed'}
    
    async def _check_similar_trademarks(self, session: aiohttp.ClientSession, search_term: str) -> List[Dict[str, Any]]:
        """Check for similar trademark matches"""
        try:
            # Generate variations of the search term
            variations = self._generate_search_variations(search_term)
            
            similar_marks = []
            for variation in variations[:3]:  # Limit API calls
                try:
                    url = f"{self.base_url}/trademarkAvailable/{variation}"
                    
                    async with session.get(url, headers=self.headers, timeout=10) as response:
                        if response.status == 200:
                            data = await response.json()
                            result = self._parse_trademark_response(data, variation)
                            if not result.get('available', True):
                                similar_marks.append({
                                    'term': variation,
                                    'similarity': self._calculate_similarity(search_term, variation),
                                    'details': result.get('details', 'Similar trademark found')
                                })
                except:
                    continue  # Skip failed variations
            
            return similar_marks
            
        except Exception as e:
            logger.error(f"Error checking similar trademarks: {str(e)}")
            return []
    
    def _parse_trademark_response(self, data: Dict, search_term: str) -> Dict[str, Any]:
        """Parse USPTO API response"""
        try:
            # The API response structure may vary, adapt as needed
            if isinstance(data, dict):
                # Look for common indicators of trademark availability
                available = data.get('available', True)
                
                # Check for specific fields that indicate trademark exists
                if 'trademark' in data or 'registrations' in data:
                    registrations = data.get('registrations', [])
                    if registrations:
                        available = False
                
                # Check status field
                status = data.get('status', '').lower()
                if 'registered' in status or 'pending' in status:
                    available = False
                
                return {
                    'available': available,
                    'details': data.get('description', 'Trademark check completed'),
                    'status': status
                }
            
            return {'available': True, 'details': 'No conflicts found'}
            
        except Exception as e:
            logger.error(f"Error parsing trademark response: {str(e)}")
            return {'available': True, 'details': 'Parse error'}
    
    def _clean_trademark_name(self, business_name: str) -> str:
        """Clean business name for trademark search"""
        # Remove common business suffixes
        suffixes = ['LLC', 'Inc', 'Corp', 'Corporation', 'Company', 'Co', 'Ltd', 'Limited']
        clean_name = business_name
        
        for suffix in suffixes:
            clean_name = re.sub(rf'\b{suffix}\b', '', clean_name, flags=re.IGNORECASE)
        
        # Remove special characters and extra spaces
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', clean_name)
        clean_name = ' '.join(clean_name.split())  # Normalize whitespace
        
        return clean_name.strip()
    
    def _generate_search_variations(self, search_term: str) -> List[str]:
        """Generate variations of the search term for similarity checking"""
        variations = []
        words = search_term.split()
        
        # Single words
        for word in words:
            if len(word) > 3:  # Only meaningful words
                variations.append(word)
        
        # Partial combinations
        if len(words) > 1:
            for i in range(len(words) - 1):
                variations.append(' '.join(words[i:i+2]))
        
        # Remove duplicates and return
        return list(set(variations))
    
    def _calculate_similarity(self, term1: str, term2: str) -> float:
        """Calculate similarity between two terms (simple algorithm)"""
        term1 = term1.lower()
        term2 = term2.lower()
        
        # Simple character-based similarity
        if term1 == term2:
            return 1.0
        
        # Calculate overlap
        set1 = set(term1)
        set2 = set(term2)
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        return intersection / union if union > 0 else 0.0
    
    def _assess_trademark_risk(self, exact_result: Dict, similar_results: List, industry: str) -> Dict[str, Any]:
        """Assess overall trademark risk"""
        # Exact match check
        if not exact_result.get('available', True):
            return {
                'status': 'conflict',
                'risk_level': 'high',
                'score': 0
            }
        
        # Similar marks assessment
        high_similarity_count = sum(1 for mark in similar_results if mark.get('similarity', 0) > 0.7)
        medium_similarity_count = len(similar_results) - high_similarity_count
        
        if high_similarity_count > 0:
            return {
                'status': 'similar',
                'risk_level': 'medium',
                'score': 12  # Reduced score due to similarities
            }
        elif medium_similarity_count > 2:
            return {
                'status': 'caution',
                'risk_level': 'low',
                'score': 16  # Slightly reduced score
            }
        else:
            return {
                'status': 'clear',
                'risk_level': 'low',
                'score': 20  # Full score
            }
    
    def _get_fallback_trademark_data(self) -> Dict[str, Any]:
        """Return fallback trademark data if API fails"""
        return {
            'status': 'unknown',
            'similarMarks': 0,
            'riskLevel': 'unknown',
            'score': 15,  # Conservative score
            'details': {
                'exactMatch': {'available': True, 'details': 'API unavailable'},
                'similarMarks': [],
                'searchTerm': 'unknown'
            }
        }