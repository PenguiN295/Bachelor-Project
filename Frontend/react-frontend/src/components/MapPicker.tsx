import { useMapEvents } from 'react-leaflet';

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export const MapPicker = ({ onLocationSelect }: MapPickerProps) => {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            map.flyTo(e.latlng, map.getZoom());
            onLocationSelect(lat, lng);
        },
    });
    return null; 
};