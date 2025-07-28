import type { Func, Wait } from "Throttle";

export default function throttle(func: Func, wait: Wait) {
    const timeout: ReturnType<typeof setTimeout> | null = null;
    let lastExecuted = 0;

    return function (...args: unknown[]) {
        const now = performance.now();

        if (timeout) {
            clearTimeout(timeout);
        }

        if (!lastExecuted || now - lastExecuted >= wait) {
            func(...args);
            lastExecuted = now;
        }
    };
}
