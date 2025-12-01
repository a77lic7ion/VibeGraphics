# VibeGraphics - Infographic Creation Application

AI-Generated Infographics & Visuals for Your GitHub Projects and Custom Content  
Built with Gemini, nano banana (image generation)

## 🎨 **New: GUI Application!**

VibeGraphics now features a modern React/Vite web application for creating stunning infographics without writing any code.

### Features

- 📝 **Dual Input Modes**: Create from GitHub repositories OR manual text input
- 🎨 **Template Gallery**: Browse and customize 8+ professional templates
- ✏️ **Rich Editor**: Customize text, colors, and layouts
- 🖼️ **Logo Upload**: Add your branding to infographics
- 📄 **Multi-Page Support**: Create series of infographics
- 💾 **Multiple Export Formats**: PNG, SVG, PDF
- 🤖 **AI-Powered**: Automatic design using Google Gemini

### Installation

#### Prerequisites
- Python 3.8+
- Node.js 16+
- Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

#### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/automateyournetwork/VibeGraphics.git
   cd VibeGraphics
   ```
   - Click "Save"

### Usage

#### Option A: GitHub to Infographic

1. Click "From GitHub" on the homepage
2. Enter a GitHub repository URL
3. Click "Fetch Repository"
4. Choose a template from the gallery
5. Click "Generate Infographic"
6. Review and download your infographic

#### Option B: Manual Creation

1. Click "Manual Input" on the homepage
2. Enter your title and content
3. Add optional sections
4. Choose a template from the gallery
5. Click "Generate Infographic"
6. Review and download

### Available Templates

- **Tech Blueprint**: Technical diagram with blueprint aesthetics
- **Space Age Retro**: 1960s space race inspired design
- **Cyberpunk Neon**: Futuristic neon grid design
- **Minimalist Modern**: Clean, professional layout
- **Fantasy Atlas**: Quest map and fantasy cartography
- **Business Professional**: Corporate presentation style
- **Education Friendly**: Clear, educational layout
- **Marketing Vibrant**: Eye-catching marketing design

### Export Formats

- **PNG**: High-resolution raster image
- **PDF**: Print-ready document format
- (SVG support coming soon)

### Architecture

```
VibeGraphics/
├── backend/              # Flask REST API
│   ├── api_server.py    # Main API server
│   └── requirements.txt # Python dependencies
├── frontend/            # React/Vite GUI
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API client
│   │   └── store/       # State management
│   └── package.json
├── servers/             # Original MCP server
│   └── vibegraphics_mcp.py
├── install.bat         # Installation script
└── start.bat           # Startup script
```

### Troubleshooting

**Backend not starting:**
- Ensure Python is installed and in PATH
- Check that port 5000 is available
- Install dependencies: `cd backend && pip install -r requirements.txt`

**Frontend not starting:**
- Ensure Node.js is installed
- Check that port 5173 is available
- Install dependencies: `cd frontend && npm install`

**API key errors:**
- Verify your Gemini API key is valid
- Check Settings modal shows "Connected" status
- Ensure you have API credits available

### Original CLI Extension

The original Gemini CLI extension is still available in the `servers/` directory. See the legacy documentation below for CLI usage.

---

## 🚀 Original Installation (CLI Extension)

```bash
gemini extensions install https://github.com/automateyournetwork/VibeGraphics.git
```

## Contributing

PRs welcome! Areas for contribution:
- New template designs
- Additional export formats
- UI/UX improvements
- Multi-language support

## License

Apache 2.0 - See LICENSE file

## Credits

Built with:
- [Google Gemini](https://ai.google.dev/) - AI model
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Flask](https://flask.palletsprojects.com/) - Backend API
- [Zustand](https://github.com/pmndrs/zustand) - State management