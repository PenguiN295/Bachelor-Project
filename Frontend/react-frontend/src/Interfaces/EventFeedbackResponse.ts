export default interface EventFeedbackResponse {
    id: string;
    eventId: string;
    userId?: string;
    username?: string;
    photo?: string;
    rating: number;
    comment?: string;
    isAnonymous: boolean;
    createdAt: string;
}