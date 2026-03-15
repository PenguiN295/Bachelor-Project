import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunity } from '../hooks/useCommunity';
import { useEvents } from '../hooks/useEvents';
import LoadingState from '../components/LoadingState';
import EventCardList from '../components/EventCardList';
import noPhoto from '../assets/nophoto.svg';

const CommunityPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { community, loading, join, leave, isJoining, isLeaving } = useCommunity(slug || '');
    
    const { events: communityEvents, loading: eventsLoading } = useEvents(undefined, undefined, community?.id);

    if (loading) return <div className="container mt-5"><LoadingState /></div>;
    if (!community) return (
        <div className="container mt-5 text-center">
            <h3>Community not found</h3>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/communities')}>
                Back to Communities
            </button>
        </div>
    );

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm border-0 overflow-hidden mb-4">
                        <div 
                            className="community-header-banner"
                            style={{ 
                                height: '250px', 
                                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${community.photo || noPhoto})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                        </div>
                        <div className="card-body position-relative pt-5">
                            <div 
                                className="position-absolute translate-middle-y border border-4 border-white rounded shadow-sm"
                                style={{ top: '0', left: '2rem', width: '120px', height: '120px', backgroundColor: 'white' }}
                            >
                                <img 
                                    src={community.photo || noPhoto} 
                                    alt={community.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mt-2 mt-md-0 ps-md-5 ms-md-5">
                                <div className="ps-md-4">
                                    <h1 className="fw-bold mb-1">{community.name}</h1>
                                    <p className="text-muted">
                                        <i className="bi bi-people-fill me-2"></i>
                                        {community.memberCount} members • Created {new Date(community.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-3 mt-md-0">
                                    {community.isJoined ? (
                                        <div className="btn-group">
                                            <button 
                                                className="btn btn-outline-primary"
                                                onClick={() => navigate(`/CreateEvent?communityId=${community.id}`)}
                                            >
                                                <i className="bi bi-calendar-plus me-2"></i>Create Event
                                            </button>
                                            <button 
                                                className="btn btn-outline-danger" 
                                                onClick={() => leave()}
                                                disabled={isLeaving || community.userRole === 'Owner'}
                                                title={community.userRole === 'Owner' ? "Owner cannot leave" : ""}
                                            >
                                                {isLeaving ? 'Leaving...' : 'Leave Community'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="btn btn-primary btn-lg px-4" 
                                            onClick={() => join()}
                                            disabled={isJoining}
                                        >
                                            {isJoining ? 'Joining...' : 'Join Community'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="row">
                                <div className="col-md-8">
                                    <h4 className="fw-bold mb-3">About</h4>
                                    <p className="lead" style={{ whiteSpace: 'pre-wrap' }}>
                                        {community.description}
                                    </p>

                                    <div className="mt-5">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="fw-bold mb-0">Community Events</h4>
                                        </div>
                                        {eventsLoading ? (
                                            <LoadingState />
                                        ) : communityEvents.length > 0 ? (
                                            <EventCardList events={communityEvents} />
                                        ) : (
                                            <div className="bg-light rounded p-4 text-center">
                                                <i className="bi bi-calendar-x d-block mb-2 fs-3 text-muted"></i>
                                                <p className="text-muted mb-0">No upcoming events for this community.</p>
                                                {community.isJoined && (
                                                    <button 
                                                        className="btn btn-link btn-sm mt-2"
                                                        onClick={() => navigate('/CreateEvent', { state: { communityId: community.id } })}
                                                    >
                                                        Create the first one!
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="col-md-4 mt-4 mt-md-0">
                                    <div className="card bg-light border-0">
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-3">Community Rules</h5>
                                            <ol className="small text-muted ps-3 mb-0">
                                                <li className="mb-2">Be respectful to all members.</li>
                                                <li className="mb-2">No spamming or self-promotion.</li>
                                                <li className="mb-2">Follow the event guidelines.</li>
                                                <li>Have fun and participate!</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
