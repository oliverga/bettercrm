import { useEffect } from 'react';

export function useKeyboardEvent(key, callback) {
    useEffect(() => {
        const handler = (event) => {
            if (event.key === key) {
                callback(event);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [key, callback]);
}