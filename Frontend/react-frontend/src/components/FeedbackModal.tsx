import React, { useState } from 'react';
import { useEventFeedback } from '../hooks/useEventFeedback';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Star, Loader2, MessageSquarePlus } from 'lucide-react';

interface FeedbackModalProps {
    slug: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ slug }) => {
    const { canReview, hasReviewed, submitFeedback, isSubmitting } = useEventFeedback(slug);
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    if (!canReview) return null;

    if (hasReviewed) {
        return (
            <Button variant="outline" className="w-full text-base h-12 text-emerald-600 border-emerald-200 bg-emerald-50" disabled>
                <Star className="w-5 h-5 mr-2 fill-emerald-600" />
                Feedback Submitted
            </Button>
        );
    }

    const handleSubmit = () => {
        if (rating === 0) return;
        submitFeedback({ rating, comment, isAnonymous }, {
            onSuccess: () => {
                setIsOpen(false);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full text-base h-12 bg-primary hover:bg-primary/90 text-white">
                    <MessageSquarePlus className="w-5 h-5 mr-2" />
                    Leave Feedback
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rate this event</DialogTitle>
                    <DialogDescription>
                        Your feedback helps the organizer improve future events.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center space-y-3">
                        <Label className="text-base font-semibold">How would you rate it?</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-all ${
                                        rating >= star
                                            ? 'bg-amber-400 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                                >
                                    {star}
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-slate-500">
                            {rating === 0 ? 'Select a rating (1-10)' : `${rating} out of 10`}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Tell us more (optional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="What did you like? What could be better?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="resize-none h-24"
                        />
                    </div>

                    <div className="flex items-center space-x-2 border bg-slate-50 p-3 rounded-lg">
                        <Checkbox 
                            id="anonymous" 
                            checked={isAnonymous} 
                            onCheckedChange={(checked) => setIsAnonymous(checked as boolean)} 
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="anonymous" className="font-medium text-slate-700 cursor-pointer">
                                Submit anonymously
                            </Label>
                            <p className="text-xs text-slate-500">
                                The organizer won't see your name or photo.
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FeedbackModal;