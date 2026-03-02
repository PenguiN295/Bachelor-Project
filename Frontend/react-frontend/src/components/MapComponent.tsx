import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { useMapData } from "../hooks/useMapData";
import LoadingState from "./LoadingState";
import { MapPicker } from "./MapPicker";

interface MapProps {
    id: string;
    position: { lat: number, lng: number };
    readOnly?: boolean;
    onPositionChange?: (pos: { lat: number; lng: number }) => void;
}

const MapComponent: React.FC<MapProps> = ({ id, position,readOnly,onPositionChange }) => {
    const { getAdress: addressData, isLoading } = useMapData(id, position);

    return (
        <div>
            {isLoading ? <LoadingState /> : (
                <div>
                    <div className="info-panel">
                        Location: {addressData ? `${addressData.city}, ${addressData.principalSubdivision}` : 'Loading...'}
                    </div>
                    <MapContainer center={position} zoom={13} style={{ height: '400px' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker position={position} />
                        {!readOnly && onPositionChange && (
                            <MapPicker onLocationSelect={(lat, lng) => onPositionChange({ lat, lng })} />
                        )}
                    </MapContainer>
                </div>
            )}
        </div>
    );
}

export default MapComponent