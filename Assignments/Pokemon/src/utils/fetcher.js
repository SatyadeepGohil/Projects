// simple fetch helper function for useSwr
export const fetcher = (url) => fetch(url).then(res => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
});