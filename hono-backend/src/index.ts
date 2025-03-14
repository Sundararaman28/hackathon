import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/serve-static'
import { registerTeam, getTeams, downloadExcel } from '../controller/main'

const app = new Hono()

// Middlewares
app.use('*', cors())

// Routes
app.get('/', (c) => c.text('Hackathon API'))
app.post('/api/teams/register', registerTeam)
app.get('/api/teams', getTeams)
app.get('/api/teams/excel', downloadExcel)

export default app
