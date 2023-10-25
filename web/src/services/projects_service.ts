import { AxiosApiWrapper } from "./api_axios_wrapper";
import { delay } from "./helpers";

type ProjectsResponse = {
    zulipStreamName: string; 
}

export class ProjectsService {
    private apiWrapper = new AxiosApiWrapper();
    private _projects: string[] | undefined;
    private _initialized = false;

    get projects(): string[] | undefined {
        return this._projects;
    } 

    async getProjects(): Promise<string[]|undefined> {
        const projects = await this.apiWrapper.get<ProjectsResponse[]>('projects');
        return projects?.map(x => x.zulipStreamName);           
    }

    async setProjects(): Promise<void> {
        this._projects = await this.getProjects();        
    }

    async init(): Promise<void> {
        if (this._initialized) {
            return;
        }

        await this.doJob();
        this._initialized = true;        
    }

    async doJob(): Promise<void> {
        const tenMinutes = 10 * 60 * 1000;
        await this.setProjects();
        await delay(tenMinutes);
        await this.doJob();
    }
}

const ProjectsServiceInstance = new ProjectsService();

export {
    ProjectsServiceInstance
}

