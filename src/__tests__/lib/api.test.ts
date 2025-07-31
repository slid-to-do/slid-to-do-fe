import axios, {AxiosHeaders} from 'axios'

import {del, get, patch, post} from '../../lib/api'

import type {AxiosResponse} from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

/** get통신 testcode */
describe('get 통신 성공', () => {
    test('json 리턴', async () => {
        const mockReponse: AxiosResponse = {
            data: {data: {message: 'get 성공'}, message: 'get 성공'},
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new AxiosHeaders(),
                url: '/test',
                method: 'get',
            },
        }

        mockedAxios.request.mockResolvedValue(mockReponse)

        const response = await get<{message: string}>({endpoint: '/test'})
        expect(response.data.message).toBe('get 성공')
    })
})

/** post통신 testcode */
describe('post 통신 성공', () => {
    test('json 리턴', async () => {
        const mockResponse: AxiosResponse = {
            data: {data: {message: 'post 성공'}, message: 'post 성공'},
            status: 201,
            statusText: 'Created',
            headers: {},
            config: {
                headers: new AxiosHeaders(),
                url: '/test',
                method: 'post',
            },
        }

        mockedAxios.request.mockResolvedValue(mockResponse)

        const response = await post<{message: string}>({endpoint: '/test', data: {}})
        expect(response.data.message).toBe('post 성공')
    })
})

/** patch통신 testcode */
describe('patch 통신 성공', () => {
    test('json 리턴', async () => {
        const mockResponse: AxiosResponse = {
            data: {data: {message: 'patch 성공'}, message: 'patch 성공'},
            status: 202,
            statusText: 'Accepted',
            headers: {},
            config: {
                headers: new AxiosHeaders(),
                url: '/test',
                method: 'patch',
            },
        }

        mockedAxios.request.mockResolvedValue(mockResponse)

        const response = await patch<{message: string}>({endpoint: '/test', data: {}})
        expect(response.data.message).toBe('patch 성공')
    })
})

/** delete통신 testcode */
describe('delete 통신 성공', () => {
    test('204 응답 반환', async () => {
        const mockResponse: AxiosResponse = {
            data: {message: '삭제됨'},
            status: 204,
            statusText: 'No Content',
            headers: {},
            config: {
                headers: new AxiosHeaders(),
                url: '/test',
                method: 'delete',
            },
        }

        mockedAxios.request.mockResolvedValue(mockResponse)

        const spy = jest.spyOn(axios, 'request')
        await del({endpoint: '/test'}) 
        expect(spy).toHaveBeenCalled()
    })
})
