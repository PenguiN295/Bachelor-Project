import { type ChangeEvent, useState } from "react";
import type Event from '../Interfaces/Event'
import { useNavigate, useParams } from "react-router-dom";
import { useCreateEvent } from "../hooks/useCreateEvent";
import MapComponent from "../components/MapComponent";
import { toast } from "sonner";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import { useCategories } from "../hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ImagePlus, MapPin, AlertCircle } from "lucide-react";

const CreateEventPage: React.FC = () => {
    const { createEvent, isPending, error: apiError } = useCreateEvent();
    const { categories } = useCategories();
    const navigate = useNavigate();
    const { communityId } = useParams<{ communityId: string }>();
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
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Event</h1>
                    <p className="text-slate-500">Fill in the details below to publish your event.</p>
                </div>

                <Card className="border-0 shadow-md">
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {(apiError || validationErrors.length > 0) && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                                    <div className="text-sm text-destructive font-medium">
                                        {apiError && <p>{apiError.message}</p>}
                                        {validationErrors.length > 0 && (
                                            <ul className="list-disc pl-4 space-y-1 mt-1">
                                                {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Basic Info Section */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Basic Information</h3>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title <span className="text-destructive">*</span></Label>
                                    <Input 
                                        id="title"
                                        type="text" 
                                        name="title" 
                                        placeholder="e.g. Summer Music Festival 2026"
                                        value={formData.title} 
                                        onChange={handleChange}
                                        className="bg-slate-50 text-base py-6"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                    <textarea 
                                        id="description"
                                        name="description" 
                                        placeholder="Describe what your event is about, what people can expect, etc."
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 min-h-[120px]"
                                        value={formData.description} 
                                        onChange={handleChange} 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Categories</Label>
                                    <CategoryMultiSelect
                                        categories={categories}
                                        value={formData.categoryIds}
                                        onChange={(categoryIds) => setFormData(prev => ({ ...prev, categoryIds }))}
                                    />
                                </div>
                            </div>

                            {/* Date & Settings Section */}
                            <div className="space-y-6 pt-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Date & Settings</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="startAt">Start Date & Time <span className="text-destructive">*</span></Label>
                                        <Input 
                                            id="startAt"
                                            type="datetime-local" 
                                            name="startAt" 
                                            value={formData.startAt} 
                                            onChange={handleChange}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endAt">End Date & Time <span className="text-destructive">*</span></Label>
                                        <Input 
                                            id="endAt"
                                            type="datetime-local" 
                                            name="endAt" 
                                            value={formData.endAt} 
                                            onChange={handleChange}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="maxAttendees">Maximum Attendees <span className="text-destructive">*</span></Label>
                                        <Input 
                                            id="maxAttendees"
                                            type="number" 
                                            name="maxAttendees" 
                                            min="1"
                                            value={formData.maxAttendees || ''} 
                                            onChange={handleChange}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($) <span className="text-slate-400 font-normal ml-1">(0 for free)</span></Label>
                                        <Input 
                                            id="price"
                                            type="number" 
                                            name="price" 
                                            min="0"
                                            step="0.01"
                                            value={formData.price} 
                                            onChange={handleChange}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </div>

                                {!!communityId && (
                                    <div className="flex items-center space-x-2 pt-2">
                                        <input
                                            id="publicCheck"
                                            name="isPublic"
                                            type="checkbox"
                                            checked={formData.isPublic}
                                            onChange={handlePublicChange}
                                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                        />
                                        <Label htmlFor="publicCheck" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                            Make this event public (visible outside the community)
                                        </Label>
                                    </div>
                                )}
                            </div>

                            {/* Location Section */}
                            <div className="space-y-6 pt-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                        Location <span className="text-destructive">*</span>
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4">Click on the map to pin the exact location of your event.</p>
                                </div>
                                
                                <div className="rounded-xl overflow-hidden border border-slate-200 h-[400px]">
                                    <MapComponent 
                                        position={{ lat: formData.latitude, lng: formData.longitude }} 
                                        readOnly={false} 
                                        onPositionChange={handlePositionChange} 
                                    />
                                </div>
                            </div>

                            {/* Media Section */}
                            <div className="space-y-6 pt-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                                        <ImagePlus className="w-5 h-5 text-slate-400" />
                                        Event Cover Image
                                    </h3>
                                </div>
                                
                                <div className="space-y-2">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer h-auto py-3"
                                    />
                                    <p className="text-xs text-slate-500">Recommended size: 1920x1080px (16:9 ratio). Max size: 5MB.</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => navigate('/dashboard')}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    size="lg"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating Event...
                                        </>
                                    ) : (
                                        'Publish Event'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateEventPage;