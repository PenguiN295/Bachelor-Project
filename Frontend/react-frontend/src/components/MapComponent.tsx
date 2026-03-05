import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import { useMapData } from "../hooks/useMapData";
import LoadingState from "./LoadingState";
import { MapPicker } from "./MapPicker";
import { useEffect } from "react";

interface MapProps {
    position: { lat: number, lng: number };
    readOnly?: boolean;
    onPositionChange?: (pos: { lat: number; lng: number, city: string, county: string }, ) => void;
}

const MapComponent: React.FC<MapProps> = ({ position,readOnly,onPositionChange }) => {
    const { getAdress: addressData, isLoading } = useMapData(position);
    useEffect(() => {
        if (addressData && onPositionChange) {
            onPositionChange({
                lat: position.lat,
                lng: position.lng,
                city: addressData.city,
                county: addressData.county || addressData.principalSubdivision
            });
        }
    }, [addressData]);

    return (
        <div>
            {isLoading ? <LoadingState /> : (
                <div>
                    <div className="info-panel">
                        Location: {addressData ? `${addressData.city}, ${addressData.principalSubdivision}` : 'Loading...'}
                    </div>
                    <MapContainer center={position} zoom={13} style={{ height: '300px' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker position={position} />
                        {!readOnly && onPositionChange && (
                            <MapPicker onLocationSelect={(lat, lng) => onPositionChange({ lat, lng, city: addressData?.city || '', county: addressData?.county || addressData?.principalSubdivision || '' })} />
                        )}
                    </MapContainer>
                </div>
            )}
        </div>
    );
}

export default MapComponent