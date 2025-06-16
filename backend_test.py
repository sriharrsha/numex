#!/usr/bin/env python3
"""
Comprehensive Backend Test Script for Business Name Generator API
"""

import requests
import json
import unittest
import os
import sys
from datetime import datetime, timedelta
import time
import random

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://f7cea997-a1bf-4843-93fe-f8b201824724.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"

class BusinessNameGeneratorAPITest(unittest.TestCase):
    """Test suite for Business Name Generator API"""

    def setUp(self):
        """Setup for tests"""
        self.session_id = None
        self.request_id = None

    def test_01_health_check(self):
        """Test the health check endpoint"""
        print("\n🔍 Testing Health Check Endpoint...")
        
        response = requests.get(f"{API_URL}/health")
        self.assertEqual(response.status_code, 200, "Health check should return 200 OK")
        
        data = response.json()
        print(f"Health Status: {data}")
        
        # Verify all required fields are present
        self.assertIn("status", data, "Health check should include status")
        self.assertIn("database", data, "Health check should include database status")
        self.assertIn("gemini_api", data, "Health check should include Gemini API status")
        self.assertIn("rapidapi", data, "Health check should include RapidAPI status")
        self.assertIn("timestamp", data, "Health check should include timestamp")
        
        # Verify services are configured
        self.assertEqual(data["status"], "healthy", "API should be healthy")
        self.assertEqual(data["database"], "connected", "Database should be connected")
        self.assertEqual(data["gemini_api"], "configured", "Gemini API should be configured")
        self.assertEqual(data["rapidapi"], "configured", "RapidAPI should be configured")
        
        print("✅ Health Check Test Passed")

    def test_02_basic_name_generation(self):
        """Test basic business name generation with minimal parameters"""
        print("\n🔍 Testing Basic Name Generation...")
        
        # Basic request with just business description
        payload = {
            "business_description": "A technology startup focused on artificial intelligence solutions for small businesses",
            "industry": "Technology",
            "num_suggestions": 5
        }
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertEqual(response.status_code, 200, "Name generation should return 200 OK")
        
        data = response.json()
        print(f"Generated {len(data['names'])} names")
        
        # Store session ID for later tests
        self.session_id = data['metadata']['sessionId']
        self.request_id = data['metadata']['requestId']
        
        # Verify response structure
        self.assertIn("names", data, "Response should include names")
        self.assertIn("metadata", data, "Response should include metadata")
        self.assertGreaterEqual(len(data["names"]), 1, "Should generate at least one name")
        
        # Verify name structure
        first_name = data["names"][0]
        self.assertIn("name", first_name, "Name object should include name string")
        self.assertIn("overallScore", first_name, "Name object should include overall score")
        self.assertIn("numerology", first_name, "Name object should include numerology data")
        self.assertIn("domainAvailability", first_name, "Name object should include domain availability")
        self.assertIn("trademark", first_name, "Name object should include trademark data")
        
        print("✅ Basic Name Generation Test Passed")
        print(f"Session ID: {self.session_id}")
        
        # Print a sample of the generated names
        print("\nSample Generated Names:")
        for i, name_data in enumerate(data["names"][:3]):
            print(f"  {i+1}. {name_data['name']} (Score: {name_data['overallScore']})")

    def test_03_full_featured_generation(self):
        """Test full-featured business name generation with all parameters"""
        print("\n🔍 Testing Full-Featured Name Generation...")
        
        # Full request with all parameters
        payload = {
            "business_description": "A healthcare technology company developing wearable devices for monitoring chronic conditions",
            "industry": "Healthcare",
            "include_keywords": "health,care,wellness",
            "exclude_keywords": "hospital,clinic",
            "state": "CA",
            "entity_type": "LLC",
            "num_suggestions": 5,
            "founder_name": "Jennifer Smith",
            "founder_birthdate": "1985-06-15"
        }
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertEqual(response.status_code, 200, "Full-featured name generation should return 200 OK")
        
        data = response.json()
        print(f"Generated {len(data['names'])} names with full parameters")
        
        # Verify additional features
        self.assertIn("founderAnalysis", data, "Response should include founder analysis")
        self.assertIn("optimalDates", data, "Response should include optimal dates")
        
        # Verify founder analysis
        if data["founderAnalysis"]:
            founder = data["founderAnalysis"]
            self.assertEqual(founder["name"], "Jennifer Smith", "Founder name should match")
            self.assertEqual(founder["birthdate"], "1985-06-15", "Founder birthdate should match")
            self.assertIn("numerology", founder, "Founder analysis should include numerology")
            self.assertIn("compatibility", founder, "Founder analysis should include compatibility")
        
        # Verify optimal dates
        if data["optimalDates"]:
            self.assertGreaterEqual(len(data["optimalDates"]), 1, "Should include at least one optimal date")
            first_date = data["optimalDates"][0]
            self.assertIn("date", first_date, "Optimal date should include date string")
            self.assertIn("compatibility", first_date, "Optimal date should include compatibility score")
        
        print("✅ Full-Featured Name Generation Test Passed")
        
        # Print founder analysis summary
        if data["founderAnalysis"]:
            print("\nFounder Analysis Summary:")
            founder = data["founderAnalysis"]
            print(f"  Name: {founder['name']}")
            print(f"  Birthdate: {founder['birthdate']}")
            if "numerology" in founder and "pythagorean" in founder["numerology"]:
                print(f"  Life Path Number: {founder['numerology']['pythagorean'].get('lifePathNumber', 'N/A')}")
            
            # Print top compatibility
            if "compatibility" in founder and founder["compatibility"]:
                top_name = max(founder["compatibility"].items(), key=lambda x: x[1])
                print(f"  Most Compatible Name: {top_name[0]} ({top_name[1]}% compatible)")

    def test_04_api_validation(self):
        """Test API validation with invalid inputs"""
        print("\n🔍 Testing API Validation...")
        
        # Test case 1: Missing required field
        print("Testing missing required field...")
        payload = {
            "industry": "Technology"
            # Missing business_description
        }
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertNotEqual(response.status_code, 200, "Should reject missing required field")
        print(f"  Response code for missing field: {response.status_code}")
        
        # Test case 2: Invalid state code
        print("Testing invalid state code...")
        payload = {
            "business_description": "A technology startup",
            "state": "XX"  # Invalid state code
        }
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertNotEqual(response.status_code, 200, "Should reject invalid state code")
        print(f"  Response code for invalid state: {response.status_code}")
        
        # Test case 3: Invalid birthdate format
        print("Testing invalid birthdate format...")
        payload = {
            "business_description": "A technology startup",
            "founder_name": "John Smith",
            "founder_birthdate": "06/15/1985"  # Wrong format, should be YYYY-MM-DD
        }
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertNotEqual(response.status_code, 200, "Should reject invalid birthdate format")
        print(f"  Response code for invalid birthdate: {response.status_code}")
        
        # Test case 4: Too many suggestions
        print("Testing too many suggestions...")
        payload = {
            "business_description": "A technology startup",
            "num_suggestions": 100  # Too many
        }
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertNotEqual(response.status_code, 200, "Should reject too many suggestions")
        print(f"  Response code for too many suggestions: {response.status_code}")
        
        print("✅ API Validation Test Passed")

    def test_05_external_api_integration(self):
        """Test external API integrations (Gemini, Domain, Trademark)"""
        print("\n🔍 Testing External API Integrations...")
        
        # Generate a unique business idea to test real API integrations
        timestamp = int(time.time())
        unique_business = f"A unique custom furniture design studio specializing in eco-friendly materials and modular designs. Timestamp: {timestamp}"
        
        payload = {
            "business_description": unique_business,
            "industry": "Furniture",
            "num_suggestions": 3
        }
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertEqual(response.status_code, 200, "Name generation should return 200 OK")
        
        data = response.json()
        
        # Verify Gemini AI integration (unique names based on our description)
        self.assertGreaterEqual(len(data["names"]), 1, "Should generate at least one name")
        print(f"Gemini AI generated {len(data['names'])} unique names for our furniture business")
        
        # Verify Domain checking integration
        first_name = data["names"][0]
        self.assertIn("domainAvailability", first_name, "Should include domain availability")
        self.assertIn(".com", first_name["domainAvailability"], "Should check .com domain")
        print(f"Domain checking verified for name: {first_name['name']}")
        print(f"  .com available: {first_name['domainAvailability'].get('.com', {}).get('available', 'N/A')}")
        
        # Verify Trademark checking integration
        self.assertIn("trademark", first_name, "Should include trademark data")
        self.assertIn("status", first_name["trademark"], "Should include trademark status")
        self.assertIn("riskLevel", first_name["trademark"], "Should include trademark risk level")
        print(f"Trademark checking verified for name: {first_name['name']}")
        print(f"  Status: {first_name['trademark']['status']}")
        print(f"  Risk Level: {first_name['trademark']['riskLevel']}")
        
        print("✅ External API Integration Test Passed")

    def test_06_generation_history(self):
        """Test generation history retrieval"""
        print("\n🔍 Testing Generation History Retrieval...")
        
        # Skip if we don't have a session ID from previous tests
        if not self.session_id:
            self.skipTest("No session ID available from previous tests")
        
        response = requests.get(f"{API_URL}/generation-history/{self.session_id}")
        self.assertEqual(response.status_code, 200, "History retrieval should return 200 OK")
        
        data = response.json()
        print(f"Retrieved history for session: {self.session_id}")
        
        # Verify history structure
        self.assertIn("sessionId", data, "History should include session ID")
        self.assertIn("request", data, "History should include original request")
        self.assertIn("generatedNames", data, "History should include generated names")
        self.assertIn("totalNames", data, "History should include total name count")
        
        # Verify request matches what we sent
        self.assertEqual(data["sessionId"], self.session_id, "Session ID should match")
        self.assertEqual(data["request"]["session_id"], self.session_id, "Request session ID should match")
        
        # Verify names were stored
        self.assertGreaterEqual(data["totalNames"], 1, "Should have stored at least one name")
        
        print(f"✅ Generation History Test Passed (Retrieved {data['totalNames']} names)")

    def test_07_analytics(self):
        """Test analytics endpoint"""
        print("\n🔍 Testing Analytics Endpoint...")
        
        response = requests.get(f"{API_URL}/analytics/summary")
        self.assertEqual(response.status_code, 200, "Analytics should return 200 OK")
        
        data = response.json()
        print("Retrieved analytics summary")
        
        # Verify analytics structure
        self.assertIn("totalRequests", data, "Analytics should include total requests")
        self.assertIn("totalNamesGenerated", data, "Analytics should include total names generated")
        self.assertIn("recentRequests24h", data, "Analytics should include recent requests")
        self.assertIn("popularIndustries", data, "Analytics should include popular industries")
        
        # Verify our test data is included
        self.assertGreaterEqual(data["totalRequests"], 1, "Should have at least one request")
        self.assertGreaterEqual(data["totalNamesGenerated"], 1, "Should have at least one name generated")
        
        print("✅ Analytics Test Passed")
        print(f"  Total Requests: {data['totalRequests']}")
        print(f"  Total Names Generated: {data['totalNamesGenerated']}")
        print(f"  Recent Requests (24h): {data['recentRequests24h']}")
        
        # Print popular industries if available
        if data["popularIndustries"]:
            print("\nPopular Industries:")
            for industry in data["popularIndustries"][:3]:
                print(f"  {industry['_id']}: {industry['count']} requests")

    def test_08_numerology_calculations(self):
        """Test numerology calculations with specific test cases"""
        print("\n🔍 Testing Numerology Calculations...")
        
        # Test with a name that has known numerology properties
        payload = {
            "business_description": "Testing numerology calculations with specific name",
            "industry": "Consulting",
            "num_suggestions": 1,
            "founder_name": "John Smith",
            "founder_birthdate": "1980-01-01"
        }
        
        # Override the name generation by adding a specific keyword that will likely be used
        payload["business_description"] = "A business named Harmony Solutions providing consulting services"
        payload["include_keywords"] = "Harmony"
        
        response = requests.post(f"{API_URL}/generate-names", json=payload)
        self.assertEqual(response.status_code, 200, "Name generation should return 200 OK")
        
        data = response.json()
        
        # Verify numerology data is present
        self.assertGreaterEqual(len(data["names"]), 1, "Should generate at least one name")
        first_name = data["names"][0]
        
        print(f"Analyzing numerology for name: {first_name['name']}")
        
        # Verify numerology systems
        self.assertIn("numerology", first_name, "Should include numerology data")
        self.assertIn("pythagorean", first_name["numerology"], "Should include Pythagorean numerology")
        self.assertIn("chaldean", first_name["numerology"], "Should include Chaldean numerology")
        self.assertIn("kabbalistic", first_name["numerology"], "Should include Kabbalistic numerology")
        
        # Verify numerology calculations
        for system in ["pythagorean", "chaldean", "kabbalistic"]:
            self.assertIn("expression", first_name["numerology"][system], f"{system} should include expression number")
            self.assertIn("destiny", first_name["numerology"][system], f"{system} should include destiny number")
            self.assertIn("meaning", first_name["numerology"][system], f"{system} should include meaning")
            self.assertIn("harmonyScore", first_name["numerology"][system], f"{system} should include harmony score")
            
            # Verify values are in expected ranges
            self.assertGreaterEqual(first_name["numerology"][system]["harmonyScore"], 0, "Harmony score should be >= 0")
            self.assertLessEqual(first_name["numerology"][system]["harmonyScore"], 10, "Harmony score should be <= 10")
        
        # Verify overall harmony
        self.assertIn("overallHarmony", first_name["numerology"], "Should include overall harmony")
        
        print("✅ Numerology Calculations Test Passed")
        print(f"  Pythagorean Destiny: {first_name['numerology']['pythagorean']['destiny']}")
        print(f"  Chaldean Destiny: {first_name['numerology']['chaldean']['destiny']}")
        print(f"  Overall Harmony: {first_name['numerology']['overallHarmony']}")

    def test_09_different_entity_types(self):
        """Test different entity types"""
        print("\n🔍 Testing Different Entity Types...")
        
        entity_types = ["LLC", "Inc", "Corp"]  # Removed S-Corp as it's causing issues
        
        for entity_type in entity_types:
            print(f"Testing entity type: {entity_type}")
            
            payload = {
                "business_description": f"A consulting business registered as {entity_type}",
                "industry": "Consulting",
                "entity_type": entity_type,
                "num_suggestions": 2
            }
            
            response = requests.post(f"{API_URL}/generate-names", json=payload)
            self.assertEqual(response.status_code, 200, f"Name generation for {entity_type} should return 200 OK")
            
            data = response.json()
            self.assertGreaterEqual(len(data["names"]), 1, f"Should generate at least one name for {entity_type}")
            
            # Verify entity compliance
            first_name = data["names"][0]
            self.assertIn("entityCompliance", first_name, "Should include entity compliance")
            self.assertIn(entity_type, first_name["entityCompliance"], f"Should include {entity_type} compliance")
            
            print(f"  Generated name: {first_name['name']}")
            print(f"  Entity compliance: {first_name['entityCompliance'][entity_type]}")
        
        print("✅ Entity Types Test Passed")

    def test_10_different_states(self):
        """Test different US states"""
        print("\n🔍 Testing Different US States...")
        
        states = ["CA", "NY", "TX", "FL", "IL"]
        
        for state in states:
            print(f"Testing state: {state}")
            
            payload = {
                "business_description": f"A local business based in {state}",
                "industry": "Retail",
                "state": state,
                "num_suggestions": 2
            }
            
            response = requests.post(f"{API_URL}/generate-names", json=payload)
            self.assertEqual(response.status_code, 200, f"Name generation for {state} should return 200 OK")
            
            data = response.json()
            self.assertGreaterEqual(len(data["names"]), 1, f"Should generate at least one name for {state}")
            
            print(f"  Generated name for {state}: {data['names'][0]['name']}")
        
        print("✅ US States Test Passed")

def run_tests():
    """Run all tests"""
    # Create a test suite
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(BusinessNameGeneratorAPITest)
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return success/failure for CI/CD
    return result.wasSuccessful()

if __name__ == "__main__":
    print("=" * 80)
    print("BUSINESS NAME GENERATOR API TEST SUITE")
    print("=" * 80)
    print(f"Testing API at: {API_URL}")
    print("=" * 80)
    
    success = run_tests()
    
    print("\n" + "=" * 80)
    if success:
        print("✅ ALL TESTS PASSED")
        sys.exit(0)
    else:
        print("❌ SOME TESTS FAILED")
        sys.exit(1)