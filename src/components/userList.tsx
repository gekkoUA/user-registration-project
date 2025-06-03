import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUsers, deleteUser, clearError } from '../store/userSlice';
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

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchUsers());
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Error Loading Users</h3>
        <p style={{ marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={handleRetry}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Try Again
        </button>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p>Make sure json-server is running on port 3001:</p>
          <code style={{ 
            backgroundColor: '#f1f1f1', 
            padding: '5px 10px', 
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            npm run server
          </code>
        </div>
      </div>
    );
  }

  const buttonStyle = (variant: 'edit' | 'delete') => ({
    padding: '8px 16px',
    backgroundColor: variant === 'edit' ? '#ff6b35' : '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  });

  const UserCard = ({ user }: { user: UserDetails }) => (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          {user.photo && (
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              marginBottom: '15px',
              border: '2px solid #ff6b35'
            }}>
              <img 
                src={user.photo as string} 
                alt={user.fullName}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            </div>
          )}
          
          <h3 style={{ 
            margin: '0 0 15px 0', 
            color: '#333',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {user.fullName}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            {[
              ['Constituency', user.constituency],
              ['Party', user.party],
              ['Position', user.position],
              ['Date of Birth', user.dateOfBirth],
              ['Gender', user.gender?.charAt(0).toUpperCase() + user.gender?.slice(1)],
              ['Email', user.email]
            ].filter(([, value]) => value).map(([label, value]) => (
              <div key={label} style={{ 
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                <strong style={{ color: '#ff6b35' }}>{label}:</strong>
                <div style={{ color: '#666', marginTop: '2px' }}>{value}</div>
              </div>
            ))}
          </div>
          
          {user.vision && (
            <div style={{ 
              marginBottom: '15px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '3px solid #ff6b35'
            }}>
              <strong style={{ color: '#333' }}>Vision & Mission:</strong>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                {user.vision}
              </p>
            </div>
          )}
          
          {user.education && user.education.length > 0 && user.education[0].degree && (
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>Education:</strong>
              {user.education.map((edu, index) => (
                <div key={index} style={{ 
                  marginLeft: '15px', 
                  marginBottom: '5px',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <strong>{edu.degree}</strong> from {edu.college} 
                  {edu.graduationYear && ` (${edu.graduationYear})`}
                </div>
              ))}
            </div>
          )}

          {/* Contact Information */}
          {(user.phone || user.address || user.city || user.state) && (
            <div style={{ marginTop: '15px' }}>
              <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>Contact Information:</strong>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {user.phone && <div>📞 {user.phone}</div>}
                {user.address && (
                  <div style={{ marginTop: '3px' }}>
                    📍 {user.address}
                    {user.city && `, ${user.city}`}
                    {user.state && `, ${user.state}`}
                    {user.zipCode && ` ${user.zipCode}`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '20px' }}>
          <button 
            onClick={() => onEditUser(user)} 
            style={buttonStyle('edit')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55a2b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b35'}
          >
            ✏️ Edit
          </button>
          <button 
            onClick={() => handleDelete(user.id!)} 
            style={buttonStyle('delete')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          margin: 0,
          color: '#333',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Registered Users ({users.length})
        </h2>
        <button
          onClick={handleRetry}
          style={{
            padding: '10px 16px',
            backgroundColor: '#ff6b35',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh
        </button>
      </div>
      
      {users.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h3 style={{ color: '#666', marginBottom: '8px' }}>No users registered yet</h3>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Start by adding your first user through the Registration Form
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          {users.map(user => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </div>
  );
};

export default UserList;