export default interface Community {
    id: string;
    name: string;
    description: string;
    slug: string;
    photo?: string;
    creatorId: string;
    createdAt: string;
    memberCount: number;
    isJoined: boolean;
    userRole?: string;
}
