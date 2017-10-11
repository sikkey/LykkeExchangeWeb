import {RestApi} from '.';
import {ApiResponse} from './types';

export interface BalanceApi {
  fetchAll: () => ApiResponse<any>;
  fetchById: (assetId: string) => ApiResponse<any>;
}

export class RestBalanceApi extends RestApi implements BalanceApi {
  fetchAll = () =>
    this.wretch
      .url('/client/balances')
      .get()
      .json();

  fetchById = (assetId: string) =>
    this.wretch
      .url('/client/balances/${assetId}')
      .get()
      .json();
}

export default RestBalanceApi;