# Yardly

Yardly is a modern platform for discovering and booking unique outdoor spaces for events and gatherings. Think of it as "Airbnb for yards" - connecting people who need outdoor space with those who have beautiful yards to share.

## Features

- 🌟 Modern, responsive UI built with Next.js 14 and Material-UI
- 🗺️ Interactive map integration with Google Maps
- 🔐 Secure authentication with Google OAuth
- 🎯 Real-time updates using Supabase
- 📱 Mobile-friendly design
- ❤️ Favorite yards functionality
- 🔍 Advanced search and filtering
- 📊 Admin dashboard for yard management

## Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - Material-UI (MUI)
  - TypeScript
  - Google Maps API

- **Backend:**
  - Supabase (Database & Authentication)
  - PostgreSQL
  - Row Level Security (RLS)

- **Deployment:**
  - Vercel (Frontend)
  - Supabase (Backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud account (for Maps and OAuth)

### Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yardly.git
cd yardly
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new Supabase project
2. Run the migrations in the `supabase/migrations` folder
3. Set up the required tables:
   - yards
   - favorites
   - user_roles

## Features in Detail

### Yard Listings
- Browse available yards
- View detailed information
- See yard locations on the map
- Filter by guest capacity and amenities

### User Features
- Google authentication
- Save favorite yards
- Book yards for events
- View booking history

### Admin Features
- Manage yard listings
- View and manage bookings
- User role management
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- Material-UI team for the component library
- All contributors who have helped shape this project

## Contact

For any questions or concerns, please open an issue in the repository. 