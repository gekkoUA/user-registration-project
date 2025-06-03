import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createUser, updateUser } from '../store/userSlice';
import { UserDetails, Education } from '../types/user';

interface UserRegistrationFormProps {
  editingUser?: UserDetails | null;
  onCancel?: () => void;
}

// Shared styles
const inputStyle = {
  width: '100%',
  padding: '15px',
  border: '2px solid #f0f0f0',
  borderRadius: '12px',
  fontSize: '16px',
  backgroundColor: '#fafafa',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#555'
};

const buttonStyle = (primary = false) => ({
  padding: '15px 30px',
  border: primary ? 'none' : '2px solid #ff6b35',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  backgroundColor: primary ? '#ff6b35' : 'white',
  color: primary ? 'white' : '#ff6b35',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: primary ? '0 4px 15px rgba(255, 107, 53, 0.3)' : 'none'
});

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ 
  editingUser = null, 
  onCancel 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);

  const initialFormData = {
    fullName: editingUser?.fullName || '',
    constituency: editingUser?.constituency || '',
    party: editingUser?.party || '',
    position: editingUser?.position || '',
    dateOfBirth: editingUser?.dateOfBirth || '',
    gender: editingUser?.gender || 'male' as const,
    vision: editingUser?.vision || '',
    education: editingUser?.education || [{ degree: '', college: '', graduationYear: '' }],
    photo: editingUser?.photo || '',
  };

  const [formData, setFormData] = useState<Omit<UserDetails, 'id'>>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', college: '', graduationYear: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await dispatch(updateUser({ ...formData, id: editingUser.id! }));
      } else {
        await dispatch(createUser(formData));
        setFormData(initialFormData);
      }
      onCancel?.();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const StepIndicator = ({ step, label, active = false }: { step: number; label: string; active?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: active ? '#ff6b35' : '#ccc' }}>
      <div style={{
        width: '24px', height: '24px', backgroundColor: active ? '#ff6b35' : '#ccc',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '12px', fontWeight: 'bold'
      }}>
        {step}
      </div>
      {label}
    </div>
  );

  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    required = false,
    as = 'input',
    rows,
    children 
  }: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    as?: 'input' | 'select' | 'textarea';
    rows?: number;
    children?: React.ReactNode;
  }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>{label}</label>
      {as === 'input' && (
        <input
          type={type}
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
          onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
        />
      )}
      {as === 'select' && (
        <select
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleInputChange}
          required={required}
          style={inputStyle}
        >
          {children}
        </select>
      )}
      {as === 'textarea' && (
        <textarea
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={rows}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
          onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
        />
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #ff4500 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
        background: `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                     radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                     radial-gradient(circle at 40% 60%, rgba(255, 200, 100, 0.4) 0%, transparent 50%)`
      }} />
      
      <div style={{
        maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px',
        padding: '40px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)', position: 'relative', zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: i === 1 ? '#ff6b35' : i === 2 ? '#ffa726' : '#ff9a56'
              }} />
            ))}
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#333', margin: '0 0 20px 0' }}>
            {editingUser ? 'Edit User' : 'Sign Up'}
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
            <StepIndicator step={1} label="Basic Details" active />
            <StepIndicator step={2} label="Contact Details" />
            <StepIndicator step={3} label="Verification" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Photo Upload */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px', height: '80px', backgroundColor: '#ff6b35', borderRadius: '50%',
              margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '24px', cursor: 'pointer'
            }}>
              📷
            </div>
            <p style={{ color: '#ff6b35', fontWeight: '600', margin: 0 }}>Add Photo</p>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
            Basic Details
          </h3>

          <InputField label="Full Name" name="fullName" placeholder="Enter Full Name" required />
          <InputField label="Constituency" name="constituency" placeholder="Enter Constituency" required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <InputField label="Select Party You Work For" name="party" as="select" required>
              <option value="">Select Party</option>
              <option value="Democratic Party">Democratic Party</option>
              <option value="Republican Party">Republican Party</option>
              <option value="Independent">Independent</option>
              <option value="Other">Other</option>
            </InputField>
            
            <InputField label="Position" name="position" as="select" required>
              <option value="">Select Position</option>
              <option value="Mayor">Mayor</option>
              <option value="Council Member">Council Member</option>
              <option value="Representative">Representative</option>
              <option value="Senator">Senator</option>
            </InputField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <InputField label="Date Of Birth" name="dateOfBirth" type="date" required />
            
            <div>
              <label style={labelStyle}>Gender</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                {['male', 'female'].map(gender => (
                  <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleInputChange}
                      style={{ accentColor: '#ff6b35' }}
                    />
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <InputField 
            label="Vision & Mission" 
            name="vision" 
            as="textarea" 
            placeholder="Type Here..." 
            rows={4} 
          />

          {/* Education Section */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0 }}>Education</h3>
              <button type="button" onClick={addEducation} style={{
                color: '#ff6b35', background: 'none', border: 'none', fontSize: '16px',
                fontWeight: '600', cursor: 'pointer', textDecoration: 'underline'
              }}>
                + Add Another Education
              </button>
            </div>

            {formData.education.map((edu, index) => (
              <div key={index} style={{
                marginBottom: '20px', padding: '20px', backgroundColor: '#f8f9fa',
                borderRadius: '12px', position: 'relative'
              }}>
                {formData.education.length > 1 && (
                  <button type="button" onClick={() => removeEducation(index)} style={{
                    position: 'absolute', top: '10px', right: '10px', background: '#ff4757',
                    color: 'white', border: 'none', borderRadius: '50%', width: '24px',
                    height: '24px', cursor: 'pointer', fontSize: '14px'
                  }}>
                    ×
                  </button>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  {[
                    { field: 'degree', label: 'Degree', placeholder: 'Bachelor/Master' },
                    { field: 'college', label: 'College / University', placeholder: 'College name appears here' },
                    { field: 'graduationYear', label: 'Graduation Year', placeholder: 'YYYY' }
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label style={{ ...labelStyle, fontSize: '14px' }}>{label}</label>
                      <input
                        type="text"
                        value={edu[field as keyof Education]}
                        onChange={(e) => handleEducationChange(index, field as keyof Education, e.target.value)}
                        placeholder={placeholder}
                        style={{
                          ...inputStyle,
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
            {onCancel && (
              <button type="button" onClick={onCancel} style={buttonStyle()}>
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading} style={{
              ...buttonStyle(true),
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Saving...' : (editingUser ? 'Update' : 'Save & Continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationForm;