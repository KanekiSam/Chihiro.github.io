import Cookies from 'js-cookie';

const name = 'chihiro-my-blog';
/**
 * @name 获取token
 */
export function getToken() {
  return Cookies.get(name);
}
/**
 * @name 设置token
 * @param token
 */
export function setToken(token: string) {
  // // 获取域名
  // const parsed = psl.parse(document.domain);
  // // 判断是否是合法域名
  // if (parsed.listed) {
  //   Cookies.set('jhi-authenticationToken', token, {
  //     domain: `.${parsed.domain}`
  //   });
  // } else {
  //   Cookies.set('jhi-authenticationToken', token);
  // }
  Cookies.set(name, token);
}
/**
 * @name 清空token
 */
export function clearToken() {
  // // 获取域名
  // const parsed = psl.parse(document.domain);
  // // 判断是否是合法域名
  // if (parsed.listed) {
  //   Cookies.remove('jhi-authenticationToken', {
  //     domain: `.${parsed.domain}`
  //   });
  //   Cookies.remove('refreshToken', { domain: `.${parsed.domain}` });
  // }
  Cookies.remove(name);
}
