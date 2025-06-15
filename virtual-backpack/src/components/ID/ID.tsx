import { useState, useRef, useEffect } from 'react';
import './ID.css';
import Sidebar from '../Sidebar/Sidebar';

interface IDData {
  studentNumber: string;
  email: string;
  name: string;
  courseYear: string;
  idPicture: string;
  password: string;
}

interface ValidationErrors {
  studentNumber?: string;
  email?: string;
  name?: string;
  courseYear?: string;
  idPicture?: string;
  password?: string;
  confirmPassword?: string;
}

const ID: React.FC = () => {
  // State management
  const [currentView, setCurrentView] = useState<'form' | 'display' | 'edit' | 'password'>('form');
  const [idData, setIdData] = useState<IDData>({
    studentNumber: '',
    email: '',
    name: '',
    courseYear: '',
    idPicture: '',
    password: ''
  });
  const [formData, setFormData] = useState<IDData & { confirmPassword?: string }>({
    studentNumber: '',
    email: '',
    name: '',
    courseYear: '',
    idPicture: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordInput, setPasswordInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved ID data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('VIRTUAL_ID_DATA');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setIdData(parsedData);
        setCurrentView('password'); // Show password prompt first
      } catch (error) {
        console.error('Error loading saved ID data:', error);
        localStorage.removeItem('VIRTUAL_ID_DATA');
      }
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = 'Student Number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.courseYear.trim()) {
      newErrors.courseYear = 'Course/Year is required';
    }

    if (!formData.idPicture) {
      newErrors.idPicture = 'ID Picture is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image upload handling
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        idPicture: 'Please upload a valid image file (JPG, PNG, GIF)'
      }));
      return;
    }

    // File size validation (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        idPicture: 'Image size must be less than 2MB'
      }));
      return;
    }

    // Clear previous errors
    setErrors(prev => ({ ...prev, idPicture: undefined }));

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setFormData(prev => ({ ...prev, idPicture: imageData }));
    };
    reader.readAsDataURL(file);
  };

  // Form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const dataToSave: IDData = {
        studentNumber: formData.studentNumber,
        email: formData.email,
        name: formData.name,
        courseYear: formData.courseYear,
        idPicture: formData.idPicture,
        password: formData.password // In production, this should be hashed
      };
      
      setIdData(dataToSave);
      localStorage.setItem('VIRTUAL_ID_DATA', JSON.stringify(dataToSave));
      setCurrentView('display');
      setIsEditing(false);
    }
  };

  // Password verification
  const handlePasswordSubmit = () => {
    if (passwordInput === idData.password) {
      setCurrentView('display');
      setPasswordInput('');
    } else {
      alert('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  // Edit mode handlers
  const handleEdit = () => {
    setFormData({
      ...idData,
      confirmPassword: idData.password
    });
    setIsEditing(true);
    setCurrentView('form');
    setErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentView('display');
    setFormData({
      studentNumber: '',
      email: '',
      name: '',
      courseYear: '',
      idPicture: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  // Reset/Delete ID
  const handleDeleteID = () => {
    if (window.confirm('Are you sure you want to delete your Virtual ID? This action cannot be undone.')) {
      localStorage.removeItem('VIRTUAL_ID_DATA');
      setIdData({
        studentNumber: '',
        email: '',
        name: '',
        courseYear: '',
        idPicture: '',
        password: ''
      });
      setFormData({
        studentNumber: '',
        email: '',
        name: '',
        courseYear: '',
        idPicture: '',
        password: '',
        confirmPassword: ''
      });
      setCurrentView('form');
      setIsEditing(false);
    }
  };

  // Render password prompt
  const renderPasswordPrompt = () => (
    <div className="password-prompt">
      <div className="password-card">
        <h3>Enter Password</h3>
        <p>Please enter your password to view your Virtual ID</p>
        <div>
          <div className="form-group">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="form-input"
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
          </div>
          <div className="button-group">
            <button onClick={handlePasswordSubmit} className="btn-primary">
              View ID
            </button>
            <button 
              onClick={() => setCurrentView('form')}
              className="btn-secondary"
            >
              Create New ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render form
  const renderForm = () => (
    <div className="id-form">
      <h2>{isEditing ? 'Edit Virtual ID' : 'Create Virtual ID'}</h2>
      
      <div className="virtual-id-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="studentNumber">Student Number *</label>
            <input
              type="text"
              id="studentNumber"
              value={formData.studentNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
              className={`form-input ${errors.studentNumber ? 'error' : ''}`}
              placeholder="Enter your student number"
            />
            {errors.studentNumber && <span className="error-message">{errors.studentNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="courseYear">Course/Year *</label>
            <input
              type="text"
              id="courseYear"
              value={formData.courseYear}
              onChange={(e) => setFormData(prev => ({ ...prev, courseYear: e.target.value }))}
              className={`form-input ${errors.courseYear ? 'error' : ''}`}
              placeholder="e.g., Computer Science - 3rd Year"
            />
            {errors.courseYear && <span className="error-message">{errors.courseYear}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>ID Picture</h3>
          
          <div className="form-group">
            <label>Upload ID Picture *</label>
            <div className="image-upload-section">
              {formData.idPicture ? (
                <div className="image-preview">
                  <img src={formData.idPicture} alt="ID Preview" />
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, idPicture: '' }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="btn-remove"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="upload-area">
                  <div className="upload-placeholder">
                    <span>📷</span>
                    <p>Click to upload your ID picture</p>
                    <small>Supported formats: JPG, PNG, GIF (Max 2MB)</small>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                style={{ display: 'none' }}
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-upload"
              >
                {formData.idPicture ? 'Change Picture' : 'Upload Picture'}
              </button>
            </div>
            {errors.idPicture && <span className="error-message">{errors.idPicture}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Security</h3>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter a password (min 6 characters)"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleSubmit} className="btn-primary">
            {isEditing ? 'Update ID' : 'Generate Virtual ID'}
          </button>
          {isEditing && (
            <button onClick={handleCancelEdit} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render ID display
  const renderIDDisplay = () => (
    <div className="id-display">
      <h2>Virtual ID</h2>
      
      <div className="virtual-id-card">
        <div className="id-header">
          <h3>STUDENT IDENTIFICATION</h3>
        </div>
        
        <div className="id-body">
          <div className="id-photo">
            <img src={idData.idPicture} alt="Student ID" />
          </div>
          
          <div className="id-info">
            <div className="info-row">
              <span className="label">Student Number:</span>
              <span className="value">{idData.studentNumber}</span>
            </div>
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{idData.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Course/Year:</span>
              <span className="value">{idData.courseYear}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{idData.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="id-actions">
        <button onClick={handleEdit} className="btn-secondary">
          Edit ID
        </button>
        <button onClick={handleDeleteID} className="btn-danger">
          Delete ID
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Sidebar />
      <div className="id-container">
        {currentView === 'password' && renderPasswordPrompt()}
        {currentView === 'form' && renderForm()}
        {currentView === 'display' && renderIDDisplay()}
      </div>
    </>
  );
};

export default ID;