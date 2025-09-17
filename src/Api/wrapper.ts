import globalAxios from "axios";
import { Configuration } from "./configuration";
import { getCookie } from 'cookies-next';


// export const BaseUrl = "http://localhost:3333"; // local
export const BaseUrl = "https://api.heypharmacist.com"; // Prod

globalAxios.interceptors.request.use(async (config) => {

  if (!config?.headers) {
    throw new Error(
      `Expected 'config' and 'config.headers' not to be undefined`
    );
  }

  if (typeof window !== 'undefined') {
    const token = getCookie('capacity-vietnam-token')
    const storeId = getCookie('x-store-key')
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    if (storeId)
      config.headers["x-store-key"] = storeId;
  }

  return config;
});

const ABORT_CONTROLLER = new AbortController();

export const AXIOS_CONFIG = new Configuration({
  basePath: BaseUrl,
  baseOptions: {
    signal: ABORT_CONTROLLER.signal,
    timeout: 20000,
  },
});
