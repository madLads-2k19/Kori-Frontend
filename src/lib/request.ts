import { get } from 'svelte/store';
import { authData } from '$lib/store';
import { notifications } from '$lib/components/notification';

export interface QueryParams {
	[key: string]: string | number | boolean | Array<string | number | boolean>;
}

export interface Headers {
	[key: string]: string;
}

export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

function convertQueryParams(params: QueryParams): string[][] {
	const result: string[][] = [];
	for (const [key, value] of Object.entries(params)) {
		if (Array.isArray(value)) {
			value.map((val) => result.push([key, String(val)]));
		} else {
			result.push([key, String(value)]);
		}
	}
	return result;
}

function defaultClientErrorHandler(response: Response) {
	response.json().then((body) => notifications.warning(body['detail'], 3000));
}

function defaultServerErrorHandler(response: Response) {
	notifications.warning('Something went brrrr', 3000);
}

export async function httpRequest<T>(
	method: HttpMethod,
	url: string,
	body?: Record<string, string | number | boolean>,
	queryParams?: QueryParams,
	headers?: Headers,
	clientErrorHandler: (resp: Response) => any = defaultClientErrorHandler,
	serverErrorHandler: (resp: Response) => any = defaultServerErrorHandler
): Promise<T> {
	const convertedParams = queryParams ? convertQueryParams(queryParams) : undefined;
	const searchParams = new URLSearchParams(convertedParams);

	const requestOptions: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers
		},
		body: body ? JSON.stringify(body) : undefined
	};

	const response = await fetch(`${url}?${searchParams}`, requestOptions);

	if (!response.ok) {
		// Client Side errors
		if ([400, 401, 403, 404, 409].includes(response.status)) {
			clientErrorHandler(response);
		} else if (response.status >= 500) {
			serverErrorHandler(response);
			console.error(response);
		} else {
			console.error(response);
		}
		throw new Error(`HTTP error ${response.status}`);
	}

	const responseBody: T = await response.json();
	return responseBody;
}

export function authenticatedHttpRequest<T>(
	method: HttpMethod,
	url: string,
	body?: Record<string, string | number | boolean>,
	queryParams?: QueryParams,
	headers?: Headers,
	clientErrorHandler: (resp: Response) => any = defaultClientErrorHandler,
	serverErrorHandler: (resp: Response) => any = defaultServerErrorHandler
): Promise<T> {
	const requestHeaders = { ...headers };
	const authenticationData = get(authData);
	if (typeof authenticationData.token != 'string' || authenticationData.token == '') {
		throw new Error(`Invalid Token: ${authenticationData.token}`);
	}

	requestHeaders['Authorization'] = `Bearer ${authenticationData.token}`;
	return httpRequest(
		method,
		url,
		body,
		queryParams,
		requestHeaders,
		clientErrorHandler,
		serverErrorHandler
	);
}

export function defaultHttpRequest<T>(
	method: HttpMethod,
	url: string,
	body?: Record<string, string | number | boolean>,
	queryParams?: QueryParams,
	headers?: Headers,
	clientErrorHandler: (resp: Response) => any = defaultClientErrorHandler,
	serverErrorHandler: (resp: Response) => any = defaultServerErrorHandler
): Promise<T> {
	return httpRequest(
		method,
		url,
		body,
		queryParams,
		headers,
		clientErrorHandler,
		serverErrorHandler
	);
}
