declare global {
  interface AssumeHookRan {
    init: never;
    i18nInit: never;
    setup: never;
    ready: never;
  }

  interface ModuleConfig {
    'anarchist-overlay': {
      createOverlay: (
        config: import('./ts/overlay').OverlayConfig,
        html: string
      ) => Promise<unknown>;
      createTextCrawlHtml: (
        config: import('./ts/textCrawl').TextCrawlConfig
      ) => Promise<string>;
    };
  }

  interface RequiredModules {
    'anarchist-overlay': true;
    socketlib: true;
  }
}

export {};
