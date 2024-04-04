//Backend Token:   ARDMCLXB91K6PF9WVXDW3EHU23UH2EEP86C5COAE

const STORAGE_TOKEN = 'ARDMCLXB91K6PF9WVXDW3EHU23UH2EEP86C5COAE';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Save the data in the backend
 * 
 * @param {string} key - key for thge storage, like 'allTasks'
 * @param {json} value - value of the Json oar arry
 * @returns 
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}
/**
 * load the data from the backend
 * 
 * @param {string} key - key for the load, like 'allTasks'
 * @param {json} value - value of the Json oar arry
 * @returns 
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}