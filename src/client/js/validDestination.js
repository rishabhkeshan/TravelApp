function RegexCheck(dest) {
  let RGEX = /^[a-zA-Z\s]{0,255}$/;
  if (RGEX.test(dest)) {
    return true;
  } else {
    return false;
  }
}

export { RegexCheck }