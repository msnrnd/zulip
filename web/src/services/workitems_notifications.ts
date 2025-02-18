import type { HubConnection} from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr';

type WorkItemEventPayload = {
    id: number,
    title?: string,
    isBeingTracked: boolean,
    url: string,
};

type WorkItemEvent = (payload: WorkItemEventPayload) => void;

class PubSub {

    private subscribers: Array<WorkItemEvent>;
    constructor(){
        this.subscribers = []
    }
    
    subscribe(subscriber: WorkItemEvent): void{
        if(typeof subscriber !== 'function'){
            throw new TypeError(`${typeof subscriber} is not a valid argument for subscribe method, expected a function instead`)
        }
        this.subscribers = [...this.subscribers, subscriber];
    }
    
    unsubscribe(subscriber: WorkItemEvent): void{
        if(typeof subscriber !== 'function'){
            throw new TypeError(`${typeof subscriber} is not a valid argument for unsubscribe method, expected a function instead`)
        }
        this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    }
    
    publish(payload: WorkItemEventPayload): void{
        for (const subscriber of this.subscribers) {
            subscriber(payload);
        }
    }
}

const workitemsNotificationsPubSubInstance = new PubSub();

class WorkitemsNotifications {
    private connection: HubConnection;

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl("https://devops-zulip-integration-dev.tradethenews.com:12003/hubs/tracking", {withCredentials: true})
            .withAutomaticReconnect([0, 2000, 10000, 30000, 60000, 120000, 300000, 90000, 1800000, 3600000, 3600000, 3600000, 3600000, 3600000, 3600000])
            .build();

        this.connection.on("work-items", (payload: WorkItemEventPayload) => {
            workitemsNotificationsPubSubInstance.publish(payload);
        });
    }

    async start(): Promise<void> {
        await this.connection.start();
    }    
}

let workitemsNotifications: WorkitemsNotifications;

export async function initializeWorkitemsNotifications(): Promise<void> {
    workitemsNotifications = new WorkitemsNotifications();
    await workitemsNotifications.start();
}



export default workitemsNotificationsPubSubInstance;