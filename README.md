VibeGraphics

AI-Generated Infographics & Micro-Animations for Your GitHub Projects
Built with Gemini, nano banana (image generation), and Veo 3 (video generation)

VibeGraphics is an MCP Server + Gemini-CLI extension that transforms any GitHub repository into a themed, emotionally expressive infographic — and optionally a short animated video.

Provide a GitHub URL → receive a fully generated VibeGraphic that visually explains your project’s purpose, architecture, components, and flow.

Users can choose any visual vibe — space-race retro, blueprint drafting, fantasy atlas, vaporwave neon, cosmic starfield, cyberpunk grid, magazine editorial, minimalist schematic, etc.

🚀 Installation
As a Gemini-CLI extension
gemini extensions install https://github.com/automateyournetwork/VibeGraphics.git

As a Python MCP server
pip install google-genai fastmcp requests
export GEMINI_API_KEY="YOUR_KEY_HERE"

🌟 What VibeGraphics Does

VibeGraphics uses a 4-stage AI pipeline:

🔍 1. GitHub Scraping (GitHub → Bundle)

VibeGraphics automatically fetches:

README

Source code (Python files)

File structure

Repository metadata (owner, repo, branch)

Everything is packaged into a compact JSON bundle used for downstream planning.

🎨 2. Infographic Design (Bundle → Spec)

Using multimodal Gemini models, VibeGraphics generates a VibeGraphic Spec, containing:

Project title & one-liner

Sections (with descriptions)

Visual motifs

Color palette

Layout hints

imagePrompt (for nano banana)

animationPrompt (for Veo)

Optional 60–90 second voiceover script

This spec is the “design document” describing how the infographic should look, feel, and flow.

The user can specify any theme, such as:

Space Race Retro

Cyberpunk Neon City Grid

Blueprint Technical Draft

Cosmic Starfield

Minimalist Diagram

Editorial Magazine Layout

Fantasy Atlas / Quest Map

(or anything else they can imagine)

If the user provides no theme, VibeGraphics will choose a neutral, coherent one automatically.

🖼 3. Image Generation (Spec → Infographic)

Using the spec’s imagePrompt, VibeGraphics produces a high-resolution infographic using:

nano banana (Gemini image generation)

Optional guided image input

The result is a single, cohesive visual summary of the repository.

🎬 4. Animation (Image → Motion Graphic)

Using Veo, VibeGraphics can animate the infographic with subtle motions such as:

Parallax drift

Section highlights

Line or route reveals

Icon pulses

Sparkles, glows, telemetry arcs

Gentle camera drift (when appropriate to the theme)

This produces a 5–12 second micro-animation perfect for:

Social media

Project landing pages

Docs & READMEs

Conference decks

Portfolio reels

🧠 How It Works — High-Level Flow

Provide a GitHub repo URL

VibeGraphics analyzes the repo → creates a bundle

Gemini generates a themed infographic spec

nano banana renders the static image

Veo optionally animates it

You receive:

Spec JSON

Infographic image (PNG)

Animated video (MP4)

📦 Project Structure
vibegraphics/
├── vibegraphics_mcp.py       # MCP Server – bundle → spec → image → animation
├── servers/
│   ├── requirements.txt
│   └── run.sh
├── extensions/
│   ├── GEMINI.md             # LLM-facing behavior instructions
│   └── commands.toml         # Gemini CLI slash commands
└── README.md                 # (this file)

🧪 Example Usage (Conceptual)
Generate an infographic for a repo

“Make a vibe graphic for https://github.com/myuser/myproject”

Custom theme

“Create a 60s space race style vibegraphic for this repo:
https://github.com/myuser/myproject”

Full pipeline (image + animation)

“Turn this repo into a vibe graphic and animate it.”

🎨 Themes (Current & Possible)

You can request any visual style. Some popular vibes:

Blueprint Technical Draft

Cyberpunk Neon

Fantasy Atlas

Retro Space Age

Cosmic Starfield

Minimalist Modern Diagram

Vintage Magazine

Architectural Drawing

Themes are open-ended and extensible.

🎯 Why VibeGraphics?

Because code deserves beautiful storytelling.

VibeGraphics:

Helps readers understand your project instantly

Creates visual shareables for socials

Makes documentation more appealing

Turns abstract code into intuitive diagrams

Gives your repo a unique “brand identity”

Makes your GitHub page feel like a product launch

🤝 Contributing

PRs welcome!

Help with:

New themes

Better prompts

Animation variations

UX improvements

Additional programming language support