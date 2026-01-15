#!/bin/bash
DOMAIN="https://www.grupomusicalcelula.com"
OUTPUT="sitemap-remoto.xml"

echo "Rastreando $DOMAIN..."

# Descarga el sitio (solo estructura) y extrae URLs únicas
wget --spider --recursive --no-verbose --output-file=wget.log "$DOMAIN"
grep -oP "$DOMAIN[^ ]*" wget.log | sort | uniq > urls.txt

# Generar el XML
{
    echo '<?xml version="1.0" encoding="UTF-8"?>'
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    while read -r url; do
        # Filtrar URLs para incluir solo páginas HTML relevantes
        if [[ "$url" =~ \.(html|htm|php|asp|aspx|jsp|jspx|py|rb|pl|cgi|cfm)$ || "$url" =~ ^https://www\.grupomusicalcelula\.com/[^./]*$ ]]; then
            echo "  <url>"
            echo "    <loc>$url</loc>"
            echo "    <changefreq>weekly</changefreq>"
            echo "    <priority>0.8</priority>"
            echo "  </url>"
        fi
    done < urls.txt
    echo '</urlset>'
} > "$OUTPUT"

rm wget.log urls.txt
echo "Sitemap creado: $OUTPUT"
