/**
 * A function that looks for the provided key in localStorage and either returns the stored value if it exists, or sets the provided `value` on that key.
 * @param key the key to lookup in localStorage
 * @param value the data to store on the key if it doesn't already exist
 * @returns The data in localStorage if the key already exists, else `value`
 */
export function localStorageGetOrCreate(key: string, value: string): string {
    const data = localStorage.getItem(key);

    if (data === null) {
        localStorage.setItem(key, value);
        return value;
    }

    return data;
}
