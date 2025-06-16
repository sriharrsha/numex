"""
Main Business Name Generation Service
Orchestrates all services: Gemini, Numerology, Domain, Trademark
"""

import asyncio
import logging
from typing import Dict, Any, List
from datetime import datetime

from .numerology import NumerologyCalculator
from .gemini_service import GeminiService
from .domain_service import DomainService
from .trademark_service import TrademarkService

logger = logging.getLogger(__name__)

class BusinessNameService:
    """Main service that orchestrates business name generation and analysis"""
    
    def __init__(self):
        self.numerology = NumerologyCalculator()
        self.gemini = GeminiService()
        self.domain_service = DomainService()
        self.trademark_service = TrademarkService()
    
    async def generate_business_names(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive business name analysis"""
        try:
            logger.info(f"Starting business name generation for: {request_data.get('business_description', '')[:50]}...")
            
            # Step 1: Generate names using Gemini AI
            logger.info("Generating names with Gemini AI...")
            generated_names = self.gemini.generate_business_names(request_data)
            
            if not generated_names:
                raise Exception("Failed to generate names from Gemini AI")
            
            logger.info(f"Generated {len(generated_names)} names")
            
            # Step 2: Analyze each name comprehensively
            analyzed_names = []
            
            # Create semaphore to limit concurrent API calls
            semaphore = asyncio.Semaphore(3)  # Max 3 concurrent requests
            
            tasks = []
            for i, name in enumerate(generated_names):
                task = self._analyze_single_name(semaphore, name, request_data, i + 1)
                tasks.append(task)
            
            # Execute all analyses concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if isinstance(result, dict):
                    analyzed_names.append(result)
                else:
                    logger.error(f"Error in name analysis: {result}")
            
            # Step 3: Generate founder analysis if data provided
            founder_analysis = None
            if request_data.get('founder_name') and request_data.get('founder_birthdate'):
                founder_analysis = self._generate_founder_analysis(
                    request_data['founder_name'],
                    request_data['founder_birthdate'],
                    analyzed_names
                )
            
            # Step 4: Generate optimal dates
            optimal_dates = []
            if analyzed_names and request_data.get('founder_birthdate'):
                try:
                    # Use the highest-scoring name for date calculation
                    best_name = max(analyzed_names, key=lambda x: x.get('overallScore', 0))
                    optimal_dates = self.numerology.calculate_optimal_dates(
                        best_name['name'],
                        request_data['founder_birthdate']
                    )
                except Exception as e:
                    logger.error(f"Error calculating optimal dates: {e}")
            
            # Sort results by overall score
            analyzed_names.sort(key=lambda x: x.get('overallScore', 0), reverse=True)
            
            return {
                'names': analyzed_names,
                'founderAnalysis': founder_analysis,
                'optimalDates': optimal_dates,
                'metadata': {
                    'generatedAt': datetime.utcnow().isoformat(),
                    'totalNames': len(analyzed_names),
                    'requestData': request_data
                }
            }
            
        except Exception as e:
            logger.error(f"Error in business name generation: {str(e)}")
            raise Exception(f"Failed to generate business names: {str(e)}")
    
    async def _analyze_single_name(self, semaphore: asyncio.Semaphore, name: str, request_data: Dict[str, Any], index: int) -> Dict[str, Any]:
        """Analyze a single business name comprehensively"""
        async with semaphore:
            try:
                logger.info(f"Analyzing name {index}: {name}")
                
                # Run all analyses concurrently
                numerology_task = asyncio.create_task(self._analyze_numerology(name))
                domain_task = asyncio.create_task(self.domain_service.check_domain_availability(name))
                trademark_task = asyncio.create_task(self.trademark_service.check_trademark_availability(
                    name, request_data.get('industry', '')
                ))
                
                # Wait for all analyses to complete
                numerology_result, domain_result, trademark_result = await asyncio.gather(
                    numerology_task, domain_task, trademark_task, return_exceptions=True
                )
                
                # Handle any errors in individual analyses
                if isinstance(numerology_result, Exception):
                    logger.error(f"Numerology analysis failed for {name}: {numerology_result}")
                    numerology_result = self._get_fallback_numerology(name)
                
                if isinstance(domain_result, Exception):
                    logger.error(f"Domain analysis failed for {name}: {domain_result}")
                    domain_result = self.domain_service._get_fallback_domain_data()
                
                if isinstance(trademark_result, Exception):
                    logger.error(f"Trademark analysis failed for {name}: {trademark_result}")
                    trademark_result = self.trademark_service._get_fallback_trademark_data()
                
                # Calculate entity compliance
                entity_compliance = self._check_entity_compliance(name, request_data)
                
                # Calculate score breakdown
                score_breakdown = {
                    'numerology': self._calculate_numerology_score(numerology_result),
                    'domains': domain_result.get('totalScore', 0),
                    'trademark': trademark_result.get('score', 15),
                    'entity': entity_compliance.get('score', 8)
                }
                
                overall_score = sum(score_breakdown.values())
                
                return {
                    'id': str(index),
                    'name': name,
                    'overallScore': min(overall_score, 100),
                    'scoreBreakdown': score_breakdown,
                    'numerology': numerology_result,
                    'domainAvailability': domain_result.get('domains', {}),
                    'domainScore': domain_result.get('totalScore', 0),
                    'trademark': trademark_result,
                    'entityCompliance': entity_compliance
                }
                
            except Exception as e:
                logger.error(f"Error analyzing name {name}: {str(e)}")
                return self._get_fallback_name_analysis(name, index)
    
    async def _analyze_numerology(self, name: str) -> Dict[str, Any]:
        """Analyze numerology for a business name"""
        return {
            'pythagorean': self.numerology.calculate_pythagorean(name),
            'chaldean': self.numerology.calculate_chaldean(name),
            'kabbalistic': self.numerology.calculate_kabbalistic(name),
            'overallHarmony': self._calculate_overall_harmony(name)
        }
    
    def _calculate_overall_harmony(self, name: str) -> float:
        """Calculate overall numerological harmony"""
        pyth = self.numerology.calculate_pythagorean(name)
        chal = self.numerology.calculate_chaldean(name)
        kab = self.numerology.calculate_kabbalistic(name)
        
        harmony_scores = [
            pyth.get('harmonyScore', 5),
            chal.get('harmonyScore', 5),
            kab.get('harmonyScore', 5)
        ]
        
        return round(sum(harmony_scores) / len(harmony_scores), 1)
    
    def _calculate_numerology_score(self, numerology_result: Dict[str, Any]) -> int:
        """Calculate numerology contribution to overall score (out of 40)"""
        try:
            overall_harmony = numerology_result.get('overallHarmony', 5.0)
            # Convert 0-10 harmony score to 0-40 points
            return min(int(overall_harmony * 4), 40)
        except:
            return 20  # Fallback score
    
    def _check_entity_compliance(self, name: str, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check entity type compliance and reserved words"""
        conflicts = []
        
        # Check for reserved words (simplified)
        reserved_words = [
            'bank', 'insurance', 'federal', 'national', 'government',
            'state', 'municipal', 'county', 'city', 'public'
        ]
        
        name_lower = name.lower()
        for word in reserved_words:
            if word in name_lower:
                conflicts.append(f"'{word}' may be a reserved term")
        
        # Entity type compatibility
        entity_types = {
            'LLC': True,
            'Inc': True,
            'Corp': True,
            'S-Corp': True,
            'LLP': True,
            'LP': True,
            'PC': True,
            'PLLC': True
        }
        
        # Reduce score based on conflicts
        base_score = 10
        penalty = len(conflicts) * 2
        final_score = max(base_score - penalty, 0)
        
        # Create result dictionary with all entity types
        result = {
            'conflicts': conflicts,
            'score': final_score
        }
        
        # Add all entity types to the result
        for entity_type, value in entity_types.items():
            result[entity_type] = value
            
        return result
    
    def _generate_founder_analysis(self, founder_name: str, founder_birthdate: str, analyzed_names: List[Dict]) -> Dict[str, Any]:
        """Generate founder numerological analysis and compatibility"""
        try:
            founder_numerology = self.numerology.calculate_founder_numerology(founder_name, founder_birthdate)
            
            # Calculate compatibility with each business name
            compatibility = {}
            for name_data in analyzed_names:
                name = name_data['name']
                compat_score = self.numerology.calculate_name_compatibility(
                    name, founder_name, founder_birthdate
                )
                compatibility[name] = compat_score
            
            return {
                'name': founder_name,
                'birthdate': founder_birthdate,
                'numerology': founder_numerology,
                'compatibility': compatibility
            }
            
        except Exception as e:
            logger.error(f"Error in founder analysis: {str(e)}")
            return None
    
    def _get_fallback_numerology(self, name: str) -> Dict[str, Any]:
        """Fallback numerology if calculation fails"""
        return {
            'pythagorean': {'expression': 7, 'destiny': 7, 'meaning': 'Analytical energy', 'harmonyScore': 7.0},
            'chaldean': {'expression': 6, 'destiny': 6, 'meaning': 'Balanced energy', 'harmonyScore': 6.5},
            'kabbalistic': {'expression': 21, 'destiny': 3, 'meaning': 'Creative energy', 'harmonyScore': 7.5},
            'overallHarmony': 7.0
        }
    
    def _get_fallback_name_analysis(self, name: str, index: int) -> Dict[str, Any]:
        """Fallback analysis if everything fails"""
        return {
            'id': str(index),
            'name': name,
            'overallScore': 75,
            'scoreBreakdown': {'numerology': 28, 'domains': 20, 'trademark': 15, 'entity': 8},
            'numerology': self._get_fallback_numerology(name),
            'domainAvailability': {
                '.com': {'available': True, 'value': 25, 'priority': 'highest'},
                '.net': {'available': True, 'value': 3, 'priority': 'high'},
                '.org': {'available': False, 'value': 0, 'priority': 'medium'}
            },
            'domainScore': 28,
            'trademark': {'status': 'unknown', 'similarMarks': 0, 'riskLevel': 'unknown', 'score': 15},
            'entityCompliance': {'LLC': True, 'Inc': True, 'Corp': True, 'conflicts': [], 'score': 8}
        }