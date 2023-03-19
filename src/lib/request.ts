import { get } from 'svelte/store'
import { authData } from '$lib/store';


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
    DELETE = 'DELETE',
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

export async function httpRequest<T>(
	method: HttpMethod,
	url: string,
	body?: Record<string, string | number | boolean>,
	queryParams?: QueryParams,
	headers?: Headers
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
	headers?: Headers
): Promise<T> {
    const requestHeaders = {...headers};
    const authenticationData = get(authData);
    if (typeof authenticationData.token != 'string' || authenticationData.token == ""){
		throw new Error(`Invalid Token: ${authenticationData.token}`);
    }

    requestHeaders["Authorization"] = `BEARER ${authenticationData.token}`
    return httpRequest(method, url, body, queryParams, requestHeaders)
}


export function defaultHttpRequest<T>(
	method: HttpMethod,
	url: string,
	body?: Record<string, string | number | boolean>,
	queryParams?: QueryParams,
	headers?: Headers
): Promise<T>   {
	return httpRequest(method, url, body, queryParams, headers)
}
