/**
 * 规范路径，避免//等不规范路径
 * @param {String} path
 * @returns
 */
export function getNormalPath(path) {
  if (path.length === 0 || !path || path == 'undefined') {
    return path
  }
  let res = path.replace('//', '/')
  if (res[res.length - 1] == '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}
