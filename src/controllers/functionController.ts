import {FunctionAdapter} from "../core/functionInterface";
import {BFastConfig} from "../conf";

const axios = require('axios').default;

export class FunctionController implements FunctionAdapter {

    private readonly functionPath: string;

    constructor(path: string) {
        this.functionPath = path
    }

    post(body?: { [key: string]: any; }): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.functionPath && this.functionPath !== '') {
                axios.post(BFastConfig.getCloudFunctionsUrl(this.functionPath), body ? body : {}, {
                    headers: BFastConfig.getHeaders(),
                }).then((value: any) => {
                    resolve(value.data);
                }).catch((reason: any) => {
                    reject(reason);
                });
            } else {
                reject({code: -1, message: 'Please provide function path'});
            }
        });
    }

    async delete<T>(query?: { [p: string]: any }): Promise<T> {
        try {
            const response = await axios.delete(BFastConfig.getCloudFunctionsUrl(this.functionPath), {
                headers: BFastConfig.getHeaders(),
                params: query
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async get<T>(query?: { [p: string]: any }): Promise<T> {
        try {
            const response = await axios.get(BFastConfig.getCloudFunctionsUrl(this.functionPath), {
                headers: BFastConfig.getHeaders(),
                params: query
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async put<T>(body?: { [p: string]: any }): Promise<T> {
        try {
            const response = await axios.put(BFastConfig.getCloudFunctionsUrl(this.functionPath), body ? body : {}, {
                headers: BFastConfig.getHeaders()
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    // names(): Promise<any> {
    //     // console.log(`${this.config.getFaasApi()}/names`);
    //     return new Promise((resolve, reject) => {
    //         axios.post(`${this.config.getFaasApi()}/names`, {}, {
    //             headers: this.config.getHeaders()
    //         }).then((value: any) => {
    //             resolve(value.data);
    //         }).catch((reason: any) => {
    //             reject(reason);
    //         });
    //     });
    // }

}
