/**
 * 路径匹配器
 * @param {string} pattern
 * @param {string} path
 * @returns
 */
export function isPathMatch(pattern, path) {
  const regexPattern = pattern
    .replace(/([.+^${}()|\[\]\\])/g, '\\$1')
    .replace(/\*\*/g, '__DOUBLE_STAR__')
    .replace(/\*/g, '[^/]*')
    .replace(/__DOUBLE_STAR__/g, '.*')
    .replace(/\?/g, '[^/]')
  return new RegExp(`^${regexPattern}$`).test(path)
}

/**
 * 判断url是否是http或https
 * @param {string} url
 * @returns
 */
export function isHttp(url) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

export function isEmpty(value) {
  if (value == null || value == '' || value == undefined || value == 'undefined') {
    return true
  }
  return false
}
