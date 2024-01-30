import {LunataskAPI} from "../src/lunatask/api";
import dotenv from "dotenv";
import {TaskEisenhower, TaskMotivation, TaskPriority, TaskStatus} from "../src/lunatask/types";
import {Errors} from "../src/lunatask/errors";

dotenv.config({path: '.env.test'});

const LUNATASK_ACCESS_TOKEN = process.env.LUNATASK_ACCESS_TOKEN;

if (!LUNATASK_ACCESS_TOKEN) throw new Error('No access token provided.');

const LUNATASK_AREA_ID = process.env.LUNATASK_AREA_ID;

if (!LUNATASK_AREA_ID) throw new Error('No area ID provided.');

const LUNATASK_GOAL_ID = process.env.LUNATASK_GOAL_ID;

if (!LUNATASK_GOAL_ID) throw new Error('No goal ID provided.');

describe('LunataskAPI', () => {
		const api = new LunataskAPI(LUNATASK_ACCESS_TOKEN);

		test('ping-true', async () => {

				const result = await api.ping();

				expect(result).toBe(true);
		});

		test('ping-false', async () => {
				const badApi = new LunataskAPI('bad-access-token');

				const result = await badApi.ping();

				expect(result).toBe(false);
		});

		let id: string;

		test('create', async () => {
				const result = await api.tasks.createTask({
						area_id: LUNATASK_AREA_ID,
						goal_id: LUNATASK_GOAL_ID,
						name: 'Test Task',
						note: 'This is a test task.',
						status: TaskStatus.Later,
						priority: TaskPriority.Highest,
						motivation: TaskMotivation.Must,
						eisenhower: TaskEisenhower.Uncategorized,
						source: 'API_TEST',
						source_id: '1'
				});

				expect(result).toBeDefined();

				if (!result) throw new Error('No result returned.');

				id = result.id;

				const duplicateResult = await api.tasks.createTask({
						area_id: LUNATASK_AREA_ID,
						goal_id: LUNATASK_GOAL_ID,
						source: 'API_TEST',
						source_id: '1'
				})

				expect(duplicateResult).toBeNull();
		})

		test('createWrongToken', async () => {
				const badApi = new LunataskAPI('bad-access-token');

				try {

						const result = await badApi.tasks.createTask({
								area_id: LUNATASK_AREA_ID,
								goal_id: LUNATASK_GOAL_ID,
								name: 'Test Task',
								source: 'API_TEST',
								source_id: '1'
						});

				} catch (error) {
						expect(error).toBeDefined();
						expect(error).toBeInstanceOf(Errors.UnauthorizedError)
				}
		})

		test('retrieveAll', async () => {

				const result = await api.tasks.retrieveAll('API_TEST');

				expect(result).toBeDefined();
				expect(result.length).toBe(1);
		})

		test('retrieve', async () => {
				const result = await api.tasks.retrieveSingle(id);

				expect(result).toBeDefined();
				expect(result.sources[0].source).toBe('API_TEST');
		})

		test('update', async () => {
				const result = await api.tasks.retrieveAll('API_TEST', '1');
				const task = result[0];
				const updatedTask = await api.tasks.updateTask(task.id, {
						name: 'Updated Test Task',
						note: 'This is an updated test task.'
				});

				expect(updatedTask).toBeDefined();
		})

		test('delete', async () => {
				const result = await api.tasks.deleteTask(id);

				expect(result).toBeDefined();

				const tasks = await api.tasks.retrieveAll('API_TEST');
				expect(tasks.length).toBe(0);
		})
});
