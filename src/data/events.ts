export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  location: string;
  details: {
    time: string;
    organizer: string;
    capacity: number;
    price: string;
    registrationLink: string;
    fullDescription: string;
  };
}

export const events: Event[] = [
  {
    id: 'ucla-vs-usc-startup-wars',
    title: 'UCLA vs USC Startup Wars',
    description: 'Join us for an epic coding competition between UCLA and USC startup clubs, featuring innovative projects, networking opportunities, and exciting prizes.',
    date: 'May 15, 2024',
    image: '/images/events/startup-wars.jpg',
    location: 'UCLA Anderson School of Management',
    details: {
      time: '10:00 AM - 6:00 PM',
      organizer: 'UCLA Entrepreneurship Club',
      capacity: 200,
      price: 'Free',
      registrationLink: 'https://example.com/register/startup-wars',
      fullDescription: 'The annual UCLA vs USC Startup Wars brings together the brightest minds from both universities for a day of innovation and competition. Teams will work on real-world problems, pitch their solutions to industry experts, and compete for prizes and recognition. This event is open to all students interested in entrepreneurship and technology.'
    }
  },
  {
    id: 'networking-event-consultants',
    title: 'Networking Event for Consultants',
    description: 'A rooftop mixer where UCLA consulting clubs gather to exchange contacts, share experiences, and build professional relationships in the consulting industry.',
    date: 'May 20, 2024',
    image: '/images/events/consulting-mixer.jpg',
    location: 'UCLA Luskin Conference Center',
    details: {
      time: '6:00 PM - 9:00 PM',
      organizer: 'UCLA Consulting Club',
      capacity: 100,
      price: '$20',
      registrationLink: 'https://example.com/register/consulting-mixer',
      fullDescription: 'Join us for an exclusive networking event with professionals from top consulting firms. This rooftop mixer provides a unique opportunity to connect with industry leaders, learn about consulting careers, and expand your professional network. Light refreshments will be served.'
    }
  },
  {
    id: 'accounting-career-fair',
    title: 'Accounting Career Fair at UCLA',
    description: 'Connect with representatives from top accounting firms and explore career opportunities in accounting, finance, and related fields.',
    date: 'May 25, 2024',
    image: '/images/events/accounting-fair.jpg',
    location: 'UCLA Ackerman Grand Ballroom',
    details: {
      time: '11:00 AM - 3:00 PM',
      organizer: 'UCLA Accounting Society',
      capacity: 300,
      price: 'Free',
      registrationLink: 'https://example.com/register/accounting-fair',
      fullDescription: 'The annual Accounting Career Fair brings together students and representatives from leading accounting firms. This is your chance to learn about internship and full-time opportunities, network with professionals, and get your resume reviewed. Business casual attire required.'
    }
  }
]; 