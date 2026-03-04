import React from "react"

import { type ChangeEvent, useState } from "react";
import type Event from '../Interfaces/Event'
import { useNavigate } from "react-router-dom";
import { useCreateEvent } from "../hooks/useCreateEvent";
import MapComponent from "../components/MapComponent";
import { toast } from "sonner";

const CreateEventPage: React.FC = () => {
    const { createEvent, isPending, error } = useCreateEvent();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<Event>({
        id: '',
        title: '',
        description: '',
        startAt: '',
        endAt: '',
        maxAttendees: 0,
        currentAttendees: 0,
        price: 0,
        latitude: 0,
        longitude: 0,
        city: '',
        county: '',
        imageUrl: '',
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };
    const handlePositionChange = (pos: { lat: number; lng: number; city?: string; county?: string }): void => {
        setFormData(prev => ({
            ...prev,
            latitude: pos.lat,
            longitude: pos.lng,
            city: pos.city ?? prev.city,
            county: pos.county ?? prev.county
        }));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value?.toString() ?? '');
        });
        if (file) data.append('ImageFile', file);

        createEvent(data, {
            onSuccess: () => {
                toast.success("Event created successfully");
                navigate('/dashboard');
            },
            onError: () => {toast.error("Failed to create event. Please try again.");
            }
        });
    };
    return (<>
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                    {error && <div className="alert alert-danger py-2">{error.message}</div>}
                    <h2>Create New Event</h2>

                    <div>
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div>
                            <label>Start Date</label>
                            <input type="datetime-local" name="startAt" value={formData.startAt} onChange={handleChange} />
                        </div>
                        <div>
                            <label>End Date</label>
                            <input type="datetime-local" name="endAt" value={formData.endAt} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div>
                            <label>Max Attendees</label>
                            <input type="number" name="maxAttendees" value={formData.maxAttendees} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label>Location</label>
                        <MapComponent position={{ lat: formData.latitude, lng: formData.longitude }} readOnly={false} onPositionChange={handlePositionChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Event Image</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            padding: '10px',
                            cursor: isPending ? 'not-allowed' : 'pointer',
                            opacity: isPending ? 0.7 : 1
                        }}
                    >
                        {isPending ? 'Creating...' : 'Save Event'}
                    </button>
                </form>
            </div>
        </div>

    </>)

}
export default CreateEventPage