import {Task} from "./types";
import axios from "axios";
import {CreateTaskParams, RetrieveAllResponse, TaskResponse, TaskWithUpdateParams} from "./dto";
import {LunataskAPI} from "./api";
import {handleError} from "./errors";

export class TasksAPI {
		private readonly accessToken: string;

		constructor(accessToken: string) {
				this.accessToken = accessToken;
		}

		/**
		 * Retrieves all tasks from the specified source and source ID.
		 * If no source or source ID is provided, retrieves all tasks.
		 *
		 * @param {string} [source] - The source of the tasks to retrieve.
		 * @param {string} [source_id] - The ID of the source to retrieve tasks from.
		 * @returns {Promise<Task[]>} - Tasks.
		 * @throws {Error} - If there is an error retrieving the tasks.
		 */
		async retrieveAll(source?: string, source_id?: string): Promise<Task[]> {
				try {
						const params: any = {};
						if (source) params.source = source;
						if (source_id) params.source_id = source_id;

						const response = await axios.get<RetrieveAllResponse>(`${LunataskAPI.baseUrl}/tasks`, {
								headers: {Authorization: `bearer ${this.accessToken}`},
								params
						});

						return response.data.tasks;
				} catch (error) {
						throw handleError(error);
				}
		}

		/**
		 * Retrieve a single task by task ID.
		 *
		 * @param {string} taskId - The ID of the task to retrieve.
		 * @returns {Promise<Task>} - Retrieved task.
		 * @throws {Error} - If there is an error retrieving the task.
		 */
		async retrieveSingle(taskId: string): Promise<Task> {
				try {
						const response = await axios.get<TaskResponse>(`${LunataskAPI.baseUrl}/tasks/${taskId}`, {
								headers: {Authorization: `bearer ${this.accessToken}`}
						});

						return response.data.task;
				} catch (error) {
						throw handleError(error);
				}
		}

		/**
		 * Creates a new task with the given parameters.
		 *
		 * @param {CreateTaskParams} taskParams - The parameters for creating the task.
		 * @return {Promise<Task | null>} - Created task. If the task was not created due to possible duplicate, returns null.
		 * @throws {Error} - If there is an error creating the task.
		 */
		async createTask(taskParams: CreateTaskParams): Promise<Task | null> {
				try {
						const response = await axios.post<TaskResponse>(`${LunataskAPI.baseUrl}/tasks`, taskParams, {
								headers: {
										Authorization: `bearer ${this.accessToken}`,
										'Content-Type': 'application/json'
								}
						});
						if (response.data.task) {
								return response.data.task;
						}
						return null;
				} catch (error) {
						throw handleError(error);
				}
		}

		/**
		 * Updates a task with the given task ID and task parameters.
		 *
		 * @param {string} taskId - The ID of the task to be updated.
		 * @param {TaskWithUpdateParams} taskParams - The parameters for updating the task.
		 * @returns {Promise<Task>} - Updated task.
		 * @throws {Error} - If an error occurs while updating the task.
		 */
		async updateTask(taskId: string, taskParams: TaskWithUpdateParams): Promise<Task> {
				try {
						const response = await axios.put<TaskResponse>(`${LunataskAPI.baseUrl}/tasks/${taskId}`, taskParams, {
								headers: {
										Authorization: `bearer ${this.accessToken}`,
										'Content-Type': 'application/json'
								}
						});

						return response.data.task;
				} catch (error) {
						throw handleError(error);
				}
		}

		/**
		 * Deletes a task with the specified ID.
		 *
		 * @param {string} taskId - The ID of the task to be deleted.
		 * @returns {Promise<Task>} - Deleted task.
		 * @throws - If an error occurs during the deletion process.
		 */
		async deleteTask(taskId: string): Promise<Task> {
				try {
						const response = await axios.delete<TaskResponse>(`${LunataskAPI.baseUrl}/tasks/${taskId}`, {
								headers: {Authorization: `bearer ${this.accessToken}`}
						});

						return response.data.task;
				} catch (error) {
						throw handleError(error);
				}
		}
}
