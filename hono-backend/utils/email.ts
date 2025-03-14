import { WorkerMailer } from 'worker-mailer'

interface EmailConfig {
    username: string;
    password: string;
    host: string;
    port: number;
}

interface TeamEmailData {
    teamId: string;
    teamName: string;
    leaderName: string;
    leaderEmail: string;
    githubRepo: string;
    members: Array<{ name: string; github: string; }>;
}

export const sendRegistrationEmail = async (
    config: EmailConfig,
    teamData: TeamEmailData
): Promise<boolean> => {
    try {
        const mailer = await WorkerMailer.connect({
            credentials: {
                username: config.username,
                password: config.password,
            },
            authType: 'login',
            host: config.host,
            port: config.port,
            secure: true,
        });

        const membersList = teamData.members
            .filter(m => m.name && m.github)
            .map(m => `• ${m.name} (GitHub: ${m.github})`)
            .join('\n');

        const html = `
            <h1>Welcome to Hackathon25! 🚀</h1>
            <h2>Team Registration Confirmation</h2>
            
            <h3>Team Details:</h3>
            <ul>
                <li>Team Name: ${teamData.teamName}</li>
                <li>Team ID: ${teamData.teamId}</li>
                <li>GitHub Repository: ${teamData.githubRepo}</li>
            </ul>

            <h3>Team Leader:</h3>
            <p>${teamData.leaderName}</p>

            <h3>Team Members:</h3>
            <pre>${membersList}</pre>

            <h3>Event Details:</h3>
            <ul>
                <li>📅 Date: January 25-26, 2024</li>
                <li>⏰ Time: Starts at 9:00 AM IST</li>
                <li>📍 Venue: Engineering Block, RGMCET</li>
            </ul>

            <p>For more information, visit our <a href="https://hackathon25.rgmcet.edu.in">website</a>.</p>
        `;

        await mailer.send({
            from: { name: 'Hackathon25', email: config.username },
            to: { name: teamData.leaderName, email: teamData.leaderEmail },
            subject: `Team ${teamData.teamName} - Hackathon25 Registration Confirmation`,
            html,
            text: html.replace(/<[^>]*>/g, ''),
        });

        return true;
    } catch (error) {
        console.error('Email error:', error);
        return false;
    }
};
