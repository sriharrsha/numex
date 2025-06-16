from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import uuid
from datetime import datetime
import asyncio

# Import our services and models
from services.business_name_service import BusinessNameService
from models.business_name_models import (
    BusinessNameRequest, 
    BusinessNameResponse,
    GenerationRecord,
    GeneratedName
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')

if not mongo_url:
    raise ValueError("MONGO_URL environment variable is required")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app
app = FastAPI(title="Business Name Generator API", version="1.0.0")

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Initialize services
business_name_service = BusinessNameService()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@api_router.get("/")
async def root():
    return {"message": "Business Name Generator API is running!"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.list_collection_names()
        
        # Test API keys
        gemini_key = os.getenv('GEMINI_API_KEY')
        rapidapi_key = os.getenv('RAPIDAPI_KEY')
        
        return {
            "status": "healthy",
            "database": "connected",
            "gemini_api": "configured" if gemini_key else "missing",
            "rapidapi": "configured" if rapidapi_key else "missing",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@api_router.post("/generate-names", response_model=BusinessNameResponse)
async def generate_business_names(request: BusinessNameRequest, http_request: Request):
    """Generate business names with comprehensive analysis"""
    try:
        # Create session ID for tracking
        session_id = str(uuid.uuid4())
        
        # Store the generation request
        generation_record = GenerationRecord(
            session_id=session_id,
            business_description=request.business_description,
            industry=request.industry,
            include_keywords=request.include_keywords,
            exclude_keywords=request.exclude_keywords,
            us_state=request.state,
            preferred_entity_type=request.entity_type,
            num_suggestions=request.num_suggestions,
            founder_name=request.founder_name,
            founder_birthdate=request.founder_birthdate,
            ip_address=str(http_request.client.host),
            user_agent=http_request.headers.get('user-agent', '')
        )
        
        # Insert generation record
        await db.generation_requests.insert_one(generation_record.dict())
        
        logger.info(f"Starting business name generation for session: {session_id}")
        
        # Convert request to dict for service
        request_data = request.dict()
        
        # Generate business names
        result = await business_name_service.generate_business_names(request_data)
        
        # Store generated names in database
        for name_data in result.get('names', []):
            generated_name = GeneratedName(
                request_id=generation_record.id,
                name=name_data['name'],
                generated_order=int(name_data['id']),
                overall_score=name_data['overallScore'],
                numerology_data=name_data['numerology'],
                domain_data={
                    'availability': name_data['domainAvailability'],
                    'score': name_data['domainScore']
                },
                trademark_data=name_data['trademark'],
                entity_data=name_data['entityCompliance']
            )
            await db.generated_names.insert_one(generated_name.dict())
        
        logger.info(f"Successfully generated {len(result.get('names', []))} names for session: {session_id}")
        
        # Add session info to metadata
        result['metadata']['sessionId'] = session_id
        result['metadata']['requestId'] = generation_record.id
        
        return BusinessNameResponse(**result)
        
    except Exception as e:
        logger.error(f"Error generating business names: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate business names: {str(e)}"
        )

@api_router.get("/generation-history/{session_id}")
async def get_generation_history(session_id: str):
    """Get generation history for a session"""
    try:
        # Find the generation request
        generation_request = await db.generation_requests.find_one({"session_id": session_id})
        if not generation_request:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Find all generated names for this request
        generated_names = await db.generated_names.find({
            "request_id": generation_request["id"]
        }).sort("generated_order", 1).to_list(100)
        
        return {
            "sessionId": session_id,
            "request": generation_request,
            "generatedNames": generated_names,
            "totalNames": len(generated_names)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving generation history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve history")

@api_router.get("/analytics/summary")
async def get_analytics_summary():
    """Get basic analytics summary"""
    try:
        # Count total requests
        total_requests = await db.generation_requests.count_documents({})
        
        # Count total names generated
        total_names = await db.generated_names.count_documents({})
        
        # Get popular industries
        industry_pipeline = [
            {"$match": {"industry": {"$ne": None}}},
            {"$group": {"_id": "$industry", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        popular_industries = await db.generation_requests.aggregate(industry_pipeline).to_list(10)
        
        # Get recent activity (last 24 hours)
        from datetime import timedelta
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_requests = await db.generation_requests.count_documents({
            "created_at": {"$gte": yesterday}
        })
        
        return {
            "totalRequests": total_requests,
            "totalNamesGenerated": total_names,
            "recentRequests24h": recent_requests,
            "popularIndustries": popular_industries,
            "averageNamesPerRequest": round(total_names / total_requests, 1) if total_requests > 0 else 0
        }
        
    except Exception as e:
        logger.error(f"Error retrieving analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")

# Include the API router
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)