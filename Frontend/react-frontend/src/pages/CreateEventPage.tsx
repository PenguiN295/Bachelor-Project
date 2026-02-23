import React, { type FormEvent } from "react"

import { type ChangeEvent, useState } from "react";
import type Event from '../Interfaces/Event'
import url from "../../config";
import { useNavigate } from "react-router-dom";

const CreateEventPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Event>({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        maxAttendees: 0,
        currentAttendees: 0,
        price: 0,
        location: '',
        imageUrl: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            };
            const response = await fetch(`${url}/create-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    Title: payload.title,
                    Description: payload.description,
                    StartDate: payload.startDate,
                    EndDate: payload.endDate,
                    MaxAttendees: payload.maxAttendees,
                    CurrentAttendees: payload.currentAttendees,
                    Price: payload.price,
                    Location: payload.location,
                    ImageUrl: payload.imageUrl
                })
            })
            if (!response.ok) {
                throw new Error("Failed to create Event");
            }
            navigate('/dashboard');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Event creation failed');
        }
        finally {
            setLoading(false)
        }
    };
    return (<>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
            {error && <div className="alert alert-danger py-2">{error}</div>}
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
                    <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} />
                </div>
                <div>
                    <label>End Date</label>
                    <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} />
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
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
            </div>

            <div>
                <label>Image URL</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? 'Creating...' : 'Save Event'}
            </button>
        </form>

    </>)

}
export default CreateEventPage