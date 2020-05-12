import { httpGet } from '../utils/request';
interface UserInfo {
  user: string;
}
type User = UserInfo | undefined;
export default {
  namespace: 'user',
  state: { userInfo: undefined as User },
  reducers: {
    setUser(state: { userInfo: User }, { payload }: { payload: User }) {
      state.userInfo = payload;
    },
  },
  effects: {
    *getUserInfo({}, { call, put }: any) {
      const { data, success } = yield call(() => httpGet('/user/get/info'));
      if (success) {
        yield put({ type: 'setUser', payload: data });
      }
    },
  },
};
