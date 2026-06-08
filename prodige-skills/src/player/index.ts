import { MCFunction, tellraw } from "sandstone";

import "./events";
import "./firstJoin";

MCFunction('player_index', () => {
  tellraw('@p', { text: "[Skills-Player] Loaded", color: 'yellow' });
}, { runOnLoad: true })