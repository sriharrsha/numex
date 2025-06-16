"""
Gemini AI Service for Business Name Generation
"""

import google.generativeai as genai
import json
import logging
import re
from typing import List, Dict, Any
import os

logger = logging.getLogger(__name__)

class GeminiService:
    """Service for generating business names using Google's Gemini AI"""
    
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def generate_business_names(self, request_data: Dict[str, Any]) -> List[str]:
        """Generate creative business names based on user input"""
        try:
            prompt = self._create_prompt(request_data)
            
            # Configure generation parameters for creativity
            generation_config = {
                'temperature': 1.0,  # High creativity
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 2048,
            }
            
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            # Parse the response and extract names
            names = self._parse_response(response.text)
            
            # Ensure we have the requested number of names
            if len(names) < request_data.get('num_suggestions', 10):
                # Generate more if needed
                additional_names = self._generate_additional_names(request_data, len(names))
                names.extend(additional_names)
            
            return names[:request_data.get('num_suggestions', 10)]
            
        except Exception as e:
            logger.error(f"Error generating names with Gemini: {str(e)}")
            # Return fallback names if Gemini fails
            return self._generate_fallback_names(request_data)
    
    def _create_prompt(self, request_data: Dict[str, Any]) -> str:
        """Create a detailed prompt for Gemini"""
        business_desc = request_data.get('business_description', '')
        industry = request_data.get('industry', '')
        include_keywords = request_data.get('include_keywords', '')
        exclude_keywords = request_data.get('exclude_keywords', '')
        state = request_data.get('state', '')
        entity_type = request_data.get('entity_type', '')
        num_suggestions = request_data.get('num_suggestions', 10)
        
        prompt = f"""
Generate {num_suggestions} creative, professional business names for a US {industry} company.

Business Description: {business_desc}
Target State: {state}
Preferred Entity Type: {entity_type}

REQUIREMENTS:
- Include these keywords if possible: {include_keywords}
- Avoid these keywords: {exclude_keywords}
- Names should be 1-3 words maximum
- Easy to pronounce and spell in American English
- Memorable and brandable
- Professional and trustworthy
- Suitable for {entity_type} suffix
- Consider .com domain availability priority
- Avoid names too similar to major US brands
- Mix of descriptive and abstract names
- Include some compound words and creative combinations

US Business Considerations:
- Must work well in American market
- Consider trademark landscape
- Professional sound for {industry} industry
- Suitable for {state} incorporation

CREATIVITY GUIDELINES:
- Blend words creatively (portmanteaus)
- Use power words that convey success
- Consider Latin/Greek roots for sophistication
- Modern, tech-friendly if applicable
- Timeless yet contemporary feel

Format your response as a clean JSON array with exactly {num_suggestions} names:
["Name1", "Name2", "Name3", ...]

Ensure each name is unique, brandable, and perfect for a {industry} business in {state}.
"""
        return prompt
    
    def _parse_response(self, response_text: str) -> List[str]:
        """Parse Gemini response to extract business names"""
        try:
            # Look for JSON array in the response
            json_match = re.search(r'\[.*?\]', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                names = json.loads(json_str)
                if isinstance(names, list):
                    # Clean and validate names
                    clean_names = []
                    for name in names:
                        if isinstance(name, str):
                            # Remove quotes, clean whitespace
                            clean_name = name.strip().strip('"\'')
                            if clean_name and len(clean_name.split()) <= 3:
                                clean_names.append(clean_name)
                    return clean_names
            
            # Fallback: extract names from lines
            lines = response_text.split('\n')
            names = []
            for line in lines:
                line = line.strip()
                # Look for quoted names or numbered lists
                if line.startswith('"') and line.endswith('"'):
                    names.append(line.strip('"'))
                elif re.match(r'^\d+\.?\s*[A-Za-z]', line):
                    name = re.sub(r'^\d+\.?\s*', '', line).strip()
                    if name:
                        names.append(name)
            
            return names[:20]  # Limit to reasonable number
            
        except Exception as e:
            logger.error(f"Error parsing Gemini response: {str(e)}")
            return []
    
    def _generate_additional_names(self, request_data: Dict[str, Any], current_count: int) -> List[str]:
        """Generate additional names if we didn't get enough"""
        needed = request_data.get('num_suggestions', 10) - current_count
        if needed <= 0:
            return []
        
        # Create a simpler prompt for additional names
        industry = request_data.get('industry', '')
        business_desc = request_data.get('business_description', '')
        
        prompt = f"""
Generate {needed} more creative business names for a {industry} company: {business_desc}

Make them unique, professional, and brandable. Return as JSON array: ["Name1", "Name2", ...]
"""
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_response(response.text)
        except:
            return []
    
    def _generate_fallback_names(self, request_data: Dict[str, Any]) -> List[str]:
        """Generate fallback names if Gemini fails"""
        industry = request_data.get('industry', 'Business')
        
        # Simple fallback based on industry
        prefixes = ['Pro', 'Elite', 'Prime', 'Apex', 'Core', 'Peak', 'Ultra', 'Next']
        suffixes = ['Solutions', 'Systems', 'Group', 'Works', 'Labs', 'Hub', 'Pro', 'Corp']
        
        fallback_names = []
        for i, prefix in enumerate(prefixes):
            if i < len(suffixes):
                fallback_names.append(f"{prefix} {suffixes[i]}")
        
        # Add some industry-specific names
        if 'tech' in industry.lower():
            fallback_names.extend(['ByteCore Systems', 'DataFlow Solutions', 'CloudPeak Technologies'])
        elif 'health' in industry.lower():
            fallback_names.extend(['VitalCare Solutions', 'HealthBridge Systems', 'WellCore Group'])
        elif 'finance' in industry.lower():
            fallback_names.extend(['CapitalEdge Solutions', 'FinanceCore Systems', 'WealthBridge Group'])
        
        return fallback_names[:request_data.get('num_suggestions', 10)]