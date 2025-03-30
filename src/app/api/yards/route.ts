import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const yards = [
  {
    id: 1,
    title: "Cozy Backyard Garden",
    city: "New York",
    price: 50,
    guests: 10,
    image: "https://source.unsplash.com/random/400x300/?garden",
    amenities: ["grill", "firepit", "pool"],
    description: "A peaceful garden space perfect for intimate gatherings and outdoor dining. Features include a modern grill, cozy fire pit, and ambient lighting throughout the space.",
    rating: 4.8,
    reviews: 24,
    nearbyAttractions: ["Central Park", "Times Square", "Empire State Building"]
  },
  {
    id: 2,
    title: "Luxury Poolside Retreat",
    city: "Los Angeles",
    price: 75,
    guests: 15,
    image: "https://source.unsplash.com/random/400x300/?pool",
    amenities: ["pool", "hottub", "outdoor_kitchen"],
    description: "A stunning outdoor space featuring a large pool, hot tub, and fully equipped outdoor kitchen. Perfect for summer gatherings and pool parties.",
    rating: 4.9,
    reviews: 31,
    nearbyAttractions: ["Hollywood Sign", "Griffith Observatory", "Santa Monica Pier"]
  },
  {
    id: 3,
    title: "Urban Rooftop Oasis",
    city: "Chicago",
    price: 65,
    guests: 20,
    image: "https://source.unsplash.com/random/400x300/?rooftop",
    amenities: ["outdoor_kitchen", "firepit", "playground"],
    description: "A modern rooftop space with panoramic city views. Features a fully equipped outdoor kitchen, cozy fire pit, and a small playground area for kids. Perfect for corporate events and family gatherings.",
    rating: 4.7,
    reviews: 18,
    nearbyAttractions: ["Millennium Park", "Navy Pier", "Art Institute of Chicago"]
  },
  {
    id: 4,
    title: "Beachfront Paradise",
    city: "Miami",
    price: 90,
    guests: 25,
    image: "https://source.unsplash.com/random/400x300/?beach",
    amenities: ["pool", "grill", "playground"],
    description: "A beautiful beachfront property with direct access to the ocean. Features a large pool, outdoor grill, and a playground. Perfect for beach parties and family gatherings.",
    rating: 4.9,
    reviews: 42,
    nearbyAttractions: ["South Beach", "Miami Beach", "Lincoln Road"]
  },
  {
    id: 5,
    title: "Mountain View Retreat",
    city: "Denver",
    price: 55,
    guests: 12,
    image: "https://source.unsplash.com/random/400x300/?mountain",
    amenities: ["firepit", "grill", "hottub"],
    description: "A serene mountain-view space perfect for nature lovers. Features a cozy fire pit, outdoor grill, and hot tub. Ideal for stargazing and outdoor gatherings.",
    rating: 4.8,
    reviews: 28,
    nearbyAttractions: ["Red Rocks Park", "Denver Botanic Gardens", "Mount Evans"]
  },
  {
    id: 6,
    title: "Desert Oasis",
    city: "Phoenix",
    price: 60,
    guests: 15,
    image: "https://source.unsplash.com/random/400x300/?desert",
    amenities: ["pool", "outdoor_kitchen", "firepit"],
    description: "A beautiful desert landscape with modern amenities. Features a large pool, fully equipped outdoor kitchen, and fire pit. Perfect for winter gatherings and outdoor dining.",
    rating: 4.7,
    reviews: 35,
    nearbyAttractions: ["Desert Botanical Garden", "Camelback Mountain", "Phoenix Zoo"]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const guests = searchParams.get('guests');
    const amenities = searchParams.get('amenities');

    // Filter yards based on search parameters
    let filteredYards = [...yards];

    if (city) {
      filteredYards = filteredYards.filter(yard => 
        yard.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (guests) {
      const guestCount = parseInt(guests);
      if (!isNaN(guestCount)) {
        filteredYards = filteredYards.filter(yard => 
          yard.guests >= guestCount
        );
      }
    }

    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim().toLowerCase());
      filteredYards = filteredYards.filter(yard => 
        yard.amenities.some(amenity => 
          amenityList.includes(amenity.toLowerCase())
        )
      );
    }

    return NextResponse.json({
      yards: filteredYards,
      total: filteredYards.length,
      filters: {
        city: city || undefined,
        guests: guests ? parseInt(guests) : undefined,
        amenities: amenities ? amenities.split(',').map(a => a.trim()) : undefined
      }
    });
  } catch (error) {
    console.error('Error fetching yards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
