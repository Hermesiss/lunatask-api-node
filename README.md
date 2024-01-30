# Lunatask API

This is a TypeScript module for interacting with [Lunatask app](https://lunatask.app/) via
the [Lunatask API](https://lunatask.app/api/overview).

## Installation

To install this package, you can use either `npm` or `yarn`:

```shell
npm install lunatask-api
# or
yarn add lunatask-api
```

## Usage

You need an access token to use the Lunatask API.

You can create one in your app, in the `Settings / Access tokens` section.

You can check the token by `ping()` command

```typescript
import {LunataskAPI} from 'lunatask-api';

const api = new LunataskAPI('token');

api.ping().then((response) => {
  console.log(response); // true or false
});
```

## Errors

Each method can throw an error (more info in [API docs](https://lunatask.app/api/overview#errors)):

- `LunataskAPIError` - generic error
- `UnauthorizedError` - 401 - Your access token is missing, is wrong, or was revoked
- `NotFoundError` - 404 - The specified entity could not be found
- `UnprocessableEntityError` - 422 - The provided entity is not valid. Check what data you are sending
- `InternalServerError` - 500 - We encountered a problem processing your request and have been notified. Please, try
  again later. If the problem persists, please, [contact us](https://lunatask.app/contact)
- `ServiceUnavailableError` - 503 - We're temporarily offline for maintenance. Please, try again later
- `RequestTimedOutError` - 524 - Please, try again

You can catch errors like this:

```typescript
import {TasksAPI, CreateTaskParams, UnauthorizedError} from 'lunatask-api';

const api = new TasksAPI('your-access-token');

const taskParams: CreateTaskParams = {
  title: 'New Task',
  description: 'This is a new task',
  // add other task parameters as needed
};

api.createTask(taskParams)
    .then((task) => {
      if (task) {
        console.log('Task created:', task);
      } else {
        console.log('Task was not created due to possible duplicate');
      }
    })
    .catch((error) => {
      if (error instanceof UnauthorizedError) {
        console.error('Your access token is missing, is wrong, or was revoked.');
      } else {
        console.error('An error occurred:', error);
      }
    });
```

## License

MIT

