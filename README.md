# PlayPals - Music & Friends

PlayPals is a social music streaming platform that combines the joy of music discovery with the power of social connections. Share your favorite tunes, connect with friends, and explore new music together.

## Features

- Seamless music streaming integration with Spotify API
- Social networking capabilities for music lovers
- Direct music sharing with friends
- User profiles with music preferences and listening history
- Collaborative playlists
- Music recommendation system based on friends' tastes
- Real-time chat and comments on shared music
- Responsive design for desktop and mobile devices
- Trending songs and personalized music discovery

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- Real-time Features: Socket.io
- API Integration: Spotify Web API
- Hosting: [Your chosen hosting platform, e.g., Netlify, Heroku, AWS, etc.]

## Project Structure

- `/client`: Frontend code (HTML, CSS, JavaScript)
- `/server`: Backend Node.js/Express code
- `/database`: Database schemas and models
- `/config`: Configuration files
- `/api`: API route handlers
- `/services`: Business logic and third-party service integrations
- `/utils`: Utility functions and helpers

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/ayushmaninbox/playpals.git
   cd playpals
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     SPOTIFY_CLIENT_ID=your_spotify_client_id
     SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser

## Usage

1. Sign up for a PlayPals account or log in
2. Connect your Spotify account to enable music playback
3. Explore trending songs and discover new music
4. Search for and add friends
5. Share songs directly with friends or to your profile
6. Create and collaborate on playlists
7. Chat with friends about shared music
8. Customize your profile and music preferences

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Happy music sharing with PlayPals! 🎵👥