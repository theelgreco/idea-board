export default function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        if (ms) {
            setTimeout(resolve, ms);
        } else {
            resolve();
        }
    });
}
