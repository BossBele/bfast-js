import {AppCredentials, BFastConfig} from "./conf";
import {DomainController} from "./controllers/DomainController";
import {FunctionController} from "./controllers/FunctionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./adapters/DomainAdapter";
import {AuthController} from "./controllers/AuthController";
import {SocketController} from "./controllers/SocketController";
import {TransactionAdapter} from "./adapters/TransactionAdapter";
import {TransactionController} from "./controllers/TransactionController";
import {CacheController} from "./controllers/CacheController";
import {CacheAdapter} from "./adapters/CacheAdapter";
import {AxiosRestController} from "./controllers/AxiosRestController";
// @ts-ignore
import * as device from "browser-or-node";
import {HttpRequestModel} from "./model/HttpRequestModel";
import {EventResponseModel, HttpResponseModel} from "./model/HttpResponseModel";
import {HttpNextModel} from "./model/HttpNextModel";


/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */

export const BFast = {

    /**
     *
     * @param options
     * @param appName {string} application name for multiple apps access
     * @return AppCredentials of current init project
     */
    init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP): AppCredentials {
        options.cache = {
            enable: false,
        }
        return BFastConfig.getInstance(options, appName).getAppCredential(appName);
    },

    /**
     * return a config object
     */
    getConfig(): BFastConfig {
        return BFastConfig.getInstance();
    },

    /**
     *
     * @param appName other app/project name from DEFAULT to work with
     */
    database(appName: string = BFastConfig.DEFAULT_APP) {
        return {
            /**
             * a domain/table/collection to deal with
             * @param domainName {string} domain name
             */
            domain<T>(domainName: string): DomainI<T> {
                const cacheController = new CacheController(
                    appName,
                    BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_CACHE_DB_NAME, appName),
                    BFastConfig.getInstance().getCacheCollectionName(domainName, appName),
                );
                const restController = new AxiosRestController()
                return new DomainController<T>(
                    domainName,
                    cacheController,
                    restController,
                    new AuthController(restController, cacheController, appName),
                    appName
                );
            },

            /**
             * same as #domain
             */
            collection<T>(collectionName: string): DomainI<T> {
                return this.domain<T>(collectionName);
            },

            /**
             * same as #domain
             */
            table<T>(tableName: string): DomainI<T> {
                return this.domain<T>(tableName);
            },

            /**
             * perform transaction to remote database
             * @return {TransactionAdapter}
             */
            transaction(isNormalBatch?: boolean): TransactionAdapter {
                return new TransactionController(appName, new AxiosRestController(), isNormalBatch);
            }
        }
    },

    /**
     *
     * @param appName other app/project name to work with
     */
    functions(appName = BFastConfig.DEFAULT_APP) {
        return {
            /**
             * exec a http client request
             * @param path {string} function name
             */
            request(path: string): FunctionController {
                const _restController = new AxiosRestController();
                return new FunctionController(
                    path,
                    _restController,
                    new AuthController(
                        _restController,
                        new CacheController(
                            appName,
                            BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME, appName),
                            BFastConfig.getInstance().getCacheCollectionName(`cache`, appName)
                        ),
                        appName
                    ),
                    appName
                );
            },
            /**
             * listen for a realtime event from a bfast::functions
             * @param eventName
             * @param onConnect {function} callback when connection established
             * @param onDisconnect {function} callback when connection terminated
             */
            event(eventName: string, onConnect?: Function, onDisconnect?: Function): SocketController {
                return new SocketController(eventName, appName, onConnect, onDisconnect);
            },
            onHttpRequest(path: string,
                          handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                              | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                if (device.isNode) {
                    return {
                        method: null,
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onPostHttpRequest(path: string,
                              handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                  | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                if (device.isNode) {
                    return {
                        method: 'POST',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onPutHttpRequest(path: string,
                             handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                 | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                if (device.isNode) {
                    return {
                        method: 'PUT',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onDeleteHttpRequest(path: string,
                                handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                    | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                if (device.isNode) {
                    return {
                        method: 'DELETE',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onGetHttpRequest(path: string,
                             handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                 | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                if (device.isNode) {
                    return {
                        method: 'GET',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onEvent(path: string, handler: (request: { auth?: any, body?: any }, response: EventResponseModel) => any) {
                if (device.isNode) {
                    return {
                        name: path,
                        onEvent: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onGuard(path: string, handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                if (device.isNode) {
                    return {
                        path: path,
                        onGuard: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only';
                }
            },
            onJob(schedule: {
                second?: string,
                minute?: string,
                hour?: string,
                day?: string,
                month?: string,
                dayOfWeek?: string
            }, handler: (job: any) => any) {
                const defaultRule: any = {second: '*', minute: '*', month: '*', day: '*', dayOfWeek: '*', hour: '*'};
                Object.keys(schedule).forEach(key=>{
                    delete defaultRule[key];
                });
                Object.assign(schedule,defaultRule);
                // @ts-ignore
                const rule: any = Object.keys(schedule).map(x => schedule[x]).join(' ');
                if (device.isNode) {
                    return {
                        onJob: handler,
                        rule: rule,
                    };
                } else {
                    throw 'Works In NodeJs Environment Only';
                }
            },
        };
    },

    /**
     * get cache instance to work with when work in a browser
     * @param options
     * @param appName other app/project name to work with
     */
    cache(options?: { database: string, collection: string }, appName = BFastConfig.DEFAULT_APP): CacheAdapter {
        return new CacheController(
            appName,
            (options && options.database)
                ? BFastConfig.getInstance().getCacheDatabaseName(options.database, appName)
                : BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_CACHE_DB_NAME, appName),
            (options && options.collection)
                ? BFastConfig.getInstance().getCacheCollectionName(options.collection, appName)
                : BFastConfig.getInstance().getCacheCollectionName('cache', appName),
        );
    },

    /**
     * get auth instance to work with authentication and authorization
     * @param appName other app/project name to work with
     */
    auth(appName = BFastConfig.DEFAULT_APP) {
        return new AuthController(
            new AxiosRestController(),
            new CacheController(
                appName,
                BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME, appName),
                BFastConfig.getInstance().getCacheCollectionName(`cache`, appName)
            ),
            appName
        );
    },

    /**
     * utils and enums
     */
    utils: {
        USER_DOMAIN_NAME: '_User'
    },

    /**
     * access to storage instance from your bfast::database project
     * @param appName
     */
    storage(appName = BFastConfig.DEFAULT_APP): StorageController {
        return new StorageController(new AxiosRestController(), appName);
    }

};
