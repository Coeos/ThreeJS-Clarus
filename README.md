
# Interactive 3D Model Viewer

## Description
This project presents an interactive 3D model experience using Three.js. It includes dynamic animations, user interactions, and a polished design with custom CSS styling.
# Live - https://coeos.github.io/ThreeJS-Clarus/ 

## Features
- **3D Model Loading**: Supports GLTF models loaded into a Three.js scene.
- **Smooth Animations**: Initial rotation animation of the model.
- **Interactive Controls**: 
  - Click on 3D components to zoom and center the camera.
  - Highlight clicked components temporarily.
  - Display contextual information for selected components.
- **Responsive Design**: Adjusted to fit full-screen canvas with an intuitive UI.


## Customization
- **Colors and Styles**: Update the variables in `:root` in `style.css` to change global colors, shadows, and text effects.
- **Model Replacement**: Replace the GLTF file in the `./card/` directory with your own model.
- **Information Blocks**: Modify the `#info-box` content to reflect the new model's components.

## Dependencies
- [Three.js](https://threejs.org/): 3D rendering library.
- `GLTFLoader`: For loading GLTF models.
- `OrbitControls`: For user-friendly camera navigation.


## Author
Developed for educational and creative purposes using Three.js.
