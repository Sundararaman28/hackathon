interface Team {
    team_id: string;
    team_name: string;
    repo_name: string;
    github_profile: string;
    email: string;
    whatsapp_number: string;
}

interface Member {
    member_id?: number;
    team_id: string;
    name: string;
    github: string;
    whatsapp_number: string;
}

interface RegisterTeamRequest {
    name: string;
    email: string;
    teamName: string;
    githubProfile: string;
    repoName: string;
    teammate1?: string;
    teammate1Github?: string;
    teammate2?: string;
    teammate2Github?: string;
    teammate3?: string;
    teammate3Github?: string;
    whatsapp?: string;
}

interface TeamExcelData {
    team_id: string;
    team_name: string;
    github_profile: string;
    email: string;
    repo_name: string;
    members_name: string;
    members_github: string;
    whatsapp_number: string;
}

export type { Team, Member, RegisterTeamRequest, TeamExcelData };
