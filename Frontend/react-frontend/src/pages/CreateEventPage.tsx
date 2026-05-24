import { type ChangeEvent, useState } from "react";
import type Event from '../Interfaces/Event'
import { useNavigate, useParams } from "react-router-dom";
import { useCreateEvent } from "../hooks/useCreateEvent";
import MapComponent from "../components/MapComponent";
import { toast } from "sonner";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import { useCategories } from "../hooks/useCategories";


const CreateEventPage: React.FC = () => {
    const { createEvent, isPending, error: apiError } = useCreateEvent();
    const { categories } = useCategories();
    const navigate = useNavigate();
    const { communityId }= useParams<{ communityId: string }>();
    const [file, setFile] = useState<File | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
        slug: '',
        city: '',
        county: '',
        imageUrl: '',
        categoryIds: [],
        communityId: communityId ?? undefined,
        isPublic: true,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Math.max(0, parseFloat(value) || 0) : value
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

    const handlePublicChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { checked } = e.target;
        setFormData(prev => ({
            ...prev,
            isPublic: checked
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const validateForm = (): boolean => {
        const errors: string[] = [];
        
        if (!formData.title.trim()) errors.push("Title is required.");
        if (!formData.startAt) errors.push("Start date is required.");
        if (!formData.endAt) errors.push("End date is required.");
        
        if (formData.startAt && formData.endAt) {
            const start = new Date(formData.startAt);
            const end = new Date(formData.endAt);
            if (end <= start) {
                errors.push("End date must be after the start date.");
            }
        }

        if (formData.maxAttendees <= 0) errors.push("Max attendees must be greater than zero.");
        if (formData.price < 0) errors.push("Price cannot be negative.");
        if (formData.latitude === 0 && formData.longitude === 0) errors.push("Please select a location on the map.");

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'categoryIds' && Array.isArray(value)) {
                value.forEach(id => data.append('CategoryIds', id));
            } else {
                data.append(key, value?.toString() ?? '');
            }
        });
        if (file) data.append('ImageFile', file);

        createEvent(data, {
            onSuccess: () => {
                toast.success("Event created successfully");
                navigate('/dashboard');
            },
            onError: () => {
                toast.error("Failed to create event. Please try again.");
            }
        });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center my-5">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    {apiError && <div className="alert alert-danger py-2">{apiError.message}</div>}
                    {validationErrors.length > 0 && (
                        <div className="alert alert-warning py-2">
                            <ul className="mb-0 ps-3">
                                {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        </div>
                    )}
                    
                    <h2 className="mb-4">Create New Event</h2>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            className="form-control"
                            value={formData.title} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea 
                            name="description" 
                            className="form-control"
                            rows={4}
                            value={formData.description} 
                            onChange={handleChange} 
                        />
                    </div>

                    {!!communityId && (
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="publicCheck"
                                checked={formData.isPublic}
                                onChange={handlePublicChange}
                            />
                            <label className="form-check-label" htmlFor="publicCheck">
                                Public Event
                            </label>
                        </div>
                    )}

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Start Date</label>
                            <input 
                                type="datetime-local" 
                                name="startAt" 
                                className="form-control"
                                value={formData.startAt} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">End Date</label>
                            <input 
                                type="datetime-local" 
                                name="endAt" 
                                className="form-control"
                                value={formData.endAt} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Max Attendees</label>
                            <input 
                                type="number" 
                                name="maxAttendees" 
                                className="form-control"
                                min="1"
                                value={formData.maxAttendees} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Price ($)</label>
                            <input 
                                type="number" 
                                name="price" 
                                className="form-control"
                                min="0"
                                step="0.01"
                                value={formData.price} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Categories</label>
                        <CategoryMultiSelect
                            categories={categories}
                            value={formData.categoryIds}
                            onChange={(categoryIds) => setFormData(prev => ({ ...prev, categoryIds }))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Location</label>
                        <MapComponent 
                            position={{ lat: formData.latitude, lng: formData.longitude }} 
                            readOnly={false} 
                            onPositionChange={handlePositionChange} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Event Image</label>
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
                        className="btn btn-primary py-2 fw-bold"
                    >
                        {isPending ? 'Creating...' : 'Save Event'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage