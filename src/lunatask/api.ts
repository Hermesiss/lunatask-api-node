import axios, {AxiosError} from 'axios';
import {TasksAPI} from "./tasksAPI";
import {handleError} from "./errors";

/**
 * API client for Lunatask.
 * https://lunatask.app/api/overview
 */
export class LunataskAPI {

		public readonly tasks: TasksAPI

		public static readonly baseUrl: string = 'https://api.lunatask.app/v1';
		private readonly accessToken: string;

		constructor(accessToken: string) {
				this.accessToken = accessToken;
				this.tasks = new TasksAPI(accessToken)
		}

		/**
		 * Check if the access token is valid.
		 * @returns {Promise<boolean>} - Successful or not.
		 */
		async ping(): Promise<boolean> {
				try {
						const response = await axios.get(`${LunataskAPI.baseUrl}/ping`, {
								headers: {Authorization: `bearer ${this.accessToken}`}
						});

						return response.data && response.data.message === 'pong';
				} catch (error) {
						if (error instanceof AxiosError && error.response && error.response.status === 401) {
								return false;
						}
						throw handleError(error);
				}
		}
}
