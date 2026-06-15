import type EventFeedbackResponse from "./EventFeedbackResponse";

export default interface EventAnalytics {
    totalSubscribers: number;
    maxCapacity: number;
    attendanceRate: number;
    totalRevenue: number;
    averageRating?: number;
    feedbacks: EventFeedbackResponse[];
}
