
# Interactive 3D Model Viewer

## Description
This project presents an interactive 3D model experience using Three.js. It includes dynamic animations, user interactions, and a polished design with custom CSS styling.

## Features
- **3D Model Loading**: Supports GLTF models loaded into a Three.js scene.
- **Smooth Animations**: Initial rotation animation of the model.
- **Interactive Controls**: 
  - Click on 3D components to zoom and center the camera.
  - Highlight clicked components temporarily.
  - Display contextual information for selected components.
- **Responsive Design**: Adjusted to fit full-screen canvas with an intuitive UI.

## File Structure
- `index.html`: Main HTML file to structure the webpage.
- `script.js`: JavaScript file containing the Three.js logic, model loading, animations, and user interactions.
- `style.css`: CSS file for styling the page, including button designs and gradient text effects.
- `./card/scene.gltf`: Default 3D model used in the viewer.

## Installation
1. Place all files in the same directory.
2. Ensure the GLTF model is located at `./card/scene.gltf`.
3. Open `index.html` in a modern web browser with WebGL support.

## Customization
- **Colors and Styles**: Update the variables in `:root` in `style.css` to change global colors, shadows, and text effects.
- **Model Replacement**: Replace the GLTF file in the `./card/` directory with your own model.
- **Information Blocks**: Modify the `#info-box` content to reflect the new model's components.

## Dependencies
- [Three.js](https://threejs.org/): 3D rendering library.
- `GLTFLoader`: For loading GLTF models.
- `OrbitControls`: For user-friendly camera navigation.

## Usage
1. Launch the viewer by opening `index.html`.
2. Explore the rotating model.
3. Click the styled button to activate interactive mode.
4. Select components to zoom in, highlight them, and view detailed information.
5. Click outside components to reset the camera view.

## Notes
- A local server may be required for loading assets (e.g., `http-server` or another simple server).
- Ensure browser compatibility with WebGL.

## License
This project is open-source and available for modification and use.

## Author
Developed for educational and creative purposes using Three.js.

