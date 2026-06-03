import React, { useState } from 'react';
import { useCreateCommunity } from '../hooks/useCreateCommunity';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ImagePlus } from 'lucide-react';

const CreateCommunityPage: React.FC = () => {
    const { createCommunity, isPending } = useCreateCommunity();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Description', description);
        if (image) {
            formData.append('ImageFile', image);
        }
        createCommunity(formData);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                
                <Button 
                    variant="ghost" 
                    className="mb-6 -ml-4 text-slate-500 hover:text-slate-900"
                    onClick={() => navigate('/communities')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Communities
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create a Community</h1>
                    <p className="text-slate-500">Build a space for people with shared interests.</p>
                </div>

                <Card className="border-0 shadow-md">
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            <div className="flex flex-col items-center space-y-4">
                                <Label className="text-slate-700 font-semibold w-full text-left">Community Image</Label>
                                <div className="relative group w-48 h-48 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden hover:border-primary/50 transition-colors flex items-center justify-center">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                            <ImagePlus className="w-8 h-8 mb-2" />
                                            <span className="text-sm font-medium">Upload Image</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 w-full text-center">Square images (1:1 ratio) work best.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Community Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="What's your community called?"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-slate-50 text-base py-6"
                                    disabled={isPending}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                <textarea
                                    id="description"
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 min-h-[120px]"
                                    placeholder="Tell people what your community is about..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    disabled={isPending}
                                ></textarea>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => navigate('/communities')}
                                    disabled={isPending}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isPending}
                                    className="w-full sm:w-auto"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : 'Create Community'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateCommunityPage;