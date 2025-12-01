#!/usr/bin/env python3
"""
VibeGraphics Flask API Server
Provides REST API for the Infographic Creation Application
"""

import os
import sys
import json
import uuid
import time
from pathlib import Path
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv

# Add parent directory to path to import MCP functions
sys.path.insert(0, str(Path(__file__).parent.parent / "servers"))

# Import MCP functions
try:
    from vibegraphics_mcp import (
        _normalize_github_repo,
        _github_api_list_files,
        _github_fetch_text_file,
        _github_raw_url,
        VIBE_BASE_DIR
    )
except ImportError:
    print("Warning: Could not import MCP functions, some features may not work")
    VIBE_BASE_DIR = Path.home() / ".vibegraphics"
    VIBE_BASE_DIR.mkdir(parents=True, exist_ok=True)

load_dotenv()

app = Flask(__name__)
CORS(app)

# Session storage for generated files
SESSIONS = {}

# Template data (will be expanded with actual templates)
TEMPLATES = [
    {
        "id": "tech-blueprint",
        "name": "Tech Blueprint",
        "category": "Tech",
        "description": "Technical diagram style with blueprint aesthetics",
        "theme": "blueprint",
        "preview": "/api/templates/tech-blueprint/preview.png"
    },
    {
        "id": "space-retro",
        "name": "Space Age Retro",
        "category": "Creative",
        "description": "1960s space race inspired design",
        "theme": "space-retro",
        "preview": "/api/templates/space-retro/preview.png"
    },
    {
        "id": "cyberpunk-neon",
        "name": "Cyberpunk Neon",
        "category": "Creative",
        "description": "Futuristic neon grid design",
        "theme": "cyberpunk",
        "preview": "/api/templates/cyberpunk-neon/preview.png"
    },
    {
        "id": "minimalist-modern",
        "name": "Minimalist Modern",
        "category": "Business",
        "description": "Clean, professional design",
        "theme": "minimalist",
        "preview": "/api/templates/minimalist-modern/preview.png"
    },
    {
        "id": "fantasy-atlas",
        "name": "Fantasy Atlas",
        "category": "Creative",
        "description": "Quest map and fantasy cartography",
        "theme": "fantasy",
        "preview": "/api/templates/fantasy-atlas/preview.png"
    },
    {
        "id": "business-professional",
        "name": "Business Professional",
        "category": "Business",
        "description": "Corporate presentation style",
        "theme": "business",
        "preview": "/api/templates/business-professional/preview.png"
    },
    {
        "id": "education-friendly",
        "name": "Education Friendly",
        "category": "Education",
        "description": "Clear, educational layout",
        "theme": "education",
        "preview": "/api/templates/education-friendly/preview.png"
    },
    {
        "id": "marketing-vibrant",
        "name": "Marketing Vibrant",
        "category": "Marketing",
        "description": "Eye-catching marketing design",
        "theme": "marketing",
        "preview": "/api/templates/marketing-vibrant/preview.png"
    }
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "VibeGraphics API is running"})

@app.route('/api/settings/test-api-key', methods=['POST'])
def test_api_key():
    """Test if Gemini API key is valid"""
    data = request.json
    api_key = data.get('api_key', '')
    
    if not api_key:
        return jsonify({"ok": False, "error": "API key is required"}), 400
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        # Try a simple call to verify the key
        models = client.models.list()
        return jsonify({"ok": True, "message": "API key is valid"})
    except Exception as e:
        return jsonify({"ok": False, "error": f"Invalid API key: {str(e)}"}), 401

@app.route('/api/templates', methods=['GET'])
def get_templates():
    """Get all available templates"""
    category = request.args.get('category')
    if category:
        filtered = [t for t in TEMPLATES if t['category'] == category]
        return jsonify({"templates": filtered})
    return jsonify({"templates": TEMPLATES})

@app.route('/api/templates/categories', methods=['GET'])
def get_template_categories():
    """Get all template categories"""
    categories = list(set(t['category'] for t in TEMPLATES))
    return jsonify({"categories": sorted(categories)})

@app.route('/api/research', methods=['POST'])
def research_topic():
    """Research a topic using DuckDuckGo Search"""
    data = request.json
    topic = data.get('topic', '')
    
    if not topic:
        return jsonify({"ok": False, "error": "Topic is required"}), 400
    
    try:
        from duckduckgo_search import DDGS
        
        print(f"Researching topic: {topic}")
        results = []
        with DDGS() as ddgs:
            # Search for general info
            search_results = list(ddgs.text(topic, max_results=5))
            results.extend(search_results)
            
        # Format research data
        research_summary = f"Research Results for: {topic}\n\n"
        for i, res in enumerate(results):
            research_summary += f"Source {i+1}: {res['title']}\n"
            research_summary += f"URL: {res['href']}\n"
            research_summary += f"Summary: {res['body']}\n\n"
            
        # Create bundle (reusing structure for compatibility)
        bundle = {
            "topic": topic,
            "research_data": research_summary,
            "captured_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        
        # Save bundle
        bundle_id = str(uuid.uuid4())[:8]
        bundle_path = VIBE_BASE_DIR / f"research_{bundle_id}.json"
        with open(bundle_path, "w", encoding="utf-8") as f:
            json.dump(bundle, f, indent=2)
        
        return jsonify({
            "ok": True,
            "bundle": bundle,
            "bundle_id": bundle_id,
            "bundle_path": str(bundle_path)
        })
        
    except Exception as e:
        print(f"Research error: {str(e)}")
        response = jsonify({"ok": False, "error": str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/api/plan/generate', methods=['POST'])
def generate_plan():
    """Generate infographic spec from content"""
    data = request.json
    api_key = data.get('api_key', os.getenv('GEMINI_API_KEY'))
    content_type = data.get('content_type', 'github')  # 'github' or 'manual'
    template_id = data.get('template_id')
    
    if not api_key:
        return jsonify({"ok": False, "error": "GEMINI_API_KEY is required"}), 400
    
    try:
        from google import genai
        from google.genai import types as gtypes
        
        client = genai.Client(api_key=api_key)
        
        # Get template info
        template = next((t for t in TEMPLATES if t['id'] == template_id), TEMPLATES[0])
        theme = template.get('theme', 'cartographer')
        
        # Build content based on type
        if content_type == 'github':
            # Legacy support
            bundle = data.get('bundle', {})
            readme = bundle.get('readme', '')
            repo_meta = bundle.get('repo', {})
            
            instruction = f"""
You are designing a VibeGraphic infographic for a GitHub repository.

Theme: {theme}
Repo: {repo_meta.get('owner')}/{repo_meta.get('name')}

Create a clear, information-first infographic with distinct sections.
The theme should frame the design but not obscure the content.

Return STRICT JSON:
{{
  "projectTitle": "Title",
  "oneLiner": "One sentence description",
  "sections": [
    {{"title": "Section", "body": "Content", "iconIdea": "Icon concept"}}
  ],
  "palette": {{
    "primaryColors": ["#hex"],
    "accentColors": ["#hex"],
    "backgroundStyle": "Description"
  }},
  "imagePrompt": "Detailed prompt for image generation"
}}
"""
            parts = [
                gtypes.Part.from_text(text=instruction),
                gtypes.Part.from_text(text=f"### README\n{readme[:20000]}")
            ]
            
        elif content_type == 'research':
            bundle = data.get('bundle', {})
            topic = bundle.get('topic', '')
            research_data = bundle.get('research_data', '')
            
            instruction = f"""
You are designing a VibeGraphic infographic for the topic: "{topic}"

Theme: {theme}

Create a clear, information-first infographic based on the provided research.
The theme should frame the design but not obscure the content.

Research Data:
{research_data}

Return STRICT JSON with the same structure as before.
"""
            parts = [gtypes.Part.from_text(text=instruction)]
            
        else:  # manual
            custom_text = data.get('custom_text', '')
            title = data.get('title', 'Untitled')
            sections_data = data.get('sections', [])
            
            instruction = f"""
You are designing an infographic from custom user input.

Theme: {theme}
Title: {title}

Create a clear, visually striking infographic.

User Content:
{custom_text}

Sections: {json.dumps(sections_data)}

Return STRICT JSON with the same structure as before.
"""
            
            parts = [gtypes.Part.from_text(text=instruction)]
        
        content = gtypes.Content(role="user", parts=parts)
        
        res = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[content],
            config=gtypes.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        raw = getattr(res, "text", "") or "{}"
        spec = json.loads(raw)
        
        # Save spec
        spec_id = str(uuid.uuid4())[:8]
        spec_path = VIBE_BASE_DIR / f"spec_{spec_id}.json"
        with open(spec_path, "w", encoding="utf-8") as f:
            json.dump(spec, f, indent=2)
        
        return jsonify({
            "ok": True,
            "spec": spec,
            "spec_id": spec_id,
            "spec_path": str(spec_path)
        })
        
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route('/api/image/generate', methods=['POST'])
def generate_image():
    """Generate image from spec"""
    data = request.json
    api_key = data.get('api_key', os.getenv('GEMINI_API_KEY'))
    spec = data.get('spec', {})
    custom_prompt = data.get('custom_prompt')  # Optional override
    
    if not api_key:
        return jsonify({"ok": False, "error": "GEMINI_API_KEY is required"}), 400
    
    try:
        from google import genai
        from google.genai import types as gtypes
        import mimetypes
        
        client = genai.Client(api_key=api_key)
        
        # Use custom prompt or spec's imagePrompt
        prompt = custom_prompt or spec.get('imagePrompt', '')
        if not prompt:
            return jsonify({"ok": False, "error": "No image prompt provided"}), 400
        
        parts = [gtypes.Part.from_text(text=prompt)]
        contents = [gtypes.Content(role="user", parts=parts)]
        config = gtypes.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"])
        
        # Generate image
        stream = client.models.generate_content_stream(
            model="gemini-2.0-flash-exp",
            contents=contents,
            config=config
        )
        
        saved_path = None
        for chunk in stream:
            cand = getattr(chunk, "candidates", None)
            if not cand or not cand[0].content or not cand[0].content.parts:
                continue
            
            part = cand[0].content.parts[0]
            inline = getattr(part, "inline_data", None)
            if inline and getattr(inline, "data", None):
                mt = getattr(inline, "mime_type", "image/png")
                ext = mimetypes.guess_extension(mt) or ".png"
                ts = time.strftime("%Y%m%d_%H%M%S")
                ms = int((time.time() % 1) * 1000)
                fname = f"vibe_{ts}_{ms:03d}{ext}"
                fpath = VIBE_BASE_DIR / fname
                
                with open(fpath, "wb") as f:
                    f.write(inline.data)
                
                saved_path = str(fpath)
                break
        
        if not saved_path:
            return jsonify({"ok": False, "error": "No image generated"}), 500
        
        return jsonify({
            "ok": True,
            "image_path": saved_path,
            "filename": Path(saved_path).name
        })
        
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route('/api/files/<path:filename>', methods=['GET'])
def download_file(filename):
    """Download generated files"""
    file_path = VIBE_BASE_DIR / filename
    if not file_path.exists():
        return jsonify({"error": "File not found"}), 404
    
    return send_file(file_path, as_attachment=True)

@app.route('/api/export/<format>', methods=['POST'])
def export_file(format):
    """Export image in different formats (PNG, SVG, PDF)"""
    data = request.json
    image_path = data.get('image_path', '')
    
    if not image_path or not Path(image_path).exists():
        return jsonify({"ok": False, "error": "Image file not found"}), 404
    
    try:
        if format == 'png':
            # PNG is already the format, just return the file
            return send_file(image_path, as_attachment=True, download_name=f"infographic_{int(time.time())}.png")
        
        elif format == 'pdf':
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            from PIL import Image
            
            # Create PDF
            output_path = VIBE_BASE_DIR / f"export_{int(time.time())}.pdf"
            img = Image.open(image_path)
            width, height = img.size
            
            c = canvas.Canvas(str(output_path), pagesize=(width, height))
            c.drawImage(image_path, 0, 0, width=width, height=height)
            c.save()
            
            return send_file(output_path, as_attachment=True, download_name=f"infographic_{int(time.time())}.pdf")
        
        else:
            return jsonify({"ok": False, "error": f"Unsupported format: {format}"}), 400
            
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting VibeGraphics API Server...")
    print(f"Output directory: {VIBE_BASE_DIR}")
    app.run(host='0.0.0.0', port=5000, debug=True)
