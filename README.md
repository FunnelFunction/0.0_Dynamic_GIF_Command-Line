# Dynamic GIF Command-Line Engine

## A Visual Physics Engine Based on Intent Tensor Theory

**Built by Armstrong Knight & Abdullah Khan | [FunnelFunction](https://funnelfunction.com)**

**AI Collaboration:** Claude (Anthropic), ChatGPT (OpenAI), Grok (xAI), Gemini (Google)

**Live Application:** [https://render-auto-gif.onrender.com](https://render-auto-gif.onrender.com)

---

## Table of Contents

1. [Overview](#overview)
2. [The Mathematics](#the-mathematics)
3. [Quick Start](#quick-start)
4. [Command Syntax](#command-syntax)
5. [Parameters Reference](#parameters-reference)
6. [Color Palettes](#color-palettes)
7. [Decorations System](#decorations-system)
8. [Examples Library](#examples-library)
9. [Architecture](#architecture)
10. [License](#license)

---

## Overview

This is not a template-based GIF generator. It is a **visual physics engine** that projects mathematical structures into pixel space.

Every decoration, every gradient, every animation is the result of mathematical field computation—not pre-drawn assets.

### Core Principle: Scalar Unfurling

A single number contains infinite visual potential when projected through mathematical structure:

```
INPUT:  angle = 45

LEVEL 0: θ = 45 (scalar on ℝ)
         ↓  × π/180
LEVEL 1: θ_rad = 0.785398 (point on S¹)
         ↓  trigonometric projection
LEVEL 2: (cos 45°, sin 45°) = (0.707, 0.707) (direction vector)
         ↓  parametric extension
LEVEL 3: Line family p(t) = p₀ + t·(0.707, 0.707) (infinite lines)
         ↓  rasterization
LEVEL 4: ~50,000 pixel decisions

OUTPUT: Visual field rendered to canvas
```

**Expansion Ratio: 1 number → 50,000 pixels**

---

## The Mathematics

### Intent Tensor Theory (ITT) Foundation

This engine implements the visual projection layer of Intent Tensor Theory:

```
Φ  →  ∇Φ  →  ∇×F  →  ∇²Φ
```

| Operator | Visual Representation | Decoration Type |
|----------|----------------------|-----------------|
| **Φ** | Background field (ground state) | Solid color, gradient |
| **∇Φ** | Gradient direction field | Diagonal lines, crosshatch |
| **∇×F** | Curl / rotational patterns | Waves, rings, burst |
| **∇²Φ** | Collapse points (Laplacian) | Corners, shapes, boundaries |

### The Gating Function

From the Marketing Principals framework:

```
                    S · R · Π
A_{u,m,t}(e) = ───────────────
                  N + L + Θ
```

In this visual engine:
- **S (Sensory)** = Color contrast, shape salience
- **R (Relevance)** = Text content, semantic meaning  
- **Π (Resonance)** = Brand alignment, identity match
- **N (Noise)** = Visual clutter (we minimize this)
- **Decorations** = Field structure that enhances S without adding N

### Layer Composition (Z-Depth)

```
BACK ─────────────────────────────── FRONT

┌─────────────────────────────────────────┐
│ LAYER 0: Background (Φ₀ ground state)   │
├─────────────────────────────────────────┤
│ LAYER 1: Patterns (∇Φ field flows)      │
│   grid, dots, diagonals, crosshatch     │
├─────────────────────────────────────────┤
│ LAYER 2: Filled shapes (|Φ| density)    │
│   glow, circlesFilled, squaresFilled    │
├─────────────────────────────────────────┤
│ LAYER 3: Outlines (∇²Φ collapse points) │
│   corners, circles, squares, rings      │
├─────────────────────────────────────────┤
│ LAYER 4: Text (Ψ offer vectors)         │
│   header, subheader, content, footer    │
├─────────────────────────────────────────┤
│ LAYER 5: Navigation (feedback)          │
│   navDots                               │
└─────────────────────────────────────────┘
```

---

## Quick Start

### Simple Text GIF

```
#text=Hello World
```

### With Palette

```
#text=FunnelFunction|palette=oceanic
```

### Multi-Frame Animation

```
sequence=Frame 1~Frame 2~Frame 3|palette=sunset|timing=2s
```

### Zone-Based Professional Ad

```
header=CompanyName|subheader=Services|content=Service 1~Service 2~Service 3|footer=website.com|decorations=corners
```

---

## Command Syntax

### Mode 1: Simple Text

```
#text=Your Text Here|palette=name|canvas=ratio
```

### Mode 2: Multi-Frame Sequence

```
sequence=Frame1~Frame2~Frame3|palette=name|timing=duration
```

### Mode 3: Zone-Based Layout

```
header=Title|subheader=Subtitle|content=Item1~Item2~Item3|footer=url|decorations=list
```

**Frame Separator:** Use `~` (tilde) to separate frames in sequences and content.

---

## Parameters Reference

### Text Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `text` | Single frame text | `text=Hello World` |
| `sequence` | Multi-frame text (use `~`) | `sequence=One~Two~Three` |

### Layout Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `canvas` | Aspect ratio | `1:1` |
| `palette` | Color scheme | `oceanic` |
| `timing` | Frame duration | `2s` |

**Canvas Options:** `1:1`, `16:9`, `9:16`, `4:3`, `2:3`, `4:5`

### Zone Layout Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `header` | Large title text | - |
| `headerColor` | Header text color | `#ffffff` |
| `subheader` | Subtitle text | - |
| `subheaderColor` | Subheader color | `#00ff00` |
| `content` | Animated content (use `~`) | - |
| `tagline` | Fixed tagline below content | - |
| `taglineColor` | Tagline color | `#cccccc` |
| `footer` | Footer text (URL, etc.) | - |
| `footerColor` | Footer color | `#888888` |
| `background` | `solid` or `gradient` | `solid` |
| `backgroundColor` | Solid background color | `#1a1a1a` |

### Decoration Parameters (Scalar Unfurling)

| Parameter | Description | Default | Unfurling |
|-----------|-------------|---------|-----------|
| `decorations` | Comma-separated list | `corners` | - |
| `decorationColor` | Primary decoration color | `#00ff00` | - |
| `angle` | Rotation for diagonals | `45` | θ → direction vector |
| `angle2` | Second angle (crosshatch) | `135` | θ₂ → second field |
| `spacing` | Distance between elements | `40` | Density of field |
| `thickness` | Line weight | `2` | Field intensity |
| `radius` | Circle/glow radius | `80` | Collapse zone size |
| `amplitude` | Wave height | `20` | Oscillation magnitude |
| `wavelength` | Wave period | `100` | k = 2π/λ |
| `opacity` | Fill transparency | `0.3` | Field density alpha |

---

## Color Palettes

### 50+ Professional Palettes

#### Core Palettes

| Name | Colors | Use Case |
|------|--------|----------|
| `oceanic` | Blue → Teal | Tech, SaaS, Trust |
| `sunset` | Orange → Yellow | Energy, Creativity |
| `midnight` | Dark Blue | Premium, Luxury |
| `forest` | Teal → Green | Eco, Health, Growth |
| `purple` | Purple → Pink | Creative, Innovation |
| `minimal` | White → Gray | Clean, Modern |
| `corporate` | Navy → Blue | Business, Enterprise |
| `neon` | Black + Green text | Gaming, Tech |

#### Professional / Industry

| Name | Use Case |
|------|----------|
| `finance` | Banking, Investment |
| `healthcare` | Medical, Wellness |
| `legal` | Law, Authority |
| `realestate` | Property, Luxury |
| `education` | Learning, Academic |
| `consulting` | Professional Services |

#### Tech / Startup

| Name | Use Case |
|------|----------|
| `techblue` | SaaS, Cloud |
| `startup` | Innovation, Modern |
| `cyber` | Security, Hacking |
| `ai` | Machine Learning |
| `blockchain` | Crypto, Web3 |

#### Warm Tones

| Name | Use Case |
|------|----------|
| `fire` | Urgency, Action |
| `coral` | Friendly, Warm |
| `autumn` | Seasonal, Harvest |
| `terracotta` | Earthy, Natural |
| `peach` | Soft, Beauty |

#### Cool Tones

| Name | Use Case |
|------|----------|
| `ice` | Clean, Fresh |
| `arctic` | Cold, Professional |
| `mint` | Fresh, Health |
| `teal` | Medical, Calm |
| `slate` | Neutral, Business |

#### Dark Themes

| Name | Use Case |
|------|----------|
| `charcoal` | Dark Mode, Elegant |
| `noir` | Luxury, Dramatic |
| `obsidian` | Gaming, Premium |
| `darkpurple` | Creative, Mystery |
| `darkgreen` | Nature, Matrix |

#### Light Themes

| Name | Use Case |
|------|----------|
| `cream` | Elegant, Premium |
| `paper` | Clean, Document |
| `sand` | Natural, Beach |
| `lavender` | Calm, Spa |
| `blush` | Beauty, Fashion |

#### Vibrant / Bold

| Name | Use Case |
|------|----------|
| `electric` | Bold, Energy |
| `candy` | Fun, Playful |
| `rainbow` | Pride, Joy |
| `neonpink` | Nightclub, Youth |
| `synthwave` | Retro, 80s |

#### Earth Tones

| Name | Use Case |
|------|----------|
| `earth` | Natural, Grounded |
| `moss` | Nature, Calm |
| `clay` | Artisan, Craft |
| `olive` | Military, Classic |
| `coffee` | Cafe, Comfort |

#### Metallic Feel

| Name | Use Case |
|------|----------|
| `gold` | Luxury, Award |
| `silver` | Tech, Modern |
| `bronze` | Classic, Warm |
| `rosegold` | Beauty, Fashion |

#### Seasonal

| Name | Use Case |
|------|----------|
| `spring` | Fresh, Renewal |
| `summer` | Bright, Vacation |
| `winter` | Cold, Holiday |
| `holiday` | Christmas, Festive |
| `halloween` | Spooky, October |

---

## Decorations System

### Mathematical Field Visualizations

Each decoration represents a mathematical structure:

| Decoration | Mathematical Basis | ITT Operator |
|------------|-------------------|--------------|
| `corners` | Boundary collapse at vertices | ∇²Φ |
| `circles` | Radial level set r = const | \|x\| = r |
| `squares` | L∞ metric boundary | max(\|x\|,\|y\|) = s |
| `triangles` | 2-simplex tessellation | Simplex |
| `diagonals` | Gradient direction field | ∇Φ |
| `pinstripes` | Dense ∇Φ | ∇Φ (high freq) |
| `crosshatch` | Superposition F₁ + F₂ | ∇Φ₁ + ∇Φ₂ |
| `grid` | Cartesian basis (e₁, e₂) | x=c ∩ y=c |
| `dots` | Discrete field sampling | Φ(lattice) |
| `rings` | Concentric level sets | r ∈ {r₁,r₂,...} |
| `burst` | Angular sector partition | θ = const |
| `wave` | Sinusoidal oscillation | A·sin(kx) |
| `glow` | Radial field intensity | \|Φ(r)\| |
| `circlesFilled` | Field density region | ∫Φ dA |
| `squaresFilled` | L∞ density region | ∫Φ dA |

### Using Decorations

```
decorations=corners,circles,diagonals
```

Multiple decorations compose in layer order (patterns → shapes → outlines).

---

## Examples Library

### 🔤 Simple Text Examples

#### Hello World
```
#text=Hello World
```

#### With Palette
```
#text=Welcome|palette=sunset
```

#### With Scene
```
#text=Innovation|scene=gradient|palette=purple
```

#### Minimal Light
```
#text=Clean Design|palette=minimal
```

#### Neon Dark
```
#text=CYBER|palette=neon
```

#### Finance Theme
```
#text=Investment Solutions|palette=finance
```

#### Healthcare Theme
```
#text=Your Health Matters|palette=healthcare
```

#### AI Theme
```
#text=Machine Learning|palette=ai
```

---

### 🎬 Multi-Frame Sequences

#### Business Services
```
sequence=Consultations~Build Apps~Scale Fast~Profit 💰|palette=oceanic|timing=2s
```

#### Quarterly Report
```
sequence=Q4 Results~Revenue Up 23%~Expanding Markets~2025 Outlook|palette=midnight|timing=3s
```

#### Product Launch
```
sequence=🚀 Launching Soon~New Features~Better UX~Coming January|palette=sunset|timing=1.5s
```

#### How It Works
```
sequence=Step 1: Sign Up~Step 2: Connect~Step 3: Launch~Step 4: Profit!|palette=forest|timing=2s
```

#### Stats Animation
```
sequence=10,000+~Leads Generated~Every Month~FunnelFunction|palette=oceanic|timing=1s
```

#### Brand Intro (Widescreen)
```
sequence=Hello~We Are~FunnelFunction~Let's Build Together|palette=purple|timing=1.5s|canvas=16:9
```

#### Countdown
```
sequence=3~2~1~GO!|palette=fire|timing=1s
```

#### Feature List
```
sequence=✓ Fast~✓ Secure~✓ Reliable~✓ Affordable|palette=techblue|timing=1.5s
```

#### Testimonial Rotation
```
sequence="Great product!" - John~"Highly recommend" - Sarah~"5 stars!" - Mike|palette=corporate|timing=3s
```

---

### 🏗️ Zone-Based Professional Ads

#### Corporate Services
```
header=FunnelFunction|subheader=Lead Generation|content=Email Automation~CRM Integration~Analytics Dashboard~Conversion Tracking|footer=funnelfunction.com|decorations=corners,squares|timing=2s
```

#### Tech Company
```
header=TechCorp|subheader=Solutions|content=Web Development~Mobile Apps~Cloud Services~AI Integration|footer=techcorp.io|decorations=corners|subheaderColor=#00ff00|timing=1.5s
```

#### Healthcare Provider
```
header=MedCare Plus|subheader=Your Health Partner|content=Primary Care~Specialists~Lab Services~Telehealth|tagline=Caring for You|footer=medcareplus.com|decorations=corners,circles|backgroundColor=#004d4d|subheaderColor=#40e0d0|timing=2s
```

#### E-Commerce Brand
```
header=ShopNow|subheader=Holiday Sale|content=50% Off Electronics~Free Shipping~Easy Returns~24/7 Support|footer=shopnow.com|decorations=corners|backgroundColor=#1a1a1a|subheaderColor=#ff6b35|timing=1.5s
```

#### AI Company (Gradient)
```
header=Future Tech|subheader=AI Automations|content=Machine Learning~Neural Networks~Computer Vision~NLP Solutions|tagline=We build tomorrow|footer=future.tech|background=gradient|palette=ai|decorations=corners,circles|timing=2s
```

#### Startup Consulting
```
header=StartupName|subheader=Expert Consulting|content=Strategy~Development~Marketing~Growth|decorations=corners,pinstripes|backgroundColor=#1a1a3a|subheaderColor=#00d4ff|decorationColor=#7b61ff|timing=1.5s
```

#### Finance Services
```
header=Wealth Advisors|subheader=Investment Services|content=Portfolio Management~Tax Planning~Retirement~Estate Planning|footer=wealthadvisors.com|decorations=corners|backgroundColor=#1a3a4a|subheaderColor=#d4af37|timing=2.5s
```

#### Law Firm
```
header=Smith & Partners|subheader=Attorneys at Law|content=Corporate~Litigation~IP~Real Estate|footer=smithpartners.law|decorations=corners|backgroundColor=#2c2c3e|subheaderColor=#d4af37|timing=2.5s
```

#### Real Estate
```
header=Luxury Homes|subheader=Premium Properties|content=Waterfront~Downtown~Suburbs~Commercial|footer=luxuryhomes.com|decorations=corners|backgroundColor=#3d2b1f|subheaderColor=#c9a959|timing=2s
```

#### Education
```
header=Academy Pro|subheader=Online Learning|content=Courses~Certifications~Live Classes~Mentorship|tagline=Learn Without Limits|footer=academypro.edu|decorations=corners,grid|backgroundColor=#1a3a5a|subheaderColor=#5a9fd4|timing=2s
```

#### Restaurant
```
header=Bella Cucina|subheader=Italian Restaurant|content=Pasta~Pizza~Seafood~Desserts|tagline=Authentic Italian Since 1985|footer=bellacucina.com|decorations=corners|background=gradient|palette=terracotta|timing=2s
```

#### Fitness
```
header=FitLife Gym|subheader=Transform Your Body|content=Personal Training~Group Classes~Nutrition~Recovery|footer=fitlifegym.com|decorations=corners,burst|backgroundColor=#1a1a1a|subheaderColor=#ff6b35|timing=1.5s
```

#### SaaS Product
```
header=CloudSync|subheader=Data Platform|content=Real-time Sync~API Access~Analytics~Integrations|tagline=Your data, everywhere|footer=cloudsync.io|decorations=corners,grid|backgroundColor=#0a1628|subheaderColor=#00d4ff|timing=2s
```

---

### 🔢 Scalar Unfurling - Mathematical Patterns

#### 30° Diagonal Lines
```
header=Gradient Co|subheader=∇Φ Fields|content=Linear Flow~Directional Force~Vector Space|decorations=corners,diagonals|angle=30|spacing=50|backgroundColor=#0a0a1a|decorationColor=#00ffaa|timing=2s
```

#### 60° Steep Diagonals
```
header=Steep|subheader=60 Degrees|content=Rising~Climbing~Peak|decorations=corners,diagonals|angle=60|spacing=40|backgroundColor=#1a0a1a|decorationColor=#ff6600|timing=2s
```

#### 75° Nearly Vertical
```
header=Vertical|subheader=75 Degrees|content=Up~Higher~Highest|decorations=corners,diagonals|angle=75|spacing=45|backgroundColor=#0a1a0a|decorationColor=#00ff00|timing=2s
```

#### Crosshatch 60°/120°
```
header=CrossField|subheader=Superposition|content=Wave 1~Wave 2~Interference|decorations=corners,crosshatch|angle=60|angle2=120|spacing=35|backgroundColor=#1a1a2e|decorationColor=#ff6b6b|timing=2s
```

#### Crosshatch 45°/135°
```
header=Diamond|subheader=Pattern|content=A~B~C|decorations=corners,crosshatch|angle=45|angle2=135|spacing=30|backgroundColor=#1a1a1a|decorationColor=#00ffff|timing=2s
```

#### Cartesian Grid
```
header=GridSpace|subheader=Cartesian Basis|content=e₁ Axis~e₂ Axis~Origin|decorations=corners,grid|spacing=30|backgroundColor=#0f0f1a|decorationColor=#4a9eff|timing=1.5s
```

#### Dense Grid
```
header=Dense|subheader=Grid|content=Fine~Detail~Matrix|decorations=corners,grid|spacing=15|backgroundColor=#0a0a0a|decorationColor=#333333|timing=2s
```

#### Concentric Rings
```
header=Radial|subheader=Level Sets|content=r = 40~r = 70~r = 100|decorations=corners,rings|backgroundColor=#1a0a1a|decorationColor=#ff00ff|timing=2s
```

#### Starburst Rays
```
header=Starburst|subheader=Ray Field|content=θ = 0°~θ = 30°~θ = 60°~θ = 90°|decorations=corners,burst|backgroundColor=#1a1a0a|decorationColor=#ffcc00|timing=1.5s
```

#### Sine Wave (Small)
```
header=Sine|subheader=Oscillation|content=Peak~Trough~Zero|decorations=corners,wave|amplitude=20|wavelength=60|backgroundColor=#0a1a1a|decorationColor=#00ffff|timing=2s
```

#### Sine Wave (Large)
```
header=Big Wave|subheader=High Amplitude|content=Crest~Valley~Crest|decorations=corners,wave|amplitude=40|wavelength=120|backgroundColor=#0a0a1a|decorationColor=#ff6b6b|timing=2s
```

#### Dot Lattice (Sparse)
```
header=Dots Array|subheader=Discrete Sampling|content=Point 1~Point 2~Point 3|decorations=corners,dots|spacing=40|backgroundColor=#1a1a1a|decorationColor=#88ff88|timing=1.5s
```

#### Dot Lattice (Dense)
```
header=Dense Dots|subheader=Fine Sampling|content=Many~More~Most|decorations=corners,dots|spacing=20|backgroundColor=#0a0a0a|decorationColor=#666666|timing=2s
```

#### Full Stack (All Layers)
```
header=Full Stack|subheader=Layer Composition|content=Background~Patterns~Shapes~Text|decorations=corners,diagonals,circles,squares|angle=45|spacing=60|backgroundColor=#0f0f2a|decorationColor=#00ff88|timing=2s
```

#### Maximum Complexity
```
header=Complex|subheader=All Decorations|content=Layer 1~Layer 2~Layer 3~Layer 4|decorations=corners,diagonals,circles,squares,grid|angle=30|spacing=50|backgroundColor=#0a0a1a|decorationColor=#ff00ff|timing=2s
```

---

### 🎨 Creative / Bold Examples

#### Neon Nightclub
```
header=CLUB PULSE|subheader=Saturday Night|content=Live DJ~VIP Tables~Open Bar~Dance Floor|footer=clubpulse.com|decorations=corners,burst|backgroundColor=#0a0a0f|subheaderColor=#ff00ff|decorationColor=#00ffff|timing=1s
```

#### Gaming Tournament
```
header=GAME ON|subheader=Tournament|content=Battle Royale~Team Deathmatch~Capture Flag~Free For All|decorations=corners,crosshatch|backgroundColor=#0d0d0d|subheaderColor=#00ff41|decorationColor=#00ff41|timing=1s
```

#### Synthwave Retro
```
header=RETRO WAVE|subheader=80s Vibes|content=Neon Lights~Fast Cars~Sunset~Arcade|decorations=corners,diagonals|angle=75|backgroundColor=#2b1055|subheaderColor=#ff00ff|decorationColor=#00ffff|timing=1.5s
```

#### Pride / Celebration
```
header=CELEBRATE|subheader=Pride Month|content=Love~Unity~Equality~Joy|decorations=corners|background=gradient|palette=rainbow|timing=2s
```

#### Halloween Event
```
header=SPOOKY FEST|subheader=October 31|content=Costumes~Candy~Haunted House~Pumpkins|decorations=corners,burst|backgroundColor=#1a0a0a|subheaderColor=#ff6600|decorationColor=#8b008b|timing=1.5s
```

#### Holiday Sale
```
header=HOLIDAY SALE|subheader=50% OFF|content=Electronics~Fashion~Home~Toys|footer=shop.com|decorations=corners|background=gradient|palette=holiday|timing=1.5s
```

#### Black Friday
```
header=BLACK FRIDAY|subheader=MEGA DEALS|content=TVs 60% Off~Laptops 50% Off~Phones 40% Off~Free Shipping|decorations=corners|backgroundColor=#000000|subheaderColor=#ff0000|decorationColor=#ffffff|timing=1s
```

#### New Year
```
header=2025|subheader=Happy New Year|content=New Goals~New Dreams~New Beginnings~Let's Go!|decorations=corners,burst|backgroundColor=#0a0a1a|subheaderColor=#ffd700|decorationColor=#ffd700|timing=2s
```

---

### 📐 Aspect Ratio Examples

#### Instagram Square (1:1)
```
header=Square|subheader=Instagram|content=Perfect for Feed|decorations=corners|canvas=1:1|timing=2s
```

#### YouTube Thumbnail (16:9)
```
header=Widescreen|subheader=YouTube|content=Great for Thumbnails|decorations=corners|canvas=16:9|timing=2s
```

#### Instagram Story (9:16)
```
header=Story|subheader=Instagram|content=Vertical Format|decorations=corners|canvas=9:16|timing=2s
```

#### Portrait Ad (4:5)
```
header=Portrait|subheader=Facebook Ad|content=Standard Ad Size|decorations=corners|canvas=4:5|timing=2s
```

#### Classic Video (4:3)
```
header=Classic|subheader=4:3 Ratio|content=Traditional Format|decorations=corners|canvas=4:3|timing=2s
```

---

### 🎯 Industry-Specific Templates

#### B2B SaaS
```
header=SaaSify|subheader=Enterprise Platform|content=Automation~Integration~Analytics~Security|tagline=Scale your business|footer=saasify.io|decorations=corners,grid|backgroundColor=#0a1628|subheaderColor=#00d4ff|spacing=35|timing=2s
```

#### Crypto/Web3
```
header=CryptoVault|subheader=DeFi Platform|content=Staking~Yield Farming~NFTs~Governance|footer=cryptovault.io|decorations=corners,diagonals|backgroundColor=#0a1628|subheaderColor=#f7931a|decorationColor=#f7931a|angle=60|timing=1.5s
```

#### E-Learning
```
header=LearnHub|subheader=Online Courses|content=Video Lessons~Quizzes~Certificates~Community|tagline=Learn at your pace|footer=learnhub.com|decorations=corners|backgroundColor=#1a3a5a|subheaderColor=#5a9fd4|timing=2s
```

#### Non-Profit
```
header=GiveHope|subheader=Making a Difference|content=Clean Water~Education~Healthcare~Food Security|tagline=Every donation counts|footer=givehope.org|decorations=corners,circles|backgroundColor=#134e5e|subheaderColor=#2ecc71|timing=2.5s
```

#### Event/Conference
```
header=TechCon 2025|subheader=Annual Conference|content=Keynotes~Workshops~Networking~Expo|tagline=January 15-17, San Francisco|footer=techcon2025.com|decorations=corners,burst|backgroundColor=#1a1a2e|subheaderColor=#667eea|timing=2s
```

#### Job Posting
```
header=We're Hiring|subheader=Join Our Team|content=Engineers~Designers~Marketers~Sales|tagline=Remote-friendly, great benefits|footer=careers.company.com|decorations=corners|background=gradient|palette=startup|timing=2s
```

#### Product Launch
```
header=Introducing|subheader=Product 2.0|content=Faster~Smarter~Better~Affordable|tagline=Available Now|footer=product.com|decorations=corners,rings|backgroundColor=#0a0a1a|subheaderColor=#ff6b35|timing=1.5s
```

#### Webinar Promo
```
header=Free Webinar|subheader=Marketing Mastery|content=Lead Generation~Email Strategy~Analytics~Q&A|tagline=Thursday, 2 PM EST|footer=Register at webinar.com|decorations=corners|backgroundColor=#2c3e50|subheaderColor=#3498db|timing=2s
```

---

## Architecture

### File Structure

```
index.html          # Complete application (single file)
README.md           # This documentation
```

### Technology Stack

- **Pure JavaScript** - No frameworks, no build step
- **HTML5 Canvas** - Native rendering
- **Inline GIF Encoder** - LZW compression, no external dependencies
- **ITT Mathematics** - Scalar unfurling, field projection

### Why Single File?

Following the **Writables Doctrine** from Intent Tensor Theory:

> "Code collapses when δ(Φ−Ψ) < ε"

A single HTML file has:
- **Zero dependencies** to break
- **Zero build steps** to fail
- **Instant deployment** to any static host
- **Complete portability**

The file IS the application. No assembly required.

---

## Credits

### Human Authors
- **Armstrong Knight** - Architecture, ITT Mathematics
- **Abdullah Khan** - Co-founder, Business Strategy

### AI Collaborators
- **Claude (Anthropic)** - Primary development, documentation
- **ChatGPT (OpenAI)** - Ideation, testing
- **Grok (xAI)** - Mathematical validation
- **Gemini (Google)** - Research synthesis

### Theoretical Foundation
- [Intent Tensor Theory](https://intent-tensor-theory.com)
- [FunnelFunction Marketing Principals](https://github.com/FunnelFunction/0.0_git_funnelfunction_marketing_Principals)
- [The Writables Doctrine](https://medium.com/@intent.tensor.theory/the-writables-doctrine-a3043a8a6ffa)

---

## License

MIT License - Free for commercial and personal use.

---

## Links

- **Live App:** [https://render-auto-gif.onrender.com](https://render-auto-gif.onrender.com)
- **GitHub:** [https://github.com/FunnelFunction/0.0_Dynamic_GIF_Command-Line](https://github.com/FunnelFunction/0.0_Dynamic_GIF_Command-Line)
- **FunnelFunction:** [https://funnelfunction.com](https://funnelfunction.com)
- **ITT Institute:** [https://intent-tensor-theory.com](https://intent-tensor-theory.com)

---

*Built with mathematics. Powered by intent. Collapsed into pixels.*
