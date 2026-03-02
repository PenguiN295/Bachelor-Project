import { Marker } from 'react-leaflet';

interface LocationMarkerProps {
  position: { lat: number; lng: number } | null;
}

const LocationMarker = ({ position }: LocationMarkerProps) => {
  return position === null ? null : <Marker position={position} />;
};

export default LocationMarker;
