-- drop table if exists teams;
-- drop table if exists members;

CREATE TABLE teams (
    team_id TEXT PRIMARY KEY, -- UUID or unique identifier
    team_name TEXT NOT NULL,
    repo_name TEXT NOT NULL,
    github_profile TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL
);

CREATE TABLE members (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id TEXT,
    name TEXT,
    github TEXT,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);