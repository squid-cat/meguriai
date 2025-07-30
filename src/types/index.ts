export interface TeamMember {
	id: string;
	name: string;
	avatar?: string | null;
}

export interface GratitudeMessage {
	id: string;
	from: TeamMember;
	to: TeamMember[];
	message: string;
	createdAt: Date | string;
}
