import { useState } from "react";
import type Event from "../Interfaces/Event";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserComponent from "./UserComponent";
import { formatDateTime } from "../utils/dateUtils";
import { Users, DollarSign, CalendarClock, ChartNoAxesCombined, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export interface EventProp {
    event: Event;
    isEditable?: boolean;
    canDelete?: boolean;
    isPast?: boolean;
    onSave?: (updatedEvent: Event) => void;
    onDelete?: () => void;
    creator?: string | null;
    creatorId?: string | null;
    creatorPhoto?: string | null;
}

const EventComponent: React.FC<EventProp> = ({ event, isEditable, canDelete, isPast, onSave, onDelete, creator, creatorId, creatorPhoto }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [tempEvent, setTempEvent] = useState<Event>(event);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTempEvent(prev => ({ ...prev, [name]: name === 'price' || name === 'maxAttendees' ? Number(value) : value }));
    };

    const handleSave = () => {
        if (!tempEvent.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (new Date(tempEvent.endAt) <= new Date(tempEvent.startAt)) {
            toast.error("End date must be after start date");
            return;
        }
        if (tempEvent.maxAttendees < 1) {
            toast.error("Max attendees must be at least 1");
            return;
        }
        if (tempEvent.price < 0) {
            toast.error("Price cannot be negative");
            return;
        }

        onSave?.(tempEvent);
        setIsEditing(false);
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(false);
        setIsEditing(false);
        toast.success("Event deleted successfully");
        onDelete?.();
        navigate("/dashboard");
    };

    const handleCancel = () => {
        setTempEvent({ ...event });
        setIsEditing(false);
    };

    return (
        <div className="bg-white border-b border-slate-200">
            {event.imageUrl && (
                <div className="w-full h-64 md:h-96 relative overflow-hidden bg-slate-900">
                    <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
            )}
            
            <div className="container mx-auto px-4 max-w-5xl py-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <Input
                                className="text-2xl font-bold h-14 mb-4 bg-slate-50 border-slate-200"
                                name="title"
                                value={tempEvent.title}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{event.title}</h1>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-slate-600">
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
                                <Users className="w-4 h-4 text-primary" />
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <span>{event.currentAttendees} /</span>
                                        <Input 
                                            type="number" 
                                            name="maxAttendees" 
                                            className="w-20 h-7 text-sm py-0 px-2" 
                                            value={tempEvent.maxAttendees} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                ) : (
                                    <span>{event.currentAttendees} / {event.maxAttendees} Attending</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-4 shrink-0">
                        {isEditing ? (
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input 
                                    type="number" 
                                    name="price" 
                                    className="pl-10 text-lg h-12 w-full md:w-48 bg-slate-50 border-slate-200" 
                                    value={tempEvent.price} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                        ) : (
                            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-2xl font-bold shadow-sm inline-block text-center w-full md:w-auto">
                                {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                            </div>
                        )}

                        {(isEditable || canDelete) && (
                            <div className="flex flex-wrap gap-2 justify-end">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={handleCancel}>
                                            <X className="w-4 h-4 mr-2" /> Cancel
                                        </Button>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
                                            <Check className="w-4 h-4 mr-2" /> Save
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {isEditable && (
                                            isPast ? (
                                                <Button onClick={() => navigate(`/event-analytics/${event.slug}`)}>
                                                    <ChartNoAxesCombined className="w-4 h-4 mr-2" /> Analytics
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5" onClick={() => setIsEditing(true)}>
                                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                                </Button>
                                            )
                                        )}
                                        {canDelete && !isEditing && (
                                            <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setShowDeleteConfirm(true)}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                About this Event
                            </h3>
                            {isEditing ? (
                                <textarea
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 p-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 min-h-[200px]"
                                    name="description"
                                    value={tempEvent.description}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                                    {event.description}
                                </p>
                            )}
                        </section>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-100 p-4">
                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <CalendarClock className="w-5 h-5 text-primary" />
                                    Date & Time
                                </h4>
                            </div>
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Starts</Label>
                                    {isEditing ? (
                                        <Input 
                                            type="datetime-local" 
                                            name="startAt" 
                                            className="mt-1 bg-slate-50" 
                                            value={tempEvent.startAt} 
                                            onChange={handleInputChange} 
                                        />
                                    ) : (
                                        <div className="text-slate-900 font-medium mt-1">{formatDateTime(event.startAt)}</div>
                                    )}
                                </div>
                                <div className="pt-2 border-t border-slate-100">
                                    <Label className="text-slate-500 text-xs uppercase tracking-wider">Ends</Label>
                                    {isEditing ? (
                                        <Input 
                                            type="datetime-local" 
                                            name="endAt" 
                                            className="mt-1 bg-slate-50" 
                                            value={tempEvent.endAt} 
                                            onChange={handleInputChange} 
                                        />
                                    ) : (
                                        <div className="text-slate-900 font-medium mt-1">{formatDateTime(event.endAt)}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                             <div className="bg-slate-50 border-b border-slate-100 p-4">
                                <h4 className="font-semibold text-slate-900">Organizer</h4>
                            </div>
                            <CardContent className="p-4">
                                {creatorId && creator ? (
                                    <UserComponent
                                        id={creatorId}
                                        username={creator}
                                        photo={creatorPhoto}
                                        isMe={isEditable}
                                    />
                                ) : (
                                    <div className="text-slate-500 italic">Unknown Organizer</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal Overlay */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md mx-4 shadow-xl border-0">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Deletion</h3>
                            <p className="text-slate-600 mb-6">Are you sure you want to permanently delete this event? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={confirmDelete}>Delete Event</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default EventComponent;