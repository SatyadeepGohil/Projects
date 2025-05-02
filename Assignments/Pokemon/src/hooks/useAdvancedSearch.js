export const useAdvancedSearch = ({ array, searchInput, advanceSearch, searchLogic, fuse }) => {
    // if there is nothing in the array then return it back empty as it was.
    if (array.length === 0) return [];

    let filtered = [...array];

    // search input is empty then return the array(filtered) back
    if (!searchInput?.trim()) array;

    // when advanceSearch is chosen
    if (advanceSearch) {
        const searchTerms = searchInput.toLowerCase().split(' ');

        // AND search logic
        if (searchLogic === 'AND') {
            return filtered.filter(item => 
                searchTerms.every(term => {
                    const results = fuse.search(term);
                    return results.some(result => result.item.id === item.id);
                })
            )
        } else {
            // OR search logic
            const matchedIds = new Set();
            searchTerms.forEach(term => {
                const results = fuse.search(term);
                results.forEach(result => matchedIds.add(result.item.id));
            });
            return filtered.filter(array => matchedIds.has(array.id));
        }
    } else {
        // else fall back to simple search
        return filtered.filter(item => 
            item.name.toLowerCase().includes(searchInput.toLowerCase())
        )
    }
}