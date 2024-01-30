import {ExternalSource, Task, TaskEisenhower, TaskMotivation, TaskPriority, TaskStatus} from "./types";

export interface RetrieveAllResponse {
		tasks: Task[];
}

export interface CreateTaskParams {
		area_id: string;
		goal_id?: string;
		name?: string;
		note?: string;
		status?: TaskStatus;
		motivation?: TaskMotivation;
		eisenhower?: TaskEisenhower;
		estimate?: number;
		priority?: TaskPriority;
		scheduled_on?: string;
		completed_at?: string;
		source?: string;
		source_id?: string;
}

export interface TaskResponse {
		task: Task;
}

export interface TaskUpdateParams {
		name?: string;
		note?: string;
}

export interface TaskWithUpdateParams {
		name?: string;
		note?: string;
		area_id?: string;
		goal_id?: string | null;
		status?: TaskStatus;
		previous_status?: TaskStatus;
		estimate?: number;
		priority?: TaskPriority;
		motivation?: TaskMotivation;
		eisenhower?: TaskEisenhower;
		sources?: ExternalSource[];
		scheduled_on?: string | null;
		completed_at?: string | null;
		created_at?: string;
		updated_at?: string;
		deleted_at?: string | null;
}
