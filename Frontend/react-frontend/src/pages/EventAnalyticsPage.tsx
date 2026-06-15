import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventAnalytics } from '../hooks/useEventAnalytics';
import LoadingState from '../components/LoadingState';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, UserPlus, TrendingUp, DollarSign, Lightbulb, AlertCircle, Star, MessageSquare } from 'lucide-react';
import noPhoto from '../assets/nophoto.svg';

const EventAnalyticsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { analytics, loading, error } = useEventAnalytics(slug);
    const navigate = useNavigate();

    if (error) return (
        <div className="min-h-screen bg-slate-50 p-8 flex justify-center">
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg max-w-md w-full flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-bold">Failed to load analytics</h3>
                    <p className="text-sm mt-1">There was a problem fetching the data. Please try again later.</p>
                </div>
            </div>
        </div>
    );

    if (loading || !analytics) return <div className="min-h-screen bg-slate-50 py-12"><LoadingState /></div>;

    const pieData = [
        { name: 'Attendees', value: analytics.totalSubscribers },
        { name: 'Remaining Capacity', value: Math.max(0, analytics.maxCapacity - analytics.totalSubscribers) }
    ];
    const COLORS = ['#4f46e5', '#f1f5f9'];

    const eventName = slug?.split('-').slice(0, -1).join(' ') || 'Event';
    const feedbacks = analytics.feedbacks || [];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">

                <Button 
                    variant="ghost" 
                    className="mb-6 -ml-4 text-slate-600 hover:text-slate-900" 
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Past Events
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        Event Analytics
                    </h1>
                    <p className="text-slate-600 mt-2 text-lg capitalize">{eventName}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-medium text-slate-600 mb-1">Total Subscribers</div>
                            <h3 className="text-3xl font-bold text-slate-900">{analytics.totalSubscribers}</h3>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-600">
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-medium text-slate-600 mb-1">Max Capacity</div>
                            <h3 className="text-3xl font-bold text-slate-900">{analytics.maxCapacity}</h3>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-medium text-slate-600 mb-1">Attendance Rate</div>
                            <h3 className="text-3xl font-bold text-emerald-600">{analytics.attendanceRate.toFixed(1)}%</h3>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 text-amber-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-medium text-slate-600 mb-1">Total Revenue</div>
                            <h3 className="text-3xl font-bold text-amber-500">${analytics.totalRevenue.toFixed(2)}</h3>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                                <Star className="w-6 h-6 fill-indigo-600" />
                            </div>
                            <div className="text-sm font-medium text-slate-600 mb-1">Avg Rating</div>
                            <h3 className="text-3xl font-bold text-indigo-600">
                                {analytics.averageRating ? `${analytics.averageRating.toFixed(1)} / 10` : 'N/A'}
                            </h3>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card className="border-0 shadow-sm lg:col-span-2">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-xl">Capacity Utilization</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm h-full">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-amber-500" />
                                Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-1">Turnout Analysis</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {analytics.attendanceRate >= 80 
                                                ? "Great turnout! This event was almost at full capacity. Your marketing efforts were highly successful."
                                                : "Room for growth. Consider different marketing strategies or timing adjustments next time."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 mt-0.5">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-1">Revenue Metrics</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Average revenue per available spot was <span className="font-semibold text-slate-900">${(analytics.totalRevenue / analytics.maxCapacity || 0).toFixed(2)}</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feedbacks Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            Attendee Feedback
                        </h2>
                        <span className="bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {feedbacks.length} Reviews
                        </span>
                    </div>

                    {feedbacks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {feedbacks.map(fb => (
                                <Card key={fb.id} className="border-slate-200 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-slate-200">
                                                    <AvatarImage src={fb.photo || noPhoto} className="object-cover" />
                                                    <AvatarFallback className="bg-slate-100 text-slate-600">
                                                        {fb.username?.substring(0, 2).toUpperCase() || "AN"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 leading-none mb-1">
                                                        {fb.username || "Anonymous Attendee"}
                                                    </h4>
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(fb.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1 font-bold px-2 py-1 rounded-md text-sm ${
                                                fb.rating >= 8 ? 'bg-emerald-100 text-emerald-700' :
                                                fb.rating >= 5 ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                <Star className={`w-3.5 h-3.5 ${
                                                    fb.rating >= 8 ? 'fill-emerald-700' :
                                                    fb.rating >= 5 ? 'fill-amber-700' :
                                                    'fill-red-700'
                                                }`} />
                                                {fb.rating} / 10
                                            </div>
                                        </div>
                                        {fb.comment ? (
                                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                "{fb.comment}"
                                            </p>
                                        ) : (
                                            <p className="text-slate-400 text-sm italic">No comment provided.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-sm border border-slate-200 bg-white">
                            <CardContent className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <MessageSquare className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No feedback yet</h3>
                                <p className="text-slate-500 max-w-md">Attendees haven't left any reviews for this event. Feedback will appear here once submitted.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventAnalyticsPage;