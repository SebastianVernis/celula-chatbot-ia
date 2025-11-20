#!/bin/bash

# Script para generar imágenes de blog usando la API de Blackbox AI
# Genera todas las imágenes con un intervalo de 30 segundos entre cada una

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# Verificar que existe la API key
if [ -z "$BLACKBOX_API_KEY" ]; then
    echo -e "${RED}Error: La variable de entorno BLACKBOX_API_KEY no está configurada${NC}"
    echo "Configúrala con: export BLACKBOX_API_KEY='tu_clave_aqui'"
    exit 1
fi

# Crear directorio de salida si no existe
OUTPUT_DIR="assets/images/blog-generated"
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}  Generador de Imágenes para Blog - La Célula${NC}"
echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}Directorio de salida: $OUTPUT_DIR${NC}"
echo -e "${YELLOW}Intervalo entre peticiones: 30 segundos${NC}"
echo ""

# Contador de imágenes
TOTAL_IMAGES=30
CURRENT=0
SUCCESSFUL=0
FAILED=0

# Array de prompts (Post ID : Prompt)
declare -A PROMPTS=(
    ["0"]="Professional digital illustration, vibrant colors, high resolution 1920x1080px. Show a versatile 6-member musical group 'La Célula' on a modern illuminated stage. Include: electric guitar, bass, drums, keyboard, saxophone, and vocalist. Stage lighting with purple, blue, and amber tones. Festive atmosphere with subtle crowd silhouettes. Photorealistic style with dynamic composition, warm color palette, bokeh background effects. Sharp focus on instruments and musicians."
    
    ["1"]="Timeline collage illustration, 1920x1080px. Horizontal timeline from 1980s to 2025. Band performing at each decade marker with era-appropriate styling. Visual elements representing each era (80s neon, 90s grunge, 2000s digital, 2010s indie, 2020s modern). Chronological composition, nostalgic color schemes transitioning through time, detailed period-accurate elements, dynamic layout."
    
    ["2"]="Corporate professional illustration, 1920x1080px. Modern conference hall with sophisticated live band setup. Business professionals networking, cocktail style event. Sleek contemporary stage, professional sound equipment. Corporate branding elements, elegant color scheme (navy, silver, white). Balanced lighting, professional atmosphere, high-end venue, sharp business aesthetic, polished composition."
    
    ["3"]="Split-screen comparison illustration, 1920x1080px. Left side: DJ booth with digital equipment, static setup. Right side: Live band with acoustic instruments, dynamic energy. Visual contrast highlighting live music advantages. Modern clean design, balanced composition, informative icons, professional photography style, clear visual storytelling, comparative layout."
    
    ["4"]="Digital collage artwork, 1920x1080px, vibrant saturated colors. Five distinct sections representing musical genres at a wedding: cumbia (accordion, guiro), rock (electric guitars, drums), salsa (congas, timbales), pop (synthesizers, modern setup), bachata (acoustic guitars, bongos). Central dancing couples in formal attire, joyful expressions. Balanced composition, warm ambient lighting, golden hour tones, romantic atmosphere, high detail."
    
    ["5"]="Cinematic digital illustration, 1920x1080px. Energetic wedding reception, live band center stage with professional backlight setup. Dancing couples in foreground with motion blur effect. Vibrant LED stage lights in magenta, cyan, and amber. Crystal chandeliers, elegant venue. Dynamic composition, celebratory mood, depth of field, photorealistic rendering, high contrast, festive color grading."
    
    ["6"]="Process flowchart illustration, 1920x1080px. Step-by-step visual guide: Initial contact (phone icon) → Consultation (meeting icon) → Contract signing (document icon) → Preparation (checklist icon) → Performance (stage icon) → Follow-up (feedback icon). Clean modern infographic style, connected with flowing arrows, professional color scheme, clear icons, instructional design, high usability."
    
    ["8"]="Event timeline illustration, 1920x1080px. Five circular vignettes showing: ceremony (soft natural light), cocktail hour (elegant gathering), dinner (warm intimate), dance party (energetic lights), finale (spectacular moment). Live music impact icons for each. Circular composition, varied lighting moods, cohesive color story, clear visual narrative, professional event documentation style."
    
