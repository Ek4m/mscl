import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseQueryFn } from '@reduxjs/toolkit/query';

import { ACCESS_TOKEN, API_BASE_URL } from '../constants/vault';
import { urlFactory } from '../helpers/urlFactory';

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: 'get' | 'post' | 'put' | 'delete' | 'patch';
      data?: any;
      params?: Record<string, any>;
      headers?: Record<string, string>;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
    try {
      console.log("____API_URL_____",API_BASE_URL + url);
      console.log("__ACCESS_TOKEN",accessToken)
      const result = await axios({
        url: urlFactory(API_BASE_URL + url, params),
        method,
        data,
        headers: {
          ...headers,
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      });
      console.log("__RESULT",result)
      return { data: result.data.data };
    } catch (err) {
      console.log("___ERROR",err)
      const axiosError = err as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export default axiosBaseQuery;
