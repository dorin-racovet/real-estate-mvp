import React, { useState, useEffect } from 'react';
import { usersApi, UserUpdate } from '../api/users';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ProfilePage: React.FC = () => {
    const [formData, setFormData] = useState<UserUpdate>({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
             try {
                 const data = await usersApi.getMe();
                 setFormData(prev => ({
                     ...prev,
                     name: data.name,
                     email: data.email,
                     phone: data.phone || ''
                 }));
             } catch (err) {
                 console.error(err);
             }
        };
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const updateData: UserUpdate = {};
            if (formData.name) updateData.name = formData.name;
            if (formData.email) updateData.email = formData.email;
            if (formData.phone) updateData.phone = formData.phone;
            if (formData.password) updateData.password = formData.password;

            await usersApi.updateMe(updateData);
            setSuccess(true);
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (err) {
            console.error(err);
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        Profile updated successfully!
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                        <Input name="password" type="password" value={formData.password} onChange={handleChange} />
                    </div>
                    
                    <div className="pt-4">
                        <Button type="submit" isLoading={loading}>Update Profile</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
