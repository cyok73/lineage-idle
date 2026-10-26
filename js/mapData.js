// js/mapData.js - Map configurations for background and bounds
window.mapData = {
  town: {
    name: "Town",
    bg: "assets/maps/town_bg.jpg",
    // Example bounds for the town area (in world coordinates)
    bounds: { x: 0, y: 0, width: 2000, height: 2000 }
  },
  field: {
    name: "Field",
    bg: "assets/maps/field_bg.jpg",
    bounds: { x: 2000, y: 0, width: 4000, height: 2000 }
  }
  // add more maps here as needed, e.g., cave, desert, etc.
};
