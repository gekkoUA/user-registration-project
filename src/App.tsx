import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import UserRegistrationForm from './components/UserRegistrationForm';
import UserList from './components/userList';
import { UserDetails } from './types/user';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'list'>('form');
  const [editingUser, setEditingUser] = useState<UserDetails | null>(null);

  const handleEditUser = (user: UserDetails) => {
    setEditingUser(user);
    setCurrentView('form');
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setCurrentView('list');
  };

  const handleViewChange = (view: 'form' | 'list') => {
    setCurrentView(view);
    if (view === 'form') setEditingUser(null);
  };

  const NavButton = ({ view, label }: { view: 'form' | 'list'; label: string }) => (
    <button
      onClick={() => handleViewChange(view)}
      style={{
        padding: '10px 20px',
        backgroundColor: currentView === view ? '#ff6b35' : 'transparent',
        color: 'white',
        border: '1px solid #ff6b35',
        borderRadius: '6px',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );

  return (
    <Provider store={store}>
      <div className="App">
        <nav style={{
          backgroundColor: '#333',
          padding: '1rem',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <NavButton view="form" label="Registration Form" />
            <NavButton view="list" label="User List" />
          </div>
        </nav>

        {currentView === 'form' ? (
          <UserRegistrationForm 
            editingUser={editingUser} 
            onCancel={editingUser ? handleCancelEdit : undefined}
          />
        ) : (
          <UserList onEditUser={handleEditUser} />
        )}
      </div>
    </Provider>
  );
}

export default App;