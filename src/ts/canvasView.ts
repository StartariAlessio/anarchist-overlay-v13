const DEFAULT_CENTER_DURATION_MS = 500;

type SceneDimensionsLike = {
  sceneRect: { x: number; y: number; width: number; height: number };
};

/**
 * Pans the canvas so the center of the scene map is in the middle of the viewport.
 * Runs on each client when the overlay is created (via socket).
 *
 * Foundry v13+ `animatePan` / `recenter` use CanvasViewPosition: x/y become
 * `stage.pivot` (world coordinates), not stage translation.
 */
export const centerMapOnScreen = async (
  duration = DEFAULT_CENTER_DURATION_MS
): Promise<void> => {
  if (!canvas?.ready || !canvas.scene) return;

  const dims = canvas.dimensions as SceneDimensionsLike | null;
  if (!dims?.sceneRect) return;

  const scale = canvas.stage.scale.x;
  const x = dims.sceneRect.x + dims.sceneRect.width / 2;
  const y = dims.sceneRect.y + dims.sceneRect.height / 2;

  await canvas.animatePan({
    x,
    y,
    scale,
    duration,
  });
};
