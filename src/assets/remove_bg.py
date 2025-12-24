#!/usr/bin/env python3
from PIL import Image
import sys

# Open the image
img = Image.open('pizza-logo.png')
img = img.convert('RGBA')

# Get image data
data = img.getdata()

# Create new data with transparent white background
new_data = []
for item in data:
    # If pixel is white (or near white), make it transparent
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        new_data.append((255, 255, 255, 0))  # Transparent
    else:
        new_data.append(item)

# Put the new data back
img.putdata(new_data)

# Save the result
img.save('pizza-logo-transparent.png')
print("Logo with transparent background created successfully!")

