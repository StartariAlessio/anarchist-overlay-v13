import { createOverlay } from './overlay';
import { createTextCrawlHtml } from './textCrawl';

export interface AnarchistOverlayModule {
  createOverlay: ReturnType<typeof createOverlay>;
  createTextCrawlHtml: typeof createTextCrawlHtml;
}

export type Socketlib = {
  registerModule: (id: string) => ModuleSocket;
};

export type ModuleSocket = {
  register: (method: string, handler: Function) => void;
  executeForEveryone: (method: string, ...args: unknown[]) => Promise<unknown>;
};
