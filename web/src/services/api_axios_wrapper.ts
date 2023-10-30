import type { AxiosError } from "axios";
import axios from "axios";

import * as blueslip from '../blueslip';

export class AxiosApiWrapper {
    private baseUrl = 'https://devops-zulip-integration.dev.tradethenews.com:12003/api/';

    async get<T = unknown>(relativeUrl: string, params?: unknown): Promise<T|undefined> {
        const url = this.getFullUrl(relativeUrl);
        try {
            const response = await axios.get<T>(url, { 
                params, 
                headers : {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            return response?.data;
        }
        catch (error) {
            const axiosErr = error as AxiosError;
            blueslip.error(`Failed to perform GET API call to ${url}. Status code: ${axiosErr.status}.`);
            return undefined;
        }
    }

    async post<T = unknown>(relativeUrl: string, data?: unknown): Promise<T|undefined> {
        const url = this.getFullUrl(relativeUrl);
        try {
            const response = await axios.post(url, data, { 
                headers : {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            return response?.data;
        }
        catch (error) {
            const axiosErr = error as AxiosError;
            blueslip.error(`Failed to perform POST API call to ${url}. Status code: ${axiosErr.status}.`);
            return undefined;
        }
    }

    getFullUrl(relativeUrl: string): string {
        return `${this.baseUrl}${relativeUrl}`
    } 
}