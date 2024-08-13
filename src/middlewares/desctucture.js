function reconstructDetails(details) {
    const result = {};
    for (const key in details) {
        const parts = key.split('[').map(part => part.replace(']', ''));
        let current = result;
        while (parts.length > 1) {
            const part = parts.shift();
            if (!current[part]) {
                current[part] = isNaN(parts[0]) ? {} : [];
            }
            current = current[part];
        }
        current[parts[0]] = details[key];
    }
    return result;
}

module.exports = { reconstructDetails }
