import { describe, it, expect } from 'vitest'
import { registerTeam, getTeams } from '../controller/main'
import { createMockContext } from './utils'

describe('Team Registration API', () => {
    it('should register a new team successfully', async () => {
        const mockData = {
            name: "John Doe",
            email: "john@example.com",
            teamName: "Test Team",
            githubProfile: "johndoe",
            repoName: "test-repo",
            whatsapp: "919876543210"
        };

        const ctx = createMockContext(mockData);
        const response = await registerTeam(ctx);
        const data: { message: string; teamId?: string } = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe('Team registered successfully');
        expect(data.teamId).toBeDefined();
    });

    it('should return teams list', async () => {
        const ctx = createMockContext();
        const response = await getTeams(ctx);
        const data: { message: string } = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
    });

    it('should handle invalid team registration data', async () => {
        const mockData = {
            name: "John Doe",
            // Missing required fields
        };

        const ctx = createMockContext(mockData);
        const response = await registerTeam(ctx);
        const data: { message: string } = await response.json();

        expect(response.status).toBe(500);
        expect(data.message).toBe('Server error');
    });
});
