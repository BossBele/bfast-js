export class BFastConfig {
    static DEFAULT_APP = 'DEFAULT';
    private credentials: { [key: string]: AppCredentials } = {};

    private constructor() {
    }

    private static instance: BFastConfig;

    static getInstance(config?: AppCredentials, appName = BFastConfig.DEFAULT_APP): BFastConfig {
        if (!BFastConfig.instance) {
            BFastConfig.instance = new BFastConfig();
        }
        if (config) {
            this.instance.credentials[appName] = config;
        }
        return BFastConfig.instance;
    }

    getAppCredential(appName = BFastConfig.DEFAULT_APP) {
        return this.credentials[appName];
    }

    getHeaders(appName: string): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': this.credentials[appName].applicationId
        }
    };

    getMasterHeaders(appName: string): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': this.credentials[appName].applicationId,
            'X-Parse-Master-Key': this.credentials[appName].appPassword,
        }
    };

    functionsURL(path: string, appName: string): string {
        if (path.startsWith('http')) {
            return path;
        }
        if (this.credentials[appName].functionsURL && this.credentials[appName].functionsURL?.startsWith('http')) {
            return this.credentials[appName].functionsURL as string;
        }
        return `https://${this.credentials[appName].projectId}-faas.bfast.fahamutech.com${path}`
    };

    databaseURL(appName: string, suffix?: string): string {
        if (this.credentials[appName].databaseURL && this.credentials[appName].databaseURL?.startsWith('http')) {
            if (suffix) {
                return this.credentials[appName].databaseURL + suffix;
            } else {
                return this.credentials[appName].databaseURL as string;
            }
        }
        if (suffix) {
            return `https://${this.credentials[appName].projectId}-daas.bfast.fahamutech.com${suffix}`;
        } else {
            return `https://${this.credentials[appName].projectId}-daas.bfast.fahamutech.com`;
        }

    };

}

export interface AppCredentials {
    applicationId: string;
    functionsURL?: string;
    projectId: string;
    databaseURL?: string;
    token?: string;
    appPassword?: string;
    cache?: CacheConfigOptions
}

export interface CacheConfigOptions {
    enable: boolean,
    cacheStoreName: string,
    cacheStoreTTLName: string,
}
