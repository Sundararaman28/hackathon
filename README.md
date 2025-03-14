# Hackathon25 API

Backend API for team registration and management.

## Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables in wrangler.toml
# Required variables:
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - TWILIO_WHATSAPP_NUMBER
# - SMTP_USERNAME
# - SMTP_PASSWORD
# - SMTP_HOST
# - SMTP_PORT

# Initialize database
wrangler d1 execute hackathon25 --local --file=./schema.sql

# Run development server
pnpm run dev

# Deploy
pnpm run deploy
```

## API Endpoints

### Register Team
`POST https://hono-backend.hackathon25.workers.dev/api/teams/register`

Register a new team for the hackathon.

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "teamName": "Code Ninjas",
    "githubProfile": "johndoe",
    "repoName": "hackathon-project",
    "whatsapp": "919876543210",
    "teammate1": "Jane Smith",
    "teammate1Github": "janesmith",
    "teammate2": "Bob Wilson",
    "teammate2Github": "bobwilson",
    "teammate3": "Alice Brown",
    "teammate3Github": "alicebrown"
}
```

**Response:**
```json
{
    "message": "Team registered successfully",
    "teamId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Get All Teams
`GET https://hono-backend.hackathon25.workers.dev/api/teams`

Retrieve list of all registered teams.

**Response:**
```json
[
    {
        "team_id": "550e8400-e29b-41d4-a716-446655440000",
        "team_name": "Code Ninjas",
        "github_profile": "johndoe",
        "repo_name": "hackathon-project",
        "email": "john@example.com",
        "whatsapp_number": "919876543210",
        "member_names": "John Doe,Jane Smith,Bob Wilson,Alice Brown",
        "member_githubs": "johndoe,janesmith,bobwilson,alicebrown"
    }
]
```

### Download Teams Excel
`GET https://hono-backend.hackathon25.workers.dev/api/teams/excel`

Download team details in Excel format.

**Response:** Excel file with team and member details

## Features

- Team registration with member details
- WhatsApp confirmation via Twilio
- Email confirmation
- Excel export of team data
- D1 database integration
- Input validation
- CORS support

## Environment Variables

| Variable | Description |
|----------|-------------|
| TWILIO_ACCOUNT_SID | Twilio Account SID |
| TWILIO_AUTH_TOKEN | Twilio Auth Token |
| TWILIO_WHATSAPP_NUMBER | Twilio WhatsApp Number |
| SMTP_USERNAME | SMTP Username |
| SMTP_PASSWORD | SMTP Password |
| SMTP_HOST | SMTP Host |
| SMTP_PORT | SMTP Port |

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 500: Server Error

Error responses include a message explaining the error:
```json
{
    "message": "Error description"
}
```
