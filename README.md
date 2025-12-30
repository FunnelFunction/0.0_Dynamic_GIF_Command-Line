# DYNAMIC GIF COMMAND-LINE

### URL → Manifest → Emergence → GIF

A declarative visual computation engine that generates GIFs from URL commands.

---

## 🌟 The Concept

**Traditional Way:**
```
User → Figma → Export → Photoshop → Export → GIF
Time: Hours | Cost: $$$
```

**Dynamic GIF Way:**
```
User types URL → System renders → GIF appears
Time: Milliseconds | Cost: $0
```

---

## ⚡ Quick Start

### Use It Now

Visit: `https://render-auto-gif.onrender.com/#scene=corporate|text=Hello World`

### Command Syntax

```
#<param1>=<value1>|<param2>=<value2>|...
```

### Examples

```
# Minimal text
#scene=minimal|text=Hello World|canvas=1:1

# Corporate style
#scene=corporate|text=Innovation|palette=future_tech|animate=fadeIn

# Animated shape
#shape=circle|fill=#00d4ff|animate=grow|canvas=1:1

# Full featured
#scene=gradient|text=FunnelFunction|palette=oceanic|canvas=16:9|animate=pulse
```

---

## 📖 Parameter Reference

### Canvas
| Parameter | Values | Description |
|-----------|--------|-------------|
| `canvas` | `1:1`, `16:9`, `9:16`, `4:5` | Aspect ratio preset |
| `canvas` | `800x600` | Custom dimensions |

### Scene Templates
| Parameter | Values |
|-----------|--------|
| `scene` | `minimal`, `corporate`, `gradient`, `celebration` |

### Color Palettes
| Parameter | Values |
|-----------|--------|
| `palette` | `future_tech`, `oceanic`, `brutalism`, `forest`, `sunset` |

### Text
| Parameter | Description |
|-----------|-------------|
| `text` | The text to display |
| `fontsize` | Font size in pixels |
| `color` | Text color (hex or named) |
| `align` | `left`, `center`, `right` |
| `x`, `y` | Position (px or %) |

### Shapes
| Parameter | Values |
|-----------|--------|
| `shape` | `circle`, `rectangle`, `triangle` |
| `fill` | Fill color |
| `stroke` | Stroke color |
| `size` | Size in pixels |

### Animation
| Parameter | Values |
|-----------|--------|
| `animate` | `none`, `fadeIn`, `fadeOut`, `pulse`, `grow`, `sparkle`, `slide` |

---

## 🧠 The Architecture

Based on **Intent Tensor Theory (ITT)** pre-emergent dynamics:

```
Φ    → Scalar potential (raw values)
∇Φ   → Gradient field (boundaries)
σ    → Accumulation (connected regions)
ρ_q  → Boundary charge (frozen output)
```

### Pipeline

```
URL Command
    ↓
Parse (∇Φ detection)
    ↓
Validate (Writable Gate FSM)
    ↓
Emerge (σ-accumulation)
    ↓
Render (ρ_q crystallization)
    ↓
GIF Output
```

---

## 🛠 Development

```bash
# Install
npm install

# Dev server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── main.js              # Entry point
├── core/
│   ├── manifest.js      # URL → Manifest parser
│   ├── validator.js     # Writable Gate FSM
│   ├── primitives.js    # ITT shape emergence
│   └── renderer.js      # Canvas rendering
└── rendering/
    └── gif.js           # GIF encoder
```

---

## 🎯 Philosophy

**Ghostless Architecture:** Every name describes its purpose.

**Writable Doctrine:** Invalid data never enters the pipeline.

**Pre-Emergent Dynamics:** Complex visuals emerge from simple rules.

**URL as Language:** URLs are executable visual programs.

---

## 📜 License

MIT License

---

**Built by FunnelFunction** | Intent Tensor Theory | Dynamic Awareness Mathematics
