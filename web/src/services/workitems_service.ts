import { AxiosApiWrapper } from "./api_axios_wrapper";

type WorkItem = {
    id: number,
    title: string,
    isBeingTracked: boolean,
    url: string
}

export class WorkItemsService {
    private _apiWrapper = new AxiosApiWrapper();

    async getWorkItems(streamName: string):Promise<WorkItem[] | undefined> {
        const response = await this._apiWrapper.get<WorkItem[]>('tracking/work-items',  { zulipTopicName: streamName });
        return response;
    }

    async getActiveWorkItems():Promise<WorkItem | undefined> {
        const response = await this._apiWrapper.get<WorkItem>('tracking/work-items/active',  {});
        return response;
    }

    async startTracking(id: number) : Promise<void> {
        await this._apiWrapper.post(`tracking/work-items/${id}/start`, {});
    }

    async stopTracking(id: number): Promise<void> {
        await this._apiWrapper.post(`tracking/work-items/${id}/stop`, {});
    }

    async startTrackingCurrent() : Promise<void> {
        await this._apiWrapper.post(`tracking/work-items/start`, {});
    }

    async stopTrackingCurrent(): Promise<void> {
        await this._apiWrapper.post(`tracking/work-items/stop`, {});
    }
}