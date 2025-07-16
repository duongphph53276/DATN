import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Role {
  _id: string;
  name: string;
  description: string;
}

interface Permission {
  _id: string;
  name: string;
  description: string;
}

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
  }, []);

  const fetchPermissions = async () => {
    const response = await axios.get('http://localhost:5000/permissions');
    setPermissions(response.data);
  };

  const fetchRoles = async () => {
    const response = await axios.get('http://localhost:5000/roles');
    setRoles(response.data);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, description };
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/permissions/${editingId}`, data);
      } else {
        await axios.post('http://localhost:5000/permissions/create', data);
      }
      setName('');
      setDescription('');
      setEditingId(null);
      fetchPermissions();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (permission: Permission) => {
    setName(permission.name);
    setDescription(permission.description);
    setEditingId(permission._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/permissions/${id}`);
      fetchPermissions();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAssignRole = async (permissionId: string, roleId: string) => {
    try {
      await axios.post('http://localhost:5000/permissions/assign', { role_id: roleId, permission_id: permissionId });
      fetchPermissions(); // Refresh để cập nhật (nếu cần)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Permission Management</h2>
        <span className="text-gray-500">Xin chào, Admin</span>
      </div>
      <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
      <ul className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {permissions.map((perm) => (
          <li key={perm._id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border-b border-gray-200">
            <span className="font-medium text-gray-800">{perm.name}</span>
            <span className="text-gray-500 flex-1">{perm.description}</span>
            <button
              onClick={() => handleEdit(perm)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(perm._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
            <select
              value=""
              onChange={(e) => handleAssignRole(perm._id, e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Role to Assign</option>
              {roles.map(role => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermissionManagement;