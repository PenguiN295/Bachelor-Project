import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventAnalytics } from '../hooks/useEventAnalytics';
import LoadingState from '../components/LoadingState';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EventAnalyticsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { analytics, loading, error } = useEventAnalytics(slug);
    const navigate = useNavigate();

    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger">Failed to load analytics.</div>
        </div>
    );

    if (loading || !analytics) return <LoadingState />;

    const pieData = [
        { name: 'Attendees', value: analytics.totalSubscribers },
        { name: 'Remaining Capacity', value: Math.max(0, analytics.maxCapacity - analytics.totalSubscribers) }
    ];

    const COLORS = ['#0d6efd', '#e9ecef'];

    return (
        <div className="container mt-5">
            <button className="btn btn-link p-0 mb-4 text-decoration-none" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-1"></i>Back to Past Events
            </button>

            <h2 className="mb-4">Event Analytics: <span className="text-muted">{slug?.split('-').slice(0, -1).join(' ')}</span></h2>

            <div className="row g-4">
                <div className="col-md-3">
                    <div className="card h-100 shadow-sm border-0 text-center p-3">
                        <div className="text-muted small mb-1">Total Subscribers</div>
                        <h3 className="mb-0 fw-bold text-primary">{analytics.totalSubscribers}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card h-100 shadow-sm border-0 text-center p-3">
                        <div className="text-muted small mb-1">Max Capacity</div>
                        <h3 className="mb-0 fw-bold">{analytics.maxCapacity}</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card h-100 shadow-sm border-0 text-center p-3">
                        <div className="text-muted small mb-1">Attendance Rate</div>
                        <h3 className="mb-0 fw-bold text-success">{analytics.attendanceRate.toFixed(1)}%</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card h-100 shadow-sm border-0 text-center p-3">
                        <div className="text-muted small mb-1">Total Revenue</div>
                        <h3 className="mb-0 fw-bold text-warning">${analytics.totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4">
                        <h5 className="card-title mb-4">Capacity Utilization</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 p-4 h-100">
                        <h5 className="card-title mb-3">Insights</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item border-0 px-0">
                                <i className="bi bi-info-circle me-2 text-primary"></i>
                                {analytics.attendanceRate >= 80 
                                    ? "Great turnout! This event was almost at full capacity."
                                    : "Room for growth. Consider different marketing strategies next time."}
                            </li>
                            <li className="list-group-item border-0 px-0">
                                <i className="bi bi-cash-stack me-2 text-success"></i>
                                Average revenue per spot: ${(analytics.totalRevenue / analytics.maxCapacity || 0).toFixed(2)}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventAnalyticsPage;
