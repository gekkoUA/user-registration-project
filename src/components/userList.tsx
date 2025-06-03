import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUsers, deleteUser } from '../store/userSlice';
import { UserDetails } from '../types/user';

interface UserListProps {
  onEditUser: (user: UserDetails) => void;
}

const UserList: React.FC<UserListProps> = ({ onEditUser }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</div>;

  const buttonStyle = (variant: 'edit' | 'delete') => ({
    padding: '8px 16px',
    backgroundColor: variant === 'edit' ? '#ff6b35' : '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  });

  const UserCard = ({ user }: { user: UserDetails }) => (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{user.fullName}</h3>
          {[
            ['Constituency', user.constituency],
            ['Party', user.party],
            ['Position', user.position],
            ['Date of Birth', user.dateOfBirth],
            ['Gender', user.gender]
          ].map(([label, value]) => (
            <p key={label} style={{ margin: '5px 0', color: '#666' }}>
              <strong>{label}:</strong> {value}
            </p>
          ))}
          
          {user.vision && (
            <p style={{ margin: '10px 0', color: '#666' }}>
              <strong>Vision:</strong> {user.vision}
            </p>
          )}
          
          {user.education?.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Education:</strong>
              {user.education.map((edu, index) => (
                <div key={index} style={{ marginLeft: '20px', marginTop: '5px' }}>
                  {edu.degree} from {edu.college} ({edu.graduationYear})
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onEditUser(user)} style={buttonStyle('edit')}>
            Edit
          </button>
          <button onClick={() => handleDelete(user.id!)} style={buttonStyle('delete')}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Registered Users</h2>
      {users.length === 0 ? (
        <p>No users registered yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {users.map(user => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </div>
  );
};

export default UserList;