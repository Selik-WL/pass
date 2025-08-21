
export default class Settings{

    static debug() {
        return (import.meta.env.VITE_LOGGING === 'true');
    }

    static api() {
        return import.meta.env.VITE_API_URL;
    }
}