import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createUser, updateUser } from '../store/userSlice';
import { UserDetails, Education } from '../types/user';

interface UserRegistrationFormProps {
  editingUser?: UserDetails | null;
  onCancel?: () => void;
}

type FormStep = 'basic' | 'contact';

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ 
  editingUser = null, 
  onCancel 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<FormStep>('basic');

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
    phone: editingUser?.phone || '',
    email: editingUser?.email || '',
    address: editingUser?.address || '',
    city: editingUser?.city || '',
    state: editingUser?.state || '',
    zipCode: editingUser?.zipCode || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
    
    if (currentStep === 'basic' && !editingUser) {
      setCurrentStep('contact');
      return;
    }
    
    try {
      if (editingUser) {
        await dispatch(updateUser({ ...formData, id: editingUser.id! }));
      } else {
        await dispatch(createUser(formData));
      }
      
      if (!editingUser) {
        setFormData({
          fullName: '', constituency: '', party: '', position: '', dateOfBirth: '',
          gender: 'male', vision: '', education: [{ degree: '', college: '', graduationYear: '' }],
          photo: '', phone: '', email: '', address: '', city: '', state: '', zipCode: '',
        });
        setCurrentStep('basic');
      }
      
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const inputStyle = {
    width: '100%', padding: '15px', border: '2px solid #f0f0f0', borderRadius: '12px',
    fontSize: '16px', backgroundColor: '#fafafa', outline: 'none', boxSizing: 'border-box' as const
  };

  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #ff4500 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px',
        padding: '40px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)', position: 'relative', zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: ['#ff6b35', '#ffa726', '#ff9a56'][i]
              }} />
            ))}
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#333', margin: '0 0 10px 0' }}>
            {editingUser ? 'Edit User' : 'Sign Up'}
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
            {[
              { step: 'basic', num: 1, label: 'Basic Details' },
              { step: 'contact', num: 2, label: 'Contact Details' }
            ].map(({ step, num, label }) => (
              <div key={step} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: currentStep === step ? '#ff6b35' : '#ccc',
                fontWeight: currentStep === step ? '600' : 'normal'
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'white',
                  fontSize: '12px', fontWeight: 'bold',
                  backgroundColor: currentStep === step ? '#ff6b35' : '#ccc'
                }}>
                  {num}
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 'basic' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
                <div onClick={() => fileInputRef.current?.click()} style={{
                  width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  backgroundColor: formData.photo ? 'transparent' : '#ff6b35', color: 'white', fontSize: '24px',
                  backgroundImage: formData.photo ? `url(${formData.photo})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center', border: '3px solid #ff6b35'
                }}>
                  {!formData.photo && '📷'}
                </div>
                <p style={{ color: '#ff6b35', fontWeight: '600', margin: 0 }}>Add Photo</p>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Basic Details</h3>

              {[
                { name: 'fullName', label: 'Full Name', placeholder: 'Enter Full Name' },
                { name: 'constituency', label: 'Constituency', placeholder: 'Enter Constituency' }
              ].map(field => (
                <div key={field.name} style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name as keyof typeof formData] as string}
                    onChange={handleInputChange} placeholder={field.placeholder} required style={inputStyle} />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Select Party You Work For</label>
                  <select name="party" value={formData.party} onChange={handleInputChange} required style={inputStyle}>
                    <option value="">Select Party</option>
                    {['Democratic Party', 'Republican Party', 'Independent', 'Other'].map(party => (
                      <option key={party} value={party}>{party}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Position</label>
                  <select name="position" value={formData.position} onChange={handleInputChange} required style={inputStyle}>
                    <option value="">Select Position</option>
                    {['Mayor', 'Council Member', 'Representative', 'Senator'].map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Date Of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth}
                    onChange={handleInputChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                    {['male', 'female'].map(gender => (
                      <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="radio" name="gender" value={gender} checked={formData.gender === gender}
                          onChange={handleInputChange} style={{ accentColor: '#ff6b35' }} />
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>Vision & Mission</label>
                <textarea name="vision" value={formData.vision} onChange={handleInputChange}
                  placeholder="Type Here..." rows={4} style={{...inputStyle, resize: 'vertical'}} />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0 }}>Education</h3>
                  <button type="button" onClick={addEducation} style={{
                    color: '#ff6b35', background: 'none', border: 'none', fontSize: '16px',
                    fontWeight: '600', cursor: 'pointer', textDecoration: 'underline'
                  }}>+ Add Another Education</button>
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
                      }}>×</button>
                    )}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      {[
                        { field: 'degree', label: 'Degree', placeholder: 'Bachelor/Master' },
                        { field: 'college', label: 'College / University', placeholder: 'College name appears here' },
                        { field: 'graduationYear', label: 'Graduation Year', placeholder: 'YYYY' }
                      ].map(({ field, label, placeholder }) => (
                        <div key={field}>
                          <label style={{...labelStyle, fontSize: '14px'}}>{label}</label>
                          <input type="text" value={edu[field as keyof Education]}
                            onChange={(e) => handleEducationChange(index, field as keyof Education, e.target.value)}
                            placeholder={placeholder} style={{
                              ...inputStyle, padding: '12px', fontSize: '14px', backgroundColor: 'white',
                              border: '2px solid #e0e0e0', borderRadius: '8px'
                            }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'contact' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Contact Details</h3>
              
              {[
                { name: 'phone', label: 'Phone Number', placeholder: 'Enter Phone Number', type: 'tel' },
                { name: 'email', label: 'Email Address', placeholder: 'Enter Email Address', type: 'email' },
                { name: 'address', label: 'Street Address', placeholder: 'Enter Street Address', type: 'text' }
              ].map(field => (
                <div key={field.name} style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>{field.label}</label>
                  <input type={field.type} name={field.name} 
                    value={formData[field.name as keyof typeof formData] as string}
                    onChange={handleInputChange} placeholder={field.placeholder} 
                    required={field.name === 'email'} style={inputStyle} />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {[
                  { name: 'city', label: 'City', placeholder: 'Enter City' },
                  { name: 'state', label: 'State', placeholder: 'Enter State' }
                ].map(field => (
                  <div key={field.name}>
                    <label style={labelStyle}>{field.label}</label>
                    <input type="text" name={field.name} 
                      value={formData[field.name as keyof typeof formData] as string}
                      onChange={handleInputChange} placeholder={field.placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>ZIP Code</label>
                <input type="text" name="zipCode" value={formData.zipCode}
                  onChange={handleInputChange} placeholder="Enter ZIP Code" style={inputStyle} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
            {currentStep === 'contact' && !editingUser && (
              <button type="button" onClick={() => setCurrentStep('basic')} style={{
                padding: '15px 30px', border: '2px solid #ff6b35', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600', backgroundColor: 'white',
                color: '#ff6b35', cursor: 'pointer'
              }}>Previous</button>
            )}
            
            {onCancel && (
              <button type="button" onClick={onCancel} style={{
                padding: '15px 30px', border: '2px solid #ff6b35', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600', backgroundColor: 'white',
                color: '#ff6b35', cursor: 'pointer'
              }}>Cancel</button>
            )}
            
            <button type="submit" disabled={loading} style={{
              padding: '15px 40px', border: 'none', borderRadius: '12px', fontSize: '16px',
              fontWeight: '600', backgroundColor: '#ff6b35', color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
            }}>
              {loading ? 'Saving...' : (
                editingUser ? 'Update' :
                currentStep === 'basic' ? 'Save & Continue' : 'Complete Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationForm;