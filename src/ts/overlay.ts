import { centerMapOnScreen } from './canvasView';
import { moduleId } from './constants';
import { ModuleSocket } from './types';

const MIN_ABOVE_UI_Z = 100_000;
const HIDE_UI_CLASS = 'anarchist-hide-ui';

export type OverlayConfig = {
  positionX?: string;
  positionY?: string;
  fadeOnClose?: boolean;
  closeTime?: number;
  closeAllWindows?: boolean;
  hideUi?: boolean;
  centerMap?: boolean;
  centerMapDuration?: number;
  aboveUi?: boolean;
  blockInteractions?: boolean;
};

type NormalizedOverlayConfig = Required<OverlayConfig>;

export const createOverlay = (socket: ModuleSocket) => (config: OverlayConfig, html: string) => {
  if (!game.user?.isGM) {
    throw new Error('Only GM can create overlays.');
  }
  return socket.executeForEveryone('createOverlay', config, html);
};

export const setupOverlaySocket = (socket: ModuleSocket) => {
  socket.register('createOverlay', handleOverlayCreation);
};

const handleOverlayCreation = async (config: OverlayConfig, html: string) => {
  const normalizedConfig = normalizeConfig(config);

  if (normalizedConfig.closeAllWindows) {
    await closeAllWindows();
  }

  document.querySelectorAll('.anarchist-overlay').forEach((el) => el.remove());
  if (!normalizedConfig.hideUi) {
    setFoundryUiHidden(false);
  }

  const template = await foundry.applications.handlebars.renderTemplate(
    `modules/${moduleId}/templates/overlay.hbs`,
    normalizedConfig
  );
  const overlay = parseOverlayElement(template);
  overlay.innerHTML = html;
  document.body.append(overlay);

  if (normalizedConfig.hideUi) {
    setFoundryUiHidden(true);
  }

  if (normalizedConfig.centerMap) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await centerMapOnScreen(normalizedConfig.centerMapDuration);
  }

  if (normalizedConfig.aboveUi) {
    applyAboveUiStacking(overlay);
  }

  if (normalizedConfig.closeTime > 0) {
    await handleClosingOverlay(overlay, normalizedConfig);
  }

  return overlay;
};

const parseOverlayElement = (template: string): HTMLElement => {
  const parsed = foundry.utils.parseHTML(template);
  const overlay =
    parsed instanceof HTMLElement ? parsed : (parsed[0] as HTMLElement | undefined);

  if (!overlay) {
    throw new Error(
      `[${moduleId}] Failed to parse overlay template: no root element found.`
    );
  }

  return overlay;
};

const handleClosingOverlay = async (
  overlay: HTMLElement,
  config: NormalizedOverlayConfig
) => {
  await sleeper(config.closeTime * 1000);
  if (config.fadeOnClose) {
    overlay.classList.add('fade-out');
    await sleeper(2000);
  }
  removeOverlay(overlay, config);
};

const removeOverlay = (
  overlay: HTMLElement,
  config: Pick<NormalizedOverlayConfig, 'hideUi'>
) => {
  overlay.remove();
  if (config.hideUi) {
    setFoundryUiHidden(false);
  }
};

const setFoundryUiHidden = (hidden: boolean) => {
  document.body.classList.toggle(HIDE_UI_CLASS, hidden);
};

const normalizeConfig = (config: OverlayConfig): NormalizedOverlayConfig => {
  return {
    positionX: config.positionX ?? 'center',
    positionY: config.positionY ?? 'center',
    fadeOnClose: config.fadeOnClose ?? true,
    closeTime: config.closeTime ?? 15,
    closeAllWindows: config.closeAllWindows ?? true,
    hideUi: config.hideUi ?? false,
    centerMap: config.centerMap ?? false,
    centerMapDuration: config.centerMapDuration ?? 500,
    aboveUi: config.aboveUi ?? true,
    blockInteractions: config.blockInteractions ?? true,
  };
};

const sleeper = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

/** Core UI (sidebar, HUD, chat, …) must not be closed — only document pop-out sheets. */
const isClosableDocumentSheet = (app: foundry.applications.api.ApplicationV2): boolean => {
  if (!app.rendered) return false;

  const { DocumentSheetV2 } = foundry.applications.api;
  if (app instanceof DocumentSheetV2) return true;

  // Custom sheets that extend DocumentSheetV2 but may fail instanceof across contexts
  const document = (app as { document?: unknown }).document;
  return document != null && typeof document === 'object';

  // Do not close Sidebar, directories, HUD, SceneControls, etc. (no .document)
};

const closeAllWindows = async () => {
  const closes: Promise<unknown>[] = [
    ...foundry.applications.instances
      .values()
      .filter(isClosableDocumentSheet)
      .map((app) => app.close({ animate: false })),
  ];

  // AppV1 pop-out windows (legacy sheets still on some clients)
  for (const app of Object.values(ui.windows ?? {})) {
    if (app?.rendered) closes.push(app.close());
  }

  await Promise.allSettled(closes);
};

const applyAboveUiStacking = (overlay: HTMLElement) => {
  const { ApplicationV2 } = foundry.applications.api;
  const instanceZs = [...foundry.applications.instances.values()].map(
    (app) => app.position.zIndex ?? 0
  );
  const baseZ = Math.max(
    ApplicationV2._maxZ,
    ...(instanceZs.length > 0 ? instanceZs : [0])
  );
  overlay.style.zIndex = String(Math.max(baseZ + 1, MIN_ABOVE_UI_Z));
};
