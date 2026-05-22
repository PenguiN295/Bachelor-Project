export const formatDate = (dateString: string | DateTimeOffset): string => {
    const date = new Date(dateString.toString());
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatDateTime = (dateString: string | DateTimeOffset): string => {
    const date = new Date(dateString.toString());
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
type DateTimeOffset = string; 
