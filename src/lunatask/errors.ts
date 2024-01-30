import {AxiosError} from "axios";

export enum ApiErrorCodes {
		Unauthorized = 401, // Your access token is missing, is wrong, or was revoked.
		NotFound = 404, // The specified entity could not be found.
		UnprocessableEntity = 422, // The provided entity is not valid. Check what data you are sending.
		InternalServerError = 500, // We encountered a problem processing your request and have been notified.
		// Please, try again later. If the problem persists, please, contact <https://lunatask.app/contact>.
		ServiceUnavailable = 503, // We're temporarily offline for maintenance. Please, try again later.
		RequestTimedOut = 524 // Please, try again.
}

class LunataskError extends Error {
		constructor(message: string) {
				super(message);
				this.name = 'LunataskError';
		}
}

class UnauthorizedError extends LunataskError {
		constructor() {
				super('Your access token is missing, is wrong, or was revoked.');
				this.name = 'UnauthorizedError';
		}
}

class NotFoundError extends LunataskError {
		constructor() {
				super('The specified entity could not be found.');
				this.name = 'NotFoundError';
		}
}

class UnprocessableEntityError extends LunataskError {
		constructor() {
				super('The provided entity is not valid. Check what data you are sending.');
				this.name = 'UnprocessableEntityError';
		}
}

class InternalServerError extends LunataskError {
		constructor() {
				super('We encountered a problem processing your request and have been notified.');
				this.name = 'InternalServerError';
		}
}

class ServiceUnavailableError extends LunataskError {
		constructor() {
				super("We're temporarily offline for maintenance. Please, try again later.");
				this.name = 'ServiceUnavailableError';
		}
}

class RequestTimedOutError extends LunataskError {
		constructor() {
				super('Please, try again.');
				this.name = 'RequestTimedOutError';
		}
}

export const Errors = {
		LunataskError,
		UnauthorizedError,
		NotFoundError,
		UnprocessableEntityError,
		InternalServerError,
		ServiceUnavailableError,
		RequestTimedOutError
}

/**
 * Get the error code from an Axios error.
 * @param error
 * @returns {ApiErrorCodes | undefined}
 */
export const getErrorCode = (error: AxiosError): ApiErrorCodes | undefined => {
		if (error.response?.status) {
				if (error.response.status in ApiErrorCodes) {
						return error.response.status as ApiErrorCodes;
				}
		}
		return undefined;
}

export const getErrorFromResponse = (error: AxiosError): Error => {
		const errorCode = getErrorCode(error);
		if (errorCode) {
				return getErrorFromCode(errorCode);
		}
		return new Error(error.message);
}

export const handleError = (error: unknown): Error => {
		if (error instanceof AxiosError) {
				return getErrorFromResponse(error);
		}
		if (error instanceof Error) {
				return error;
		}
		return new Error('Unknown error.');
}

export const getErrorFromCode = (code: ApiErrorCodes): Error => {
		switch (code) {
				case ApiErrorCodes.Unauthorized:
						return new UnauthorizedError();
				case ApiErrorCodes.NotFound:
						return new NotFoundError();
				case ApiErrorCodes.UnprocessableEntity:
						return new UnprocessableEntityError();
				case ApiErrorCodes.InternalServerError:
						return new InternalServerError();
				case ApiErrorCodes.ServiceUnavailable:
						return new ServiceUnavailableError();
				case ApiErrorCodes.RequestTimedOut:
						return new RequestTimedOutError();
		}
		return new Error(`Unknown error code: ${code}`);
}
