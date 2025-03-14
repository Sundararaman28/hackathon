import { Context } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { RegisterTeamRequest, TeamExcelData } from './types'
import ExcelJS from 'exceljs';
import { sendWhatsAppMessage } from '../utils/twilio';

export const registerTeam = async (c: Context): Promise<Response> => {
    const data = await c.req.json<RegisterTeamRequest>()
    const teamId = uuidv4()
    const { DB } = c.env

    try {
        // Insert team data with whatsapp
        await DB.prepare(
            'INSERT INTO teams (team_id, team_name, repo_name, github_profile, email, whatsapp_number) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(teamId, data.teamName, data.repoName, data.githubProfile, data.email, data.whatsapp).run()

        // Insert members without whatsapp
        await DB.prepare(
            'INSERT INTO members (team_id, name, github) VALUES (?, ?, ?)'
        ).bind(teamId, data.name, data.githubProfile).run()

        const teammates = [
            { name: data.teammate1, github: data.teammate1Github },
            { name: data.teammate2, github: data.teammate2Github },
            { name: data.teammate3, github: data.teammate3Github }
        ]

        for (const teammate of teammates) {
            if (teammate.name && teammate.github) {
                await DB.prepare(
                    'INSERT INTO members (team_id, name, github) VALUES (?, ?, ?)'
                ).bind(teamId, teammate.name, teammate.github).run()
            }
        }

        // Send WhatsApp confirmation
        if (data.whatsapp) {
            const twilioConfig = {
                accountSid: c.env.TWILIO_ACCOUNT_SID,
                authToken: c.env.TWILIO_AUTH_TOKEN,
                fromNumber: c.env.TWILIO_WHATSAPP_NUMBER
            };

            await sendWhatsAppMessage(
                twilioConfig,
                data.whatsapp,
                {
                    teamId,
                    teamName: data.teamName,
                    githubRepo: `https://github.com/${data.githubProfile}/${data.repoName}`,
                    leader: {
                        name: data.name,
                        github: data.githubProfile
                    },
                    members: [
                        { name: data.teammate1 || '', github: data.teammate1Github || '' },
                        { name: data.teammate2 || '', github: data.teammate2Github || '' },
                        { name: data.teammate3 || '', github: data.teammate3Github || '' }
                    ]
                }
            );
        }

        return c.json({ message: 'Team registered successfully', teamId })
    } catch (error) {
        console.error(error)
        return c.json({ message: 'Server error' }, 500)
    }
}

export const getTeams = async (c: Context): Promise<Response> => {
    try {
        const { DB } = c.env
        const teams = await DB.prepare(`
            SELECT t.*, GROUP_CONCAT(m.name) as member_names, GROUP_CONCAT(m.github) as member_githubs
            FROM teams t
            LEFT JOIN members m ON t.team_id = m.team_id
            GROUP BY t.team_id
        `).all()

        return c.json(teams)
    } catch (error) {
        console.error(error)
        return c.json({ message: 'Server error' }, 500)
    }
}

// Function to download Excel
interface DownloadExcelContext {
    env: {
        DB: {
            prepare: (query: string) => {
                all: () => Promise<any[]>;
            };
        };
    };
    json: (body: any, status?: number) => Response;
}


export const downloadExcel = async (c: Context): Promise<Response> => {
    const { DB } = c.env;
    try {
        const query = `
            SELECT 
                t.team_id, 
                t.team_name, 
                t.github_profile,
                t.email,
                t.repo_name,
                t.whatsapp_number,
                GROUP_CONCAT(m.name) as members_name,
                GROUP_CONCAT(m.github) as members_github
            FROM teams t
            LEFT JOIN members m ON t.team_id = m.team_id
            GROUP BY t.team_id
        `;

        const queryResult = await DB.prepare(query).all();
        const results = queryResult.results as TeamExcelData[]; // Extract the results array

        if (!results || !Array.isArray(results)) {
            throw new Error('No data found or invalid data format');
        }
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Registered Teams');

        // Header row
        worksheet.columns = [
            { header: 'Team ID', key: 'team_id', width: 30 },
            { header: 'Team Name', key: 'team_name', width: 30 },
            { header: 'Github Profile', key: 'github_profile', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Repository', key: 'repo_name', width: 30 },
            { header: 'Team Members', key: 'members_name', width: 40 },
            { header: 'Members Github', key: 'members_github', width: 40 },
            { header: 'WhatsApp Number', key: 'whatsapp_number', width: 30 },
        ];

        // Data rows
        results.forEach(row => worksheet.addRow(row));

        // Create a buffer to store the Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        
        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=Registered_Teams.xlsx'
            }
        });
    } catch (error) {
        console.error("Error generating Excel:", error);
        return c.json({ error: "Failed to generate Excel file." }, 500);
    }
};