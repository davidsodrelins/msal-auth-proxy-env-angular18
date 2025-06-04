import { Configuration, LogLevel } from "@azure/msal-browser";
import { environment } from "./environments/environment";

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.clientIdMSAL,
    authority: environment.authorityMSAL,
    redirectUri: environment.redirectUriMSAL,
    postLogoutRedirectUri: environment.redirectUriMSAL,
  },
  cache: {
    cacheLocation: "localStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
    },
  },
};
