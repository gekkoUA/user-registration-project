import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createUser, updateUser } from '../store/userSlice';
import { UserDetails, Education } from '../types/user';

interface UserRegistrationFormProps {
  editingUser?: UserDetails | null;
  onCancel?: () => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ 
  editingUser = null, 
  onCancel 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<Omit<UserDetails, 'id'>>({
    fullName: editingUser?.fullName || '',
    constituency: editingUser?.constituency || '',
    party: editingUser?.party || '',
    position: editingUser?.position || '',
    dateOfBirth: editingUser?.dateOfBirth || '',
    gender: editingUser?.gender || 'male',
    vision: editingUser?.vision || '',
    education: editingUser?.education || [
      { degree: '', college: '', graduationYear: '' }
    ],
    photo: editingUser?.photo || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', college: '', graduationYear: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        education: updatedEducation
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
      }
      
      // Reset form after successful submission
      if (!editingUser) {
        setFormData({
          fullName: '',
          constituency: '',
          party: '',
          position: '',
          dateOfBirth: '',
          gender: 'male',
          vision: '',
          education: [{ degree: '', college: '', graduationYear: '' }],
          photo: '',
        });
      }
      
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #ff4500 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                     radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                     radial-gradient(circle at 40% 60%, rgba(255, 200, 100, 0.4) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '10px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ff6b35',
              borderRadius: '50%'
            }} />
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ffa726',
              borderRadius: '50%'
            }} />
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ff9a56',
              borderRadius: '50%'
            }} />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            {editingUser ? 'Edit User' : 'Sign Up'}
          </h1>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ff6b35',
              fontWeight: '600'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#ff6b35',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>1</div>
              Basic Details
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ccc'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#ccc',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px'
              }}>2</div>
              Contact Details
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ccc'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#ccc',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px'
              }}>3</div>
              Verification
            </div>
          </div>
        </div>

        <div>
          {/* Photo Upload */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ff6b35',
              borderRadius: '50%',
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }}>
              📷
            </div>
            <p style={{ color: '#ff6b35', fontWeight: '600', margin: 0 }}>Add Photo</p>
          </div>

          {/* Basic Details */}
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#333', 
            marginBottom: '20px' 
          }}>
            Basic Details
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#555' 
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#fafafa',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#555' 
            }}>
              Constituency
            </label>
            <input
              type="text"
              name="constituency"
              value={formData.constituency}
              onChange={handleInputChange}
              placeholder="Enter Constituency"
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#fafafa',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
            />
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#555' 
              }}>
                Select Party You Work For
              </label>
              <select
                name="party"
                value={formData.party}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#fafafa',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select Party</option>
                <option value="Democratic Party">Democratic Party</option>
                <option value="Republican Party">Republican Party</option>
                <option value="Independent">Independent</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#555' 
              }}>
                Position
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#fafafa',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select Position</option>
                <option value="Mayor">Mayor</option>
                <option value="Council Member">Council Member</option>
                <option value="Representative">Representative</option>
                <option value="Senator">Senator</option>
              </select>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#555' 
              }}>
                Date Of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#fafafa',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#555' 
              }}>
                Gender
              </label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    style={{ accentColor: '#ff6b35' }}
                  />
                  Male
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    style={{ accentColor: '#ff6b35' }}
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#555' 
            }}>
              Vision & Mission
            </label>
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleInputChange}
              placeholder="Type Here..."
              rows={4}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#fafafa',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
            />
          </div>

          {/* Education Section */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#333', 
                margin: 0 
              }}>
                Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                style={{
                  color: '#ff6b35',
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                + Add Another Education
              </button>
            </div>

            {formData.education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                position: 'relative'
              }}>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#ff4757',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ×
                  </button>
                )}
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr', 
                  gap: '15px' 
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#555',
                      fontSize: '14px'
                    }}>
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      placeholder="Bachelor/Master"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#555',
                      fontSize: '14px'
                    }}>
                      College / University
                    </label>
                    <input
                      type="text"
                      value={edu.college}
                      onChange={(e) => handleEducationChange(index, 'college', e.target.value)}
                      placeholder="College name appears here"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#555',
                      fontSize: '14px'
                    }}>
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                      placeholder="YYYY"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            marginTop: '40px'
          }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '15px 30px',
                  border: '2px solid #ff6b35',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: 'white',
                  color: '#ff6b35',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '15px 40px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: '#ff6b35',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
              }}
            >
              {loading ? 'Saving...' : (editingUser ? 'Update' : 'Save & Continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationForm;