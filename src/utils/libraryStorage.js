const LIBRARY_KEY = 'mute-library-items-v1';

export function getLibraryItems() {
    try {
        const raw = localStorage.getItem(LIBRARY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('getLibraryItems error:', error);
        return [];
    }
}

export function saveLibraryItems(items) {
    try {
        localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('saveLibraryItems error:', error);
    }
}

export function getLibraryItemById(id) {
    const items = getLibraryItems();
    return items.find((item) => String(item.id) === String(id)) || null;
}
