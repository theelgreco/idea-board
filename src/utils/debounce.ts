import type { Func, Wait } from "Debounce";

export default function debounce(func: Func, wait: Wait) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (...args: unknown[]) {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
