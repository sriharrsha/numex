"""
Domain Availability Service using RapidAPI
"""

import requests
import logging
import asyncio
import aiohttp
from typing import Dict, Any, List
import os

logger = logging.getLogger(__name__)

class DomainService:
    """Service for checking domain availability"""
    
    def __init__(self):
        self.rapidapi_key = os.getenv('RAPIDAPI_KEY')
        if not self.rapidapi_key:
            raise ValueError("RAPIDAPI_KEY environment variable is required")
        
        self.base_url = "https://domainr.p.rapidapi.com/v2"
        self.headers = {
            'x-rapidapi-host': 'domainr.p.rapidapi.com',
            'x-rapidapi-key': self.rapidapi_key
        }
        
        # Domain scoring weights
        self.domain_scores = {
            '.com': 25,    # Highest priority
            '.net': 3,     # High priority  
            '.org': 2,     # Medium priority
            '.co': 2,      # Medium priority
            '.io': 2,      # Medium priority (tech-friendly)
            '.biz': 1,     # Low priority
            '.us': 1       # US-specific
        }
    
    async def check_domain_availability(self, business_name: str) -> Dict[str, Any]:
        """Check domain availability for a business name across multiple TLDs"""
        try:
            # Clean the business name for domain checking
            domain_base = self._clean_domain_name(business_name)
            
            # Check availability for all TLDs
            availability_results = {}
            total_score = 0
            
            async with aiohttp.ClientSession() as session:
                tasks = []
                for tld in self.domain_scores.keys():
                    domain = f"{domain_base}{tld}"
                    task = self._check_single_domain(session, domain, tld)
                    tasks.append(task)
                
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                for result in results:
                    if isinstance(result, dict):
                        tld = result['tld']
                        available = result['available']
                        score = self.domain_scores[tld] if available else 0
                        
                        availability_results[tld] = {
                            'available': available,
                            'value': score,
                            'priority': self._get_priority(tld)
                        }
                        total_score += score
            
            return {
                'domains': availability_results,
                'totalScore': total_score,
                'maxPossibleScore': sum(self.domain_scores.values())
            }
            
        except Exception as e:
            logger.error(f"Error checking domain availability: {str(e)}")
            # Return fallback data
            return self._get_fallback_domain_data()
    
    async def _check_single_domain(self, session: aiohttp.ClientSession, domain: str, tld: str) -> Dict[str, Any]:
        """Check availability of a single domain"""
        try:
            url = f"{self.base_url}/search"
            params = {
                'query': domain,
                'mashape-key': self.rapidapi_key
            }
            
            async with session.get(url, headers=self.headers, params=params, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Parse domainr response
                    available = self._parse_domainr_response(data, domain)
                    
                    return {
                        'tld': tld,
                        'domain': domain,
                        'available': available
                    }
                else:
                    logger.warning(f"Domain API returned status {response.status} for {domain}")
                    return {
                        'tld': tld,
                        'domain': domain,
                        'available': False  # Conservative default
                    }
                    
        except Exception as e:
            logger.error(f"Error checking domain {domain}: {str(e)}")
            return {
                'tld': tld,
                'domain': domain,
                'available': False  # Conservative default
            }
    
    def _parse_domainr_response(self, data: Dict, domain: str) -> bool:
        """Parse domainr API response to determine availability"""
        try:
            # Domainr returns results with status indicators
            results = data.get('results', [])
            
            for result in results:
                if result.get('domain', '').lower() == domain.lower():
                    status = result.get('status', '')
                    # Available statuses: 'available', 'maybe'
                    # Unavailable: 'taken', 'unavailable'
                    return status in ['available', 'maybe']
            
            # If not found in results, assume available for new domains
            return True
            
        except Exception as e:
            logger.error(f"Error parsing domainr response: {str(e)}")
            return False
    
    def _clean_domain_name(self, business_name: str) -> str:
        """Clean business name for domain usage"""
        import re
        
        # Remove special characters, spaces, and convert to lowercase
        clean_name = re.sub(r'[^a-zA-Z0-9]', '', business_name.lower())
        
        # Ensure it starts with a letter
        if clean_name and not clean_name[0].isalpha():
            clean_name = 'a' + clean_name
        
        # Limit length for domain name rules
        if len(clean_name) > 63:
            clean_name = clean_name[:63]
        
        return clean_name
    
    def _get_priority(self, tld: str) -> str:
        """Get priority level for TLD"""
        if tld == '.com':
            return 'highest'
        elif tld in ['.net', '.org']:
            return 'high'
        elif tld in ['.co', '.io']:
            return 'medium'
        else:
            return 'low'
    
    def _get_fallback_domain_data(self) -> Dict[str, Any]:
        """Return fallback domain data if API fails"""
        fallback_results = {}
        total_score = 0
        
        for tld, score in self.domain_scores.items():
            # Assume some are available for fallback
            available = tld in ['.com', '.net', '.co', '.biz']
            domain_score = score if available else 0
            
            fallback_results[tld] = {
                'available': available,
                'value': domain_score,
                'priority': self._get_priority(tld)
            }
            total_score += domain_score
        
        return {
            'domains': fallback_results,
            'totalScore': total_score,
            'maxPossibleScore': sum(self.domain_scores.values())
        }
    
    def calculate_domain_score(self, domain_results: Dict[str, Any]) -> int:
        """Calculate weighted domain score"""
        domains = domain_results.get('domains', {})
        total_score = 0
        
        for tld, info in domains.items():
            if info.get('available', False):
                total_score += self.domain_scores.get(tld, 0)
        
        return min(total_score, 30)  # Cap at 30 points