import { API_KEY } from '../keys.json'; // chave para acesso à api do pickpoint

function treatLocal(str) {
  if (!str) return null;
  let res = str.replace(/[\u0021-\u002F]/g, "-");
  res = res.replace(/\s/g, "");
  return res;
}

async function getLatLon(query) {
  try {
    let res = await fetch(`https://api.pickpoint.io/v1/forward/?key=${API_KEY}&q=${treatLocal(query)}&limit=1&format=json`);
    
    if (res.status >= 200 && res.status < 300) {
      res = res.json()
      return Promise.resolve(res);
    } else
      return Promise.reject(res.statusText);
      
  } catch(e) {
    console.log(e);
    return Promise.reject();
  }
}

export { getLatLon }
