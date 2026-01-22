import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const fetchData = async () => {
    const agentsRes = await api.get('/admin/agents');
    setAgents(agentsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
         await api.put(`/admin/agents/${editingId}`, formData);
      } else {
         await api.post('/admin/agents', formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      alert(editingId ? 'Failed to update agent' : 'Failed to create agent');
    }
  };

  const handleEdit = (agent: Agent) => {
    setFormData({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        password: ''
    });
    setEditingId(agent.id);
    setShowCreate(true);
  };

  const handleDelete = async (id: number) => {
      if(!window.confirm('Are you sure you want to delete this agent?')) return;
      try {
          await api.delete(`/admin/agents/${id}`);
          fetchData();
      } catch (error) {
          alert('Failed to delete agent');
      }
  };

  const resetForm = () => {
      setShowCreate(false);
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', phone: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Agent Management</h1>
        <Button onClick={() => { resetForm(); setShowCreate(!showCreate); }}>
          <div className="flex items-center space-x-1">
            <Plus size={18} />
            <span>Create Agent</span>
          </div>
        </Button>
      </div>

      {showCreate && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 border dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">{editingId ? 'Edit Agent' : 'New Agent'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
            <Input 
              placeholder="Email" 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
            <Input 
              placeholder={editingId ? "Password (leave blank to keep current)" : "Password"} 
              type="password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required={!editingId} 
            />
            <Input 
              placeholder="Phone" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              required
            />
            <div className="col-span-2 flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingId ? 'Update Agent' : 'Save Agent'}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{agent.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{agent.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 uppercase">
                    {agent.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(agent.created_at).toLocaleDateString()}
                </td>
                 <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                   <div className="flex space-x-2">
                    <button onClick={() => handleEdit(agent)} className="p-1 hover:text-blue-600 dark:hover:text-blue-400">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(agent.id)} className="p-1 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 size={18} />
                    </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};