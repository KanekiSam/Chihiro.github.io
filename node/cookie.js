module.exports = {
  setCookie: (name, value) => {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    window.document.cookie =
      name + '=' + escape(value) + ';expires=' + exp.toGMTString();
  },
  getCookie: name => {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

    if ((arr = window.document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  },
  delCookie: name => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      window.document.cookie =
        name + '=' + cval + ';expires=' + exp.toGMTString();
  },
};
