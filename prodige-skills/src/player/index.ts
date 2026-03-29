import { MCFunction, tellraw } from "sandstone";
import { eventWatcher } from "./eventWatcher";

MCFunction('player_index', () => {
  tellraw('@p', { text: "[Skills-Player] Loaded", color: 'yellow' });

  eventWatcher();
})