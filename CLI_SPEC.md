# CLI SPECIFICATION

## *Complete Command Language Reference*

---

## 📖 TABLE OF CONTENTS

1. [Syntax Overview](#syntax-overview)
2. [Core Commands](#core-commands)
3. [Modifiers](#modifiers)
4. [Profiles](#profiles)
5. [Scenes](#scenes)
6. [Text](#text)
7. [Layout](#layout)
8. [Animation](#animation)
9. [Canvas & Export](#canvas--export)
10. [Advanced Patterns](#advanced-patterns)
11. [Examples](#examples)

---

## 🎯 SYNTAX OVERVIEW

### **Basic Structure**
```
#command1=value1|command2=value2|command3=value3
```

### **Grammar (EBNF)**
```ebnf
command      ::= "#" statement ("|" statement)*
statement    ::= assignment | modifier
assignment   ::= identifier "=" value
modifier     ::= "::" identifier ("=" value)?
value        ::= string | number | identifier
identifier   ::= [a-zA-Z_][a-zA-Z0-9_-]*
string       ::= [^|#=:]+
```

### **Parsing Rules**
- Commands separated by `|` (pipe)
- Assignments use `=` (equals)
- Modifiers use `::` (double colon)
- Modifiers apply to preceding statement
- Order matters for modifiers
- Whitespace is significant in text values

---

## 🎨 CORE COMMANDS

### **scene**
Set base scene template.

**Syntax:**
```
scene=<template_id>
```

**Available Templates:**
```
minimal          # Blank canvas, no defaults
corporate        # Professional business layout
social           # Social media optimized
launch           # Product launch celebration
announcement     # News/update format
split_l_r        # Left-right split layout
centered         # Center-aligned composition
hero             # Large hero image style
card             # Card-based layout
```

**Example:**
```
#scene=corporate
#scene=social|text=Hello
```

**Emergence:**
When `scene` is set, the following emerge automatically:
- Default background (scene-specific)
- Layout grid (positioning rules)
- Typography defaults
- Animation defaults

---

### **profile**
Apply brand profile (triggers fiber bundle emergence).

**Syntax:**
```
profile=<type>/<identifier>
```

**Profile Types:**
```
individual/<name>              # Personal style profile
company/<name>                 # Corporate brand profile
ceo/<person>+<company>        # Combined authority
team/<name>                    # Team/department profile
```

**Examples:**
```
#profile=company/auto_workspace_ai
#profile=individual/armstrong
#profile=ceo/armstrong+auto_workspace_ai
```

**Emergence:**
Profile triggers massive emergence (50+ properties):
- Complete color palette
- Typography system
- Icon set
- Decoration elements
- Animation presets
- Layout templates
- Brand rules

**Profile Composition:**
```
# Multiple profiles (merged left-to-right)
#profile=company/auto_workspace_ai+theme/dark

# Inheritance chain
#profile=company/base+company/auto_workspace_ai
```

---

### **text**
Add text content.

**Syntax:**
```
text=<content>[::modifier]*
```

**Basic Examples:**
```
#text=Hello World
#text=Innovation Drives Us
#text=Q4 2024 Results
```

**With Modifiers:**
```
#text=Hello::fontBold
#text=Hello::color=#FF0000::size=48
#text=Hello::fontBold::fontItalic::uppercase
```

**Multiple Text Layers:**
```
#text=Title::layer=1|text=Subtitle::layer=2
#text=Left:Hello|text=Right:World  # Named positions
```

**Special Characters:**
```
#text=Hello%20World     # Space (URL encoded)
#text=Innovation%21     # ! (URL encoded)
#text=Q4%20Results%3A%2042%25  # Colon and percent
```

---

### **layout**
Spatial organization of elements.

**Syntax:**
```
layout=<arrangement>
```

**Available Layouts:**
```
centered         # Center-aligned (default)
top              # Top-aligned
bottom           # Bottom-aligned
left             # Left-aligned
right            # Right-aligned
split_l_r        # Left-right split
split_t_b        # Top-bottom split
grid_2x2         # 2×2 grid
grid_3x3         # 3×3 grid
diagonal         # Diagonal arrangement
scattered        # Random scatter (with seed)
custom           # Custom positioning (requires coords)
```

**Examples:**
```
#layout=centered
#layout=split_l_r|text=Left:Hello|text=Right:World
#layout=grid_2x2|text=TL:A|text=TR:B|text=BL:C|text=BR:D
```

**Custom Positioning:**
```
#layout=custom|text=Hello::x=50%::y=50%
#layout=custom|text=Title::x=100::y=200::anchor=middle
```

---

### **animation**
Motion dynamics and timing.

**Syntax:**
```
animation=<preset>[::modifier]*
```

**Animation Presets:**
```
none             # No animation
fadeIn           # Fade from transparent
fadeOut          # Fade to transparent
slideIn          # Slide from edge
slideOut         # Slide to edge
slideUp          # Slide from bottom
slideDown        # Slide from top
slideLeft        # Slide from right
slideRight       # Slide from left
scale            # Scale from 0 to 1
pulse            # Pulsing effect
bounce           # Bouncing motion
rotate           # Rotation
shake            # Shake effect
```

**Animation Modifiers:**
```
duration=<time>      # Animation duration (1s, 500ms, 2.5s)
delay=<time>         # Start delay
easing=<function>    # Timing function
loop=<count>         # Loop count (infinite, 1, 2, 3...)
direction=<dir>      # normal, reverse, alternate
```

**Examples:**
```
#animation=fadeIn
#animation=slideIn::duration=2s
#animation=pulse::loop=infinite::duration=1s
#animation=fadeIn::delay=0.5s::easing=ease-in-out
```

**Easing Functions:**
```
linear
ease
ease-in
ease-out
ease-in-out
cubic-bezier(0.4,0,0.2,1)
```

---

### **background**
Background styling.

**Syntax:**
```
background=<type>
```

**Background Types:**
```
# Gradients (predefined)
gradientSunset
gradientOcean
gradientForest
gradientTech
gradientVibrant
gradientNordic
gradientWarm
gradientCool

# Solid colors
solid:<color>        # solid:#FF0000
transparent          # No background

# Patterns (future)
pattern:<name>       # pattern:dots
```

**Examples:**
```
#background=gradientTech
#background=solid:#1a1a1a
#background=transparent
```

**Custom Gradients:**
```
#background=gradient:linear::from=#FF0000::to=#0000FF::angle=45deg
#background=gradient:radial::center=#FFFFFF::edge=#000000
```

---

### **decoration**
Corner and edge decorative elements.

**Syntax:**
```
decoration=<element>[::position]*
```

**Decoration Elements:**
```
none             # No decorations
corners          # Corner accents
cornerTech       # Tech-style corners
cornerOrganic    # Organic curves
sparkles         # Particle sparkles
confetti         # Celebratory confetti
seasonal         # Season-appropriate (auto-detects)
geometric        # Geometric patterns
abstract         # Abstract shapes
```

**Position Modifiers:**
```
position=tl      # Top-left
position=tr      # Top-right
position=bl      # Bottom-left
position=br      # Bottom-right
position=all     # All corners
position=top     # Top edge
position=bottom  # Bottom edge
```

**Examples:**
```
#decoration=corners
#decoration=sparkles::position=all
#decoration=cornerTech::position=tl::position=br
```

---

### **canvas**
Output dimensions and aspect ratio.

**Syntax:**
```
canvas=<ratio>|<width>x<height>
```

**Common Ratios:**
```
1:1              # Square (Instagram, profile pics)
16:9             # Landscape (YouTube, presentations)
9:16             # Portrait (Stories, Reels)
4:5              # Portrait (Instagram feed)
4:3              # Classic (presentations)
21:9             # Ultra-wide
```

**Pixel Dimensions:**
```
1080x1080        # Instagram square
1920x1080        # Full HD landscape
1080x1920        # Full HD portrait
1200x628         # Facebook/Twitter link
```

**Examples:**
```
#canvas=1:1
#canvas=16:9
#canvas=1080x1080
```

---

### **export**
Output format specification.

**Syntax:**
```
export=<format>
```

**Available Formats:**
```
png              # Static PNG image
gif              # Animated GIF
pdf              # PDF document
svg              # Vector SVG
mp4              # Video (future)
webm             # Video (future)
```

**Format Modifiers:**
```
quality=<0-100>      # Compression quality
fps=<number>         # Frames per second (GIF/video)
optimize=<bool>      # Optimize file size
transparent=<bool>   # Transparent background
```

**Examples:**
```
#export=png
#export=gif::fps=30::quality=90
#export=pdf::optimize=true
```

---

## 🎨 MODIFIERS

Modifiers use `::` syntax and apply to the preceding command.

### **Text Modifiers**
```
fontBold             # Bold weight
fontItalic           # Italic style
fontLight            # Light weight
fontBlack            # Black weight
uppercase            # UPPERCASE transform
lowercase            # lowercase transform
capitalize           # Capitalize Words

color=<color>        # Text color
size=<size>          # Font size (px, rem, em, %)
font=<family>        # Font family
align=<alignment>    # left, center, right, justify
spacing=<value>      # Letter spacing
lineHeight=<value>   # Line height

shadow=<style>       # Text shadow (small, medium, large)
glow=<color>         # Glow effect
outline=<width>      # Text outline
stroke=<width>       # Text stroke
```

**Examples:**
```
#text=Hello::fontBold::color=#FF0000
#text=Title::size=72::uppercase::shadow=large
#text=Subtitle::font=Montserrat::align=center
```

### **Animation Modifiers**
```
duration=<time>      # Animation duration
delay=<time>         # Start delay
easing=<function>    # Timing function
loop=<count>         # Loop count
direction=<dir>      # Animation direction
fillMode=<mode>      # forwards, backwards, both
```

**Examples:**
```
#animation=fadeIn::duration=2s::delay=0.5s
#animation=pulse::loop=infinite::easing=ease-in-out
```

### **Position Modifiers**
```
x=<value>            # X coordinate (px, %, vw)
y=<value>            # Y coordinate (px, %, vh)
anchor=<point>       # Anchor point (top, middle, bottom, left, center, right)
rotation=<degrees>   # Rotation angle
scale=<factor>       # Scale factor
opacity=<0-1>        # Opacity
```

**Examples:**
```
#text=Hello::x=50%::y=50%::anchor=center
#text=Title::x=100::y=200::rotation=15
```

### **Layer Modifiers**
```
layer=<number>       # Z-index layer (1-100)
blend=<mode>         # Blend mode (multiply, screen, overlay, etc.)
filter=<effect>      # CSS filter (blur, brightness, etc.)
```

**Examples:**
```
#text=Background::layer=1::opacity=0.3
#text=Foreground::layer=10::blend=overlay
```

---

## 👤 PROFILES

### **Individual Profiles**

Personal communication style and preferences.

**Structure:**
```json
{
  "id": "armstrong",
  "type": "individual",
  "name": "Armstrong Knight",
  "communication_style": "bold, direct, technical",
  "preferences": {
    "colors": ["vibrant", "high_contrast"],
    "complexity": "sophisticated",
    "tone": "authoritative"
  }
}
```

**Usage:**
```
#profile=individual/armstrong|text=Innovation is Here
```

### **Company Profiles**

Corporate brand identity.

**Structure:**
```json
{
  "id": "auto_workspace_ai",
  "type": "company",
  "brand_colors": ["#667eea", "#f093fb", "#4facfe"],
  "brand_fonts": ["Inter", "Montserrat"],
  "logo": "auto_workspace_logo.svg",
  "visual_style": "modern, tech-forward"
}
```

**Usage:**
```
#profile=company/auto_workspace_ai|text=Official Announcement
```

### **CEO Mode**

Combined personal + corporate authority.

**Composition:**
```
CEO = Individual ⊕ Company

Merges:
- Personal communication style
- Corporate brand guidelines
- Executive authority
```

**Usage:**
```
#profile=ceo/armstrong+auto_workspace_ai|text=Vision 2025
```

**Result:**
- Armstrong's bold, technical tone
- Auto-Workspace-AI's brand colors/fonts
- Executive gravitas
- Production-ready polish

---

## 🎬 SCENES

Pre-configured templates with sensible defaults.

### **minimal**
Blank canvas, no defaults.
```
#scene=minimal|text=Hello
```

### **corporate**
Professional business layout.
```
Defaults:
- background: gradientCorporate (subtle blue)
- layout: centered
- typography: Inter, 48px, semibold
- animation: fadeIn (subtle)
- tone: professional
```

### **social**
Social media optimized.
```
Defaults:
- canvas: 1:1 (auto-detected)
- background: vibrant gradient
- typography: bold, eye-catching
- animation: attention-grabbing
- tone: casual, engaging
```

### **launch**
Product launch celebration.
```
Defaults:
- background: gradientVibrant
- decoration: sparkles
- animation: slideUp + pulse
- typography: bold, excited
- tone: celebratory
```

### **announcement**
News/update format.
```
Defaults:
- background: clean gradient
- layout: split_l_r or centered
- typography: clear, readable
- animation: fadeIn
- tone: informative
```

### **split_l_r**
Left-right split layout.
```
Defaults:
- layout: 50/50 split
- text areas: text=Left:... and text=Right:...
- animation: slideIn from sides
```

---

## 🎯 ADVANCED PATTERNS

### **Conditional Logic**
```
# Auto-detect and apply
#scene=corporate|profile=auto_workspace_ai

# System automatically:
# - Detects if profile has dark/light preference
# - Applies appropriate background
# - Ensures WCAG compliance
# - Selects optimal layout
```

### **Multi-Layer Composition**
```
#scene=split_l_r|text=Left:Innovation::fontBold::layer=2|text=Right:Excellence::layer=2|background=gradientTech::layer=1|decoration=corners::layer=3
```

### **Temporal Sequencing**
```
# Multiple animations with delays
#text=First::animation=fadeIn::duration=1s|text=Second::animation=fadeIn::delay=1s::duration=1s|text=Third::animation=fadeIn::delay=2s::duration=1s
```

### **Responsive Scaling**
```
# Auto-scales based on canvas
#canvas=1:1|text=Hello::size=auto

# Explicit scaling
#canvas=16:9|text=Title::size=10%::x=50%::y=50%
```

### **Profile Inheritance**
```
# Base profile + overrides
#profile=company/auto_workspace_ai|background=solid:#000000
# Keeps: colors, fonts from profile
# Overrides: background to solid black
```

### **Dynamic Text**
```
# Variables (future)
#text={company_name}|profile=company/auto_workspace_ai
# Resolves: company_name = "Auto-Workspace-AI"

# Timestamps (future)
#text=Generated: {timestamp}
```

---

## 📚 EXAMPLES

### **Example 1: Simple Text GIF**
```
#text=Hello World|canvas=1:1|export=gif
```
**Output:** Square GIF with "Hello World" centered, default styling.

---

### **Example 2: Branded Corporate Post**
```
#scene=corporate|profile=company/auto_workspace_ai|text=Announcing Q4 Results::fontBold
```
**Output:**
- Corporate scene template (professional layout)
- Auto-Workspace-AI brand colors
- Bold headline
- Subtle fade-in animation
- WCAG AAA compliant

---

### **Example 3: CEO Thought Leadership**
```
#profile=ceo/armstrong+auto_workspace_ai|text=The Future of Autonomous AI::fontBold|animation=fadeIn::duration=1.5s|canvas=16:9
```
**Output:**
- Armstrong's personal style (bold, direct)
- Auto-Workspace-AI brand (colors, fonts)
- Professional yet distinctive
- 16:9 landscape for LinkedIn

---

### **Example 4: Product Launch**
```
#scene=launch|profile=company/auto_workspace_ai|text=Launching Q2 2025::uppercase|decoration=sparkles|animation=slideUp::duration=2s|canvas=1:1|export=gif
```
**Output:**
- Launch scene (celebratory)
- Sparkle particles
- Slide-up animation
- Brand-consistent
- Square GIF for Instagram

---

### **Example 5: Split Layout**
```
#scene=split_l_r|profile=company/auto_workspace_ai|text=Left:Innovation::fontBold::color=#667eea|text=Right:Excellence::fontBold::color=#f093fb|animation=slideIn
```
**Output:**
- Left-right split
- "Innovation" on left (brand primary color)
- "Excellence" on right (brand secondary color)
- Simultaneous slide-in from sides

---

### **Example 6: Minimalist**
```
#scene=minimal|text=Less is More::font=Montserrat::size=64::color=#000000|background=solid:#FFFFFF|animation=fadeIn::duration=3s
```
**Output:**
- Blank canvas
- Large minimalist typography
- Black on white
- Slow fade-in

---

### **Example 7: Multi-Layer Complex**
```
#scene=corporate|profile=ceo/armstrong+auto_workspace_ai|text=Title:Vision 2025::layer=3::fontBold::size=72|text=Subtitle:The AI Revolution::layer=2::size=36::opacity=0.8|decoration=cornerTech::layer=1|animation=fadeIn::duration=2s|canvas=16:9|export=png
```
**Output:**
- 3 layers (decorations, subtitle, title)
- CEO mode (personal + corporate)
- Tech corners in background
- Title and subtitle with different styling
- Coordinated fade-in
- 16:9 PNG output

---

## 🔧 ESCAPE SEQUENCES

For special characters in text:
```
Space:      %20
!:          %21
":          %22
#:          %23
$:          %24
%:          %25
&:          %26
':          %27
(:          %28
):          %29
*:          %2A
+:          %2B
,:          %2C
/:          %2F
::          %3A
;:          %3B
=:          %3D
?:          %3F
@:          %40
[]:         %5B %5D
```

**Example:**
```
#text=Q4%20Results%3A%20%2B42%25
# Displays: "Q4 Results: +42%"
```

---

## ⚡ PERFORMANCE TIPS

### **Optimization**
```
# Prefer presets over custom (faster emergence)
#scene=corporate  # Fast
vs
#background=...::layout=...::typography=...  # Slow

# Use profiles for batch properties
#profile=company/auto_workspace_ai  # 50+ properties instantly
vs
#color=...::font=...::icon=...  # One at a time
```

### **Caching**
The system caches:
- Parsed manifests
- Validation results
- Emerged specifications
- Rendered SVGs

Repeated commands are instant.

---

## 🧪 VALIDATION

Commands are validated through FSM before execution:
```
✅ Valid:
#scene=corporate|text=Hello

❌ Invalid (auto-repaired):
#scene=nonexistent|text=Hello
→ Falls back to: #scene=minimal|text=Hello

❌ Invalid (auto-repaired):
#text=Low Contrast::color=#AAAAAA|background=solid:#CCCCCC
→ Adjusts to WCAG compliant: color=#666666
```

System **never fails**—always provides escape path to valid state.

---

## 📖 GRAMMAR REFERENCE

**Complete EBNF Grammar:**
```ebnf
command      ::= "#" statement ("|" statement)*
statement    ::= assignment | text_assignment
assignment   ::= identifier "=" value modifier*
text_assignment ::= "text=" text_value modifier*
modifier     ::= "::" identifier ("=" value)?
value        ::= string | number | color | identifier
text_value   ::= string (":" string)?
identifier   ::= [a-zA-Z_][a-zA-Z0-9_-]*
string       ::= [^|#=:]+
number       ::= [0-9]+ ("." [0-9]+)? unit?
unit         ::= "px" | "rem" | "em" | "%" | "s" | "ms" | "deg"
color        ::= "#" [0-9A-Fa-f]{3,8}
```

---

## 🎓 LEARNING PATH

**Beginner:**
1. Start with `#text=Hello`
2. Add canvas: `#text=Hello|canvas=1:1`
3. Add export: `#text=Hello|canvas=1:1|export=gif`

**Intermediate:**
4. Use scenes: `#scene=corporate|text=Hello`
5. Apply profiles: `#scene=corporate|profile=company/auto_workspace_ai|text=Hello`
6. Add animations: `#scene=corporate|profile=company/auto_workspace_ai|text=Hello|animation=fadeIn`

**Advanced:**
7. Multiple layers: `#text=Title::layer=2|text=Subtitle::layer=1`
8. Custom positioning: `#layout=custom|text=Hello::x=50%::y=50%`
9. Profile composition: `#profile=ceo/armstrong+auto_workspace_ai+theme/dark`

---

## 🚀 NEXT STEPS

- **[Convergence Proofs](./CONVERGENCE_PROOF.md)** - Mathematical guarantees
- **[Architecture](./ARCHITECTURE.md)** - How it works internally
- **[Examples](./examples/)** - Real-world use cases
- **[API Reference](./docs/api/)** - Programmatic usage

---

**Auto-GIF-Customer CLI v1.0**
*Where intent becomes reality through mathematical convergence.* 🎯
