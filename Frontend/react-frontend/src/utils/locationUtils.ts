interface UserLocation {
    latitude: number;
    longitude: number;
}

export const getUserLocation = async (): Promise<UserLocation | null> => {
    try {
        if ("geolocation" in navigator) {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });
            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        }
    } catch (error) {
        console.warn("Browser geolocation failed or denied, falling back to IP-based location.");
    }

    try {
        const response = await fetch('https://freeipapi.com/api/json');
        if (response.ok) {
            const data = await response.json();
            return {
                latitude: data.latitude,
                longitude: data.longitude
            };
        }
    } catch (error) {
        console.error("IP-based location fallback failed:", error);
    }

    return null;
};
