import {computed, observable, reaction, runInAction} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {config} from '../config';
import {queryStringFromObject} from '../utils/authUtils';
import {StorageUtils} from '../utils/index';

const TOKEN_KEY = 'lww-token';
const OAUTH_KEY = 'lww-oauth';

const tokenStorage = StorageUtils.withKey(TOKEN_KEY);
const authStorage = StorageUtils.withKey(OAUTH_KEY);

// tslint:disable-next-line:no-var-requires
const shajs = require('sha.js');

export class AuthStore {
  readonly rootStore: RootStore;
  @observable token = tokenStorage.get();

  constructor(rootStore: RootStore, private api?: AuthApi) {
    this.rootStore = rootStore;
    reaction(
      () => this.token,
      token => {
        if (token) {
          tokenStorage.set(token);
        } else {
          tokenStorage.clear();
        }
      }
    );
  }

  login = (username: string, password: string) =>
    this.api!.login(
      username,
      shajs('sha256')
        .update(password)
        .digest('hex')
    );

  signup = async (username: string, password: string) =>
    this.api!.signup(
      username,
      shajs('sha256')
        .update(password)
        .digest('hex')
    );

  auth = async (code: string) => {
    const authContext = await this.fetchBearerToken(code);
    authStorage.set(JSON.stringify(authContext));
    const sessionToken = await this.fetchSessionToken();
    runInAction(() => {
      this.token = sessionToken.token;
    });
  };

  fetchSessionToken = () =>
    this.api!.fetchSessionToken(config.auth.client_id!, this.getAccessToken());

  fetchBearerToken = (code: string) =>
    this.api!.fetchBearerToken(config.auth, code, config.auth.apiUrls.token);

  getConnectUrl = () => {
    const {client_id, redirect_uri} = config.auth;
    const authorizePath = `${config.auth.apiUrls.auth}?${queryStringFromObject({
      client_id,
      redirect_uri,
      response_type: 'code',
      scope: config.auth.scope
    })}`;

    return `${config.auth.url}${authorizePath}`;
  };

  getLogoutUrl = () => `${config.auth.url}${config.auth.apiUrls.logout}`;

  logout = async () => {
    runInAction(() => {
      this.token = null;
      authStorage.clear();
      this.rootStore.reset();
    });
  };

  getAccessToken = () => {
    const authContext = authStorage.get();
    return authContext && JSON.parse(authContext).access_token;
  };

  @computed
  get isAuthenticated() {
    return !!this.token;
  }

  redirectToAuthServer = () => {
    tokenStorage.clear();
    location.replace(`//${location.hostname}:${location.port}/login`);
  };
}
