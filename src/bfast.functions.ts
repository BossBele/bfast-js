import {FunctionsController} from "./controllers/FunctionsController";
import {AxiosRestController} from "./controllers/AxiosRestController";
import {AuthController} from "./controllers/AuthController";
import {CacheController} from "./controllers/CacheController";
import {BFastConfig} from "./conf";
import {SocketController} from "./controllers/SocketController";
import {HttpRequestModel} from "./model/HttpRequestModel";
import {EventResponseModel, HttpResponseModel} from "./model/HttpResponseModel";
import {HttpNextModel} from "./model/HttpNextModel";
// @ts-ignore
import * as device from "browser-or-node";

export class BfastFunctions {
    constructor(private readonly appName: string) {

    }

    /**
     * exec a http client request
     * @param path {string} function name
     */
    request(path: string): FunctionsController {
        const _restController = new AxiosRestController();
        return new FunctionsController(
            path,
            _restController,
            new AuthController(
                _restController,
                new CacheController(
                    this.appName,
                    BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), this.appName),
                    BFastConfig.getInstance().getCacheCollectionName(`cache`, this.appName)
                ),
                this.appName
            ),
            this.appName
        );
    }

    /**
     * listen for a realtime event from a bfast::functions
     * @param eventName
     * @param onConnect {function} callback when connection established
     * @param onDisconnect {function} callback when connection terminated
     */
    event(eventName: string, onConnect?: Function, onDisconnect?: Function): SocketController {
        return new SocketController(eventName, this.appName, onConnect, onDisconnect);
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    onEvent(path: string, handler: (request: { auth?: any, body?: any }, response: EventResponseModel) => any) {
        if (device.isNode) {
            return {
                name: path,
                onEvent: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onGuard(path: string, handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
        | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
        if (device.isNode) {
            return {
                path: path,
                onGuard: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }
}
