const _hoje = new Date();
const _data = _hoje.getFullYear() + "-" +
  String(_hoje.getMonth() + 1).padStart(2, "0") + "-" +
  String(_hoje.getDate()).padStart(2, "0");

  export function firebasehoje()
  {
    return _data;
  }