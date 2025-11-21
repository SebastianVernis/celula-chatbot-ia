#!/bin/bash

# Blackbox API Key
API_KEY="sk-mgu31y6sPid25HyDyFFNMg"
API_URL="https://api.blackbox.ai/chat/completions"

# Directory containing blog posts
POST_DIR="celula-site Actual/post"
OUTPUT_IMAGE_DIR="$POST_DIR/img/blog"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_IMAGE_DIR"

# Function to generate image and return URL
generate_image() {
    local prompt="$1"
    local filename="$2"
    local output_path="$OUTPUT_IMAGE_DIR/$filename"

    echo "Generating image for '$filename' with prompt: '$prompt'..."

    # Construct the curl command
    # Using jq to safely build the JSON payload
    CURL_DATA=$(jq -n --arg model "blackboxai/black-forest-labs/flux-pro" \
                      --arg role "user" \
                      --arg content "$prompt" \
                      '{ 
                          "model": $model, 
                          "messages": [ 
                              { 
                                  "role": $role, 
                                  "content": $content 
                              } 
                          ] 
                      }')

    RESPONSE=$(curl -s -X POST "$API_URL" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "$CURL_DATA")

    IMAGE_URL=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

    if [[ "$IMAGE_URL" == "null" || -z "$IMAGE_URL" ]]; then
        echo "Error: Could not get image URL from API response for '$filename'. Response: $RESPONSE"
        return 1
    fi

    echo "Downloading image from: $IMAGE_URL"
    curl -s -o "$output_path" "$IMAGE_URL"

    if [ $? -eq 0 ]; then
        echo "Image saved to: $output_path"
        echo "Image URL for '$filename': $IMAGE_URL"
        echo "ACTION REQUIRED: Please manually update the HTML file to replace the commented-out line with:"
        echo "  <img src=\"../img/blog/$filename\" alt=\"$prompt\">
        echo "  (Note: The path might need adjustment based on the actual HTML structure relative to the post file, e.g., '../assets/gallery/' if you want to link to a different folder, but using '../img/blog/' as per the original commented tag is recommended)."
    else
        echo "Error: Failed to download image for '$filename' from $IMAGE_URL"
        return 1
    fi
    return 0
}

# Find all HTML files in the post directory that contain commented out images with ./img/blog/ src
# This grep pattern targets lines like: <!-- <img src="./img/blog/FILENAME.webp" alt="ALT TEXT"> -->
# It captures FILENAME.webp and ALT TEXT.
# We are using find with -print0 and while read -d '' to handle filenames with spaces.
find "$POST_DIR" -name 'post-*.html' -print0 | while IFS= read -r -d $'' html_file; do
    echo "--- Processing file: $html_file ---"

    # Extract data using grep and sed for reliable parsing
    # This captures the full line containing the commented image tag
    IMG_TAG_LINE=$(grep -oP '<!--\s*<img\s+src="\.\/img\/blog\/[^"]+\.webp"\s+alt="[^"]+"\s*-->.*' "$html_file")

    if [ -z "$IMG_TAG_LINE" ]; then
        echo "No relevant commented out image tags found in $html_file. Skipping."
        continue
    fi

    # Extract FILENAME and ALT_TEXT from the matched line
    # Using sed to extract specific parts based on the pattern
    FILENAME=$(echo "$IMG_TAG_LINE" | sed -n 's/.*src=".<!--\s*<img\s+src=".\/img\/blog\/\([^"].webp\)"\s+alt="[^"]+".*-->/\1/p')
    ALT_TEXT=$(echo "$IMG_TAG_LINE" | sed -n 's/.*src=".<!--\s*<img\s+src=".\/img\/blog\/[^"].webp"\s+alt=\([^"]+\)".*-->/\1/p')
    
    if [ -z "$FILENAME" ] || [ -z "$ALT_TEXT" ]; then
      echo "Could not parse image data from line: $IMG_TAG_LINE"
      # Fallback: use a generic prompt and filename if parsing fails
      ALT_TEXT="A relevant image for blog post: $(basename "$html_file" .html)"
      FILENAME="generated_$(basename "$html_file" .html).webp"
      echo "Using fallback prompt: '$ALT_TEXT' and filename: '$FILENAME'"
    fi

    # Generate the image
    if generate_image "$ALT_TEXT" "$FILENAME"; then
        echo "Image generation and download successful for $FILENAME."
    else
        echo "Failed to generate image for $FILENAME. Continuing to next file..."
    fi

    # Sleep for 15 seconds before the next iteration
    echo "Sleeping for 15 seconds before processing the next file..."
    sleep 15
done

echo "--- Script finished ---"
echo "Please review the output above. For each generated image, you will need to manually update the corresponding HTML file in '$POST_DIR/' to replace the commented-out line with the new '<img>' tag pointing to the generated image in '$OUTPUT_IMAGE_DIR/'."
