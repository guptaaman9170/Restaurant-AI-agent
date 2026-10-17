# DineScout AI

DineScout AI is an agentic restaurant research and recommendation system designed for travellers visiting European cities.

The agent takes a natural-language restaurant request and researches restaurants based on the user's preferences such as:

- City
- Meal type
- Cuisine
- Dietary preferences
- Budget
- Atmosphere
- Dining context

## How It Works

The system uses a LangGraph-based research pipeline:

User Query
    ↓
Intent Understanding
    ↓
Restaurant Discovery
    ↓
Restaurant Shortlisting
    ↓
Menu Research
    ↓
Review Research
    ↓
Restaurant Scoring
    ↓
Final Recommendations

Each stage contributes structured information to the final recommendation.

## Agent Architecture

### 1. Intent

Extracts the user's restaurant preferences from the natural-language request.

### 2. Discovery

Searches for restaurant candidates based on the user's city, cuisine, dietary preferences and meal type.

### 3. Shortlisting

Uses structured LLM output to normalize restaurant entities, remove duplicates and create a shortlist.

### 4. Menu Research

Searches for restaurant menus and extracts menu items, prices, dietary tags and supporting URLs.

### 5. Review Research

Searches restaurant review sources and analyzes:

- Overall sentiment
- Atmosphere
- Quietness
- Service
- Food quality
- Vegetarian friendliness
- Positive and negative signals

### 6. Recommendation

Restaurants are scored using a deterministic scoring system.

The current weighted score considers:

- Budget compatibility: 25%
- Dietary compatibility: 25%
- Cuisine match: 20%
- Quietness / atmosphere: 15%
- Menu availability: 10%
- Evidence quality: 5%

The LLM is then used to explain the already-calculated ranking without changing it.

## Live Research Progress

The frontend receives research progress events while the agent is running.

The user can see stages such as:

- Understanding preferences
- Searching for restaurants
- Comparing candidates
- Reading menus
- Analyzing reviews
- Ranking the shortlist
- Preparing recommendations

Completion timestamps are displayed for completed research stages.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Nginx (Production reverse proxy & static asset server)

### Backend
- Node.js
- Express
- MongoDB
- LangGraph
- LangChain

### AI
- Google Gemini
- Structured LLM output using Zod schemas

### Research
- Web search tools for restaurant discovery
- Menu research
- Review research

### Containerization & DevOps
- Docker & Docker Compose
- Multi-stage builds
- Nginx reverse proxy with SSE streaming support
- Built-in container health checks

---

## 🐳 Docker Deployment & Quickstart

The entire DineScout AI platform is fully containerized with Docker and Docker Compose, including the React frontend (served via Nginx), Express backend, and MongoDB database.

### 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/) (v2+)

### 2. Configure Environment Variables
Copy the root `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your API credentials:
```env
GEMINI_API_KEY=your_google_gemini_api_key
SEARCH_API_KEY=your_search_api_key
```

### 3. Start the Full Application Stack
Run the following command to build and launch all containers in detached mode:
```bash
docker compose up --build -d
```

### 4. Access the Application
- **Frontend Web UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MongoDB**: `localhost:27017`

### 5. Managing the Containers
- **View live logs**:
  ```bash
  docker compose logs -f
  ```
- **View backend logs specifically**:
  ```bash
  docker compose logs -f server
  ```
- **Stop containers**:
  ```bash
  docker compose down
  ```
- **Stop containers and reset database volume**:
  ```bash
  docker compose down -v
  ```

### 6. Development Mode with Docker (Live Reload)
To run containers with source code volume mounts and hot-reloading enabled:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

---

## 🛠️ Local Development (Without Docker)

### Backend Setup
```bash
cd server
cp .env.example .env
# Edit server/.env with your GEMINI_API_KEY, SEARCH_API_KEY, and MONGODB_URI
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Visit `http://localhost:5173` to test the frontend with Vite dev server.

## Limitations

1. Restaurant search quality depends on the availability and quality of external web search results.

2. Menu information may be incomplete or outdated when restaurants do not publish their menus online.

3. Review analysis is based only on the sources returned by the research tools and may not represent every customer experience.

4. Prices may vary over time and may not include taxes, service charges or special menu conditions.

5. The current version does not use the user's physical GPS location. The city must currently be inferred from or provided in the request.

6. Menu translation is not currently implemented as a dedicated translation stage. Menu information is extracted from the available research sources and presented in the application's normalized format.

7. The system does not perform real-time restaurant reservation or table availability checks.

8. External search and LLM API rate limits can affect research availability and response time.

## Assumptions

1. The restaurant search results contain sufficiently reliable information to identify real restaurants.

2. Restaurant names and city information are sufficient to associate menu and review research with the correct restaurant.

3. Search result URLs are treated as supporting evidence for extracted information.

4. When information cannot be verified, the system attempts to represent it as unavailable rather than inventing data.

5. The recommendation score is deterministic once the researched restaurant, menu and review data are available.

## Future Improvements

- Browser-based GPS / "near me" support
- Dedicated menu translation pipeline
- More review-source diversity
- Real-time restaurant availability
- Restaurant reservation integration
- Persistent user preferences
- Improved evidence/source quality scoring
- Caching of expensive research operations