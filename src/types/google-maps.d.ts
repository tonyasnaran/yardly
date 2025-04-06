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