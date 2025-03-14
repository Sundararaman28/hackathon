interface TwilioConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}

interface TeamDetails {
    teamId: string;
    teamName: string;
    githubRepo: string;
    leader: {
        name: string;
        github: string;
    };
    members: Array<{
        name: string;
        github: string;
    }>;
}

const createMessageTemplate = (team: TeamDetails): string => {
    // Create members list excluding empty entries
    const membersList = team.members
        .filter(m => m.name && m.github)
        .map(m => `  • ${m.name} (GitHub: ${m.github})`)
        .join('\n');

    return `🎉 *Congratulations!* Your team has been registered for Hackathon25!

*Team Details:*
• Team Name: ${team.teamName}
• Team ID: ${team.teamId}
• GitHub Repository: ${team.githubRepo}

*Team Leader:*
• ${team.leader.name} (GitHub: ${team.leader.github})

*Team Members:*
${membersList}

*Event Details:*
📅 Date: January 25-26, 2024
⏰ Time: Starts at 9:00 AM IST
📍 Venue: Engineering Block, RGMCET
🌐 Website: https://hackathon25.rgmcet.edu.in

*Important Links:*
• Problem Statements: https://hackathon25.rgmcet.edu.in/problems
• Discord Channel: https://discord.gg/hackathon25
• GitHub Organization: https://github.com/hackathon25

Please join our Discord channel for updates and announcements.

Need help? Contact the organizers:
📞 +91 9876543210
✉️ hackathon25@rgmcet.edu.in

Best of luck! 🚀`;
}

export const sendWhatsAppMessage = async (
    config: TwilioConfig,
    to: string,
    teamDetails: TeamDetails
): Promise<boolean> => {
    try {
        const auth = btoa(`${config.accountSid}:${config.authToken}`);
        const formData = new URLSearchParams();
        
        const toNumber = to.startsWith('+') ? to : `+${to}`;
        formData.append('To', `whatsapp:${toNumber}`);
        formData.append('From', `whatsapp:${config.fromNumber}`);
        formData.append('Body', createMessageTemplate(teamDetails));

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData: { message?: string } = await response.json();
            console.error('Twilio API error details:', errorData);
            throw new Error(`Twilio API error: ${response.statusText} - ${errorData?.message || 'Unknown error'}`);
        }

        const responseData = await response.json();
        console.log('Twilio response:', responseData);
        return true;
    } catch (error) {
        console.error('WhatsApp message error:', error);
        return false;
    }
};
