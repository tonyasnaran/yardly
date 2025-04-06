declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  interface MapOptions {
    center: LatLngLiteral;
    zoom: number;
    styles?: Array<MapTypeStyle>;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers: Array<{ [key: string]: string | number | boolean }>;
  }

  interface MarkerOptions {
    position: LatLngLiteral;
    map: Map;
    title?: string;
    icon?: Symbol | string;
  }

  interface InfoWindowOptions {
    content: string | Node;
    position?: LatLngLiteral;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface Symbol {
    path: SymbolPath;
    scale: number;
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeWeight: number;
  }

  enum SymbolPath {
    CIRCLE = 0,
  }
}

export {};

declare namespace JSX {
  interface IntrinsicElements {
    'gmp-place-autocomplete': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        placeholder?: string;
        onPlaceSelect?: (e: CustomEvent<google.maps.places.PlaceResult>) => void;
      },
      HTMLElement
    >;
  }
} 