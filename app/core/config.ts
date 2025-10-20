


export type Config = {
  app: {
    env: string;
    name: string;
    origin: string;
    hostname: string;
    api: string;
    sitekey: string;
    enable_feature: string[];
  }
}

export const configs = JSON.parse(import.meta.env.VITE_CONFIG);
export const config: Config = configs[0];
