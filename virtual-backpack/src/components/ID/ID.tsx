import { useState, useRef, useEffect } from 'react';
import './ID.css';
import Sidebar from '../Sidebar/Sidebar';
import bcrypt from 'bcryptjs'


function salt() {
  let rand = Math.floor(Math.random() * 3);
  return bcrypt.genSaltSync(rand + 10)
}

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

// Course options with codes and full names
const courseOptions = [
  // SHS Programs
  { code: 'STEM', name: 'STEM - Science, Technology, Engineering, and Mathematics Strand' },
  { code: 'ABM', name: 'ABM - Accountancy and Business Management Strand' },
  { code: 'HUMSS', name: 'HUMSS - Humanities and Social Sciences Strand' },
  { code: 'GAS', name: 'GAS - General Academic Strand' },

  // Architecture, Design, and Planning Programs
  { code: 'AR', name: 'AR - Bachelor of Science in Architecture' },
  { code: 'ID', name: 'ID - Bachelor of Science in Industrial Design' },
  { code: 'INT', name: 'INT - Bachelor of Science in Interior Design' },
  { code: 'EP', name: 'EP - Bachelor of Science in Environmental Planning' },
  { code: 'UP', name: 'UP - Bachelor of Science in Urban Planning' },

  // Engineering Programs
  { code: 'BE', name: 'BE - Bachelor of Science in Biological Engineering' },
  { code: 'CE', name: 'CE - Bachelor of Science in Civil Engineering' },
  { code: 'CHE', name: 'CHE - Bachelor of Science in Chemical Engineering' },
  { code: 'CPE', name: 'CPE - Bachelor of Science in Computer Engineering' },
  { code: 'ECE', name: 'ECE - Bachelor of Science in Electronics Engineering' },
  { code: 'EE', name: 'EE - Bachelor of Science in Electrical Engineering' },
  { code: 'ESE', name: 'ESE - Bachelor of Science in Environmental and Sanitary Engineering' },
  { code: 'GSE', name: 'GSE - Bachelor of Science in Geological Science and Engineering' },
  { code: 'IE', name: 'IE - Bachelor of Science in Industrial Engineering' },
  { code: 'ME', name: 'ME - Bachelor of Science in Mechanical Engineering' },
  { code: 'MFGE', name: 'MFGE - Bachelor of Science in Manufacturing Engineering' },
  { code: 'MGTE', name: 'MGTE - Bachelor of Science in Management Engineering' },
  { code: 'MSE', name: 'MSE - Bachelor of Science in Materials Science and Engineering' },
  { code: 'NRGE', name: 'NRGE - Bachelor of Science in Energy Engineering' },

  // Computer Science and Information Technology Programs
  { code: 'CS', name: 'CS - Bachelor of Science in Computer Science' },
  { code: 'DS', name: 'DS - Bachelor of Science in Data Science' },
  { code: 'EMC', name: 'EMC - Bachelor of Science in Entertainment and Multimedia Computing' },
  { code: 'IS', name: 'IS - Bachelor of Science in Information Systems' },
  { code: 'IT', name: 'IT - Bachelor of Science in Information Technology' },

  // Business and Management Programs
  { code: 'ACT', name: 'ACT - Bachelor of Science in Accountancy' },
  { code: 'BA', name: 'BA - Bachelor of Science in Business Administration' },
  { code: 'BIA', name: 'BIA - Bachelor of Science in Business Intelligence and Analytics' },
  { code: 'ENT', name: 'ENT - Bachelor of Science in Entrepreneurship' },
  { code: 'FNT', name: 'FNT - Bachelor of Science in Financial Technology' },
  { code: 'GLM', name: 'GLM - Bachelor of Science in Global Management' },
  { code: 'MKT', name: 'MKT - Bachelor of Science in Marketing' },
  { code: 'REM', name: 'REM - Bachelor of Science in Real Estate Management' },

  // Media, Arts, and Communication Programs
  { code: 'ADA', name: 'ADA - Bachelor of Arts in Advertising Design' },
  { code: 'BMA', name: 'BMA - Bachelor of Arts in Broadcast Media' },
  { code: 'BMMA', name: 'BMMA - Bachelor of Multimedia Arts' },
  { code: 'DF', name: 'DF - Bachelor of Arts in Digital Film' },
  { code: 'DJA', name: 'DJA - Bachelor of Arts in Digital Journalism' },
  { code: 'TCB', name: 'TCB - Bachelor of Science in Technical Communication' },

  // Health and Natural Sciences Programs
  { code: 'BIO', name: 'BIO - Bachelor of Science in Biology' },
  { code: 'CHM', name: 'CHM - Bachelor of Science in Chemistry' },
  { code: 'GEO', name: 'GEO - Bachelor of Science in Geology' },
  { code: 'MDT', name: 'MDT - Bachelor of Science in Medical Technology' },
  { code: 'NRS', name: 'NRS - Bachelor of Science in Nursing' },
  { code: 'PHY', name: 'PHY - Bachelor of Science in Physics' },
  { code: 'PSYA', name: 'PSYA - Bachelor of Arts in Psychology' },
  { code: 'PSYB', name: 'PSYB - Bachelor of Science in Psychology' },

  // Physical Education
  { code: 'BPE', name: 'BPE - Bachelor in Physical Education Major in Sports and Wellness Management' },

  // Double Degree Undergraduate Programs
  { code: 'BMMABMA', name: 'BMMABMA - Bachelor of Arts in Multimedia Arts and Broadcast Media (Double Degree)' },
  { code: 'BMMADJA', name: 'BMMADJA - Bachelor of Arts in Multimedia Arts and Digital Journalism (Double Degree)' },
  { code: 'CCE', name: 'CCE - Bachelor of Science in Chemical Engineering and Chemistry (Double Degree)' },
  { code: 'CEMSE', name: 'CEMSE - Bachelor of Science in Civil Engineering and Materials Science and Engineering (Double Degree)' },
  { code: 'CESE', name: 'CESE - Bachelor of Science in Civil Engineering and Environmental and Sanitary Engineering (Double Degree)' },
  { code: 'MEBE', name: 'MEBE - Bachelor of Science in Mechanical Engineering and Biological Engineering (Double Degree)' },
  { code: 'MEMSE', name: 'MEMSE - Bachelor of Science in Mechanical Engineering and Materials Science and Engineering (Double Degree)' },
  { code: 'PHEC', name: 'PHEC - BS in Physics - BS in Electronics Engineering (Double Degree)' },
  { code: 'PHEE', name: 'PHEE - BS in Physics - BS in Electrical Engineering (Double Degree)' },
  { code: 'PHMS', name: 'PHMS - BS in Physics - BS in Materials Science and Engineering (Double Degree)' },

  // Ladderized and Technology Programs
  { code: 'CETCE', name: 'CETCE - Bachelor of Engineering Technology in Civil Engineering Technology - BS in Civil Engineering' },
  { code: 'CHETCHE', name: 'CHETCHE - Bachelor of Engineering Technology in Chemical Engineering Technology - BS in Chemical Engineering' },
  { code: 'CPETCPE', name: 'CPETCPE - Bachelor of Engineering Technology in Computer Engineering Technology - BS in Computer Engineering' },
  { code: 'ECETECE', name: 'ECETECE - Bachelor of Engineering Technology in Electronics Engineering Technology - BS in Electronics Engineering' },
  { code: 'EETEE', name: 'EETEE - Bachelor of Engineering Technology in Electrical Engineering Technology - BS in Electrical Engineering' },
  { code: 'ESETESE', name: 'ESETESE - Bachelor of Engineering Technology in Environmental and Sanitary Engineering Technology - BS in Environmental and Sanitary Engineering' },
  { code: 'IETIE', name: 'IETIE - Bachelor of Engineering Technology in Industrial Engineering Technology - BS in Industrial Engineering' },
  { code: 'METME', name: 'METME - Bachelor of Engineering Technology in Mechanical Engineering Technology - BS in Mechanical Engineering' },

  // Fully Online Undergraduate Programs (UOx)
  { code: 'CPE-O', name: 'CPE-O - Bachelor of Science in Computer Engineering Online' },
  { code: 'CS-O', name: 'CS-O - Bachelor of Science in Computer Science Online' },
  { code: 'ECE-O', name: 'ECE-O - Bachelor of Science in Electronics Engineering Online' },
  { code: 'EE-O', name: 'EE-O - Bachelor of Science in Electrical Engineering Online' },
  { code: 'IE-O', name: 'IE-O - Bachelor of Science in Industrial Engineering Online' },
  { code: 'IT-O', name: 'IT-O - Bachelor of Science in Information Technology Online' },

  // Post-Graduate Diploma Program
  { code: 'DPE', name: 'DPE - Post-Graduate Diploma in Power Electronics' },

  // Master\'s Programs
  { code: 'MAN', name: 'MAN - Master in Business Analytics' },
  { code: 'MEP', name: 'MEP - Master of Engineering Program' },
  { code: 'MEP-IE', name: 'MEP-IE - Master of Engineering - Industrial Engineering Online' },
  { code: 'MEP-CPE', name: 'MEP-CPE - Master of Engineering - Computer Engineering Online' },
  { code: 'MEP-ECE', name: 'MEP-ECE - Master of Engineering - Electronics Engineering Online' },
  { code: 'MEP-EE', name: 'MEP-EE - Master of Engineering - Electrical Engineering Online' },
  { code: 'MIT', name: 'MIT - Master in Information Technology' },
  { code: 'MIT-O', name: 'MIT-O - Master in Information Technology Online' },
  { code: 'MMA', name: 'MMA - Masters of Arts in Multimedia Arts' },
  { code: 'MPSY', name: 'MPSY - Master of Arts in Psychology' },
  { code: 'MSAR', name: 'MSAR - Master of Science in Architecture' },
  { code: 'MSBE', name: 'MSBE - Master of Science in Biological Engineering' },
  { code: 'MSC', name: 'MSC - Master of Science in Chemistry' },
  { code: 'MSCE', name: 'MSCE - Master of Science in Civil Engineering' },
  { code: 'MSCE-R', name: 'MSCE-R - Master of Science in Civil Engineering by Research' },
  { code: 'MSCHE', name: 'MSCHE - Master of Science in Chemical Engineering by Research' },
  { code: 'MSCEM', name: 'MSCEM - Master of Science in Construction Engineering and Management' },
  { code: 'MSCPE', name: 'MSCPE - Master of Science in Computer Engineering' },
  { code: 'MSCPE-O', name: 'MSCPE-O - Master of Science in Computer Engineering Online' },
  { code: 'MSCPE-R', name: 'MSCPE-R - Master of Science in Computer Engineering by Research' },
  { code: 'MSCS', name: 'MSCS - Master of Science in Computer Science' },
  { code: 'MSECE', name: 'MSECE - Master of Science in Electronics Engineering' },
  { code: 'MSECEM', name: 'MSECEM - Master of Science in Electronics Engineering Major in Microelectronics' },
  { code: 'MSECE-O', name: 'MSECE-O - Master of Science in Electronics Engineering Online' },
  { code: 'MSECE-R', name: 'MSECE-R - Master of Science in Electronics Engineering by Research' },
  { code: 'MSEE', name: 'MSEE - Master of Science in Electrical Engineering' },
  { code: 'MSEE-O', name: 'MSEE-O - Master of Science in Electrical Engineering Online' },
  { code: 'MSEE-R', name: 'MSEE-R - Master of Science in Electrical Engineering by Research' },
  { code: 'MSEEPE', name: 'MSEEPE - Master of Science in Electrical Engineering Major in Power Electronics' },
  { code: 'MSEEPE-R', name: 'MSEEPE-R - Master of Science in Electrical Engineering Major in Power Electronics by Research' },
  { code: 'MSEM', name: 'MSEM - Master of Science in Engineering Management' },
  { code: 'MSIE', name: 'MSIE - Master of Science in Industrial Engineering' },
  { code: 'MSME', name: 'MSME - Master of Science in Mechanical Engineering' },
  { code: 'MSME-O', name: 'MSME-O - Master of Science in Mechanical Engineering Online' },
  { code: 'MSMS', name: 'MSMS - Master of Science in Materials Science and Engineering' },
  { code: 'MSMS-R', name: 'MSMS-R - Master of Science in Materials Science and Engineering' },
  { code: 'MEN', name: 'MEN - Master of Science in Environmental Engineering' },

  // Doctoral Programs (PhD)
  { code: 'DCHM', name: 'DCHM - Doctor of Philosophy in Chemistry' },
  { code: 'DCHE-R', name: 'DCHE-R - Doctor of Philosophy in Chemical Engineering by Research' },
  { code: 'DCPE-R', name: 'DCPE-R - Doctor of Philosophy in Computer Engineering by Research' },
  { code: 'DCS', name: 'DCS - Doctor of Philosophy in Computer Science' },
  { code: 'DECE', name: 'DECE - Doctor of Philosophy in Electronics Engineering' },
  { code: 'DENV', name: 'DENV - Doctor of Philosophy in Environmental Engineering' },
  { code: 'DIE-R', name: 'DIE-R - Doctor of Philosophy in Industrial Engineering by Research' },
  { code: 'DME-R', name: 'DME-R - Doctor of Philosophy in Mechanical Engineering by Research' },
  { code: 'DMSE-R', name: 'DMSE-R - Doctor of Philosophy in Materials Science and Engineering by Research' },

  // Straight BS-MS / BS-PhD / MS-PhD Programs
  { code: 'ACMAN', name: 'ACMAN - BS in Accountancy - Master in Business Analytics' },
  { code: 'AMMA', name: 'AMMA - BA in Multimedia Arts – Master of Arts in Multimedia Arts' },
  { code: 'AMPSY', name: 'AMPSY - BA in Psychology - Master of Arts in Psychology' },
  { code: 'BAMAN', name: 'BAMAN - BS in Business Administration - Master in Business Analytics' },
  { code: 'BMAR', name: 'BMAR - BS in Architecture – Master of Science in Architecture' },
  { code: 'BMBE', name: 'BMBE - BS in Biological Engineering - MS in Biological Engineering' },
  { code: 'BMCE', name: 'BMCE - BS in Civil Engineering – Master of Science in Civil Engineering' },
  { code: 'BMCEM', name: 'BMCEM - BS in Construction Engineering and Management – MS in Construction Engineering and Management' },
  { code: 'BMCS', name: 'BMCS - BS in Computer Science – Master of Science in Computer Science' },
  { code: 'BMECE', name: 'BMECE - BS in Electronics Engineering – Master of Science in Electronics Engineering' },
  { code: 'BMEE', name: 'BMEE - BS in Electrical Engineering - Master of Science in Electrical Engineering' },
  { code: 'BMIE', name: 'BMIE - BS in Industrial Engineering – Master of Science in Industrial Engineering' },
  { code: 'BMME', name: 'BMME - BS in Mechanical Engineering – Master of Science in Mechanical Engineering' },
  { code: 'BMMSE', name: 'BMMSE - BS in Materials Science and Engineering - MS in Materials Science and Engineering' },
  { code: 'BMPSY', name: 'BMPSY - BS in Psychology - Master of Arts in Psychology' },
  { code: 'BMSEM', name: 'BMSEM - BS in Management Engineering – MS in Service Engineering and Management' },
  { code: 'BSMIT', name: 'BSMIT - BS in Information Technology – Master in Information Technology' },
  { code: 'CCPE (CCOE)', name: 'CCPE (CCOE) - BS in Computer Engineering - Master of Science in Computer Engineering' },
  { code: 'CCHE', name: 'CCHE - BS in Chemical Engineering - Master of Science in Chemical Engineering' },
  { code: 'CHEV', name: 'CHEV - BS in Chemical Engineering – Master of Science in Environmental Engineering' },
  { code: 'ISMAN', name: 'ISMAN - BS in Information System – Master in Business Analytics' },
  { code: 'MDENV', name: 'MDENV - MS in Environmental Engineering - PhD in Environmental Engineering' },
  { code: 'SDCHE', name: 'SDCHE - BS in Chemical Engineering - PhD in Chemical Engineering' },
  { code: 'SDCS', name: 'SDCS - BS in Computer Science – PhD in Computer Science' },
  { code: 'SDECE', name: 'SDECE - BS in Electronics Engineering – PhD in Electronics Engineering' }
];

// Year options
const yearOptions = [
  'Grade 11',
  'Grade 12',
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year'
];

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

  // Course/Year dropdown states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [yearSearchTerm, setYearSearchTerm] = useState('');
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

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

  // Update courseYear when course or year changes
  useEffect(() => {
    if (selectedCourse && selectedYear) {
      const courseYear = `${selectedCourse} - ${selectedYear}`;
      setFormData(prev => ({ ...prev, courseYear }));
    }
  }, [selectedCourse, selectedYear]);

  // Parse existing courseYear when editing
  useEffect(() => {
    if (isEditing && idData.courseYear) {
      const parts = idData.courseYear.split(' - ');
      if (parts.length === 2) {
        setSelectedCourse(parts[0]);
        setSelectedYear(parts[1]);
      }
    }
  }, [isEditing, idData.courseYear]);

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

    // Enhanced course/year validation
    if (!selectedCourse || !selectedYear) {
      newErrors.courseYear = 'Both course and year must be selected from the dropdown options';
    } else {
      // Validate that selected course exists in options
      const courseExists = courseOptions.some(course => course.code === selectedCourse);
      const yearExists = yearOptions.includes(selectedYear);

      if (!courseExists) {
        newErrors.courseYear = 'Please select a valid course from the dropdown';
      } else if (!yearExists) {
        newErrors.courseYear = 'Please select a valid year from the dropdown';
      }
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

  // Filter functions for dropdowns
  const filteredCourses = courseOptions.filter(course =>
    course.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const filteredYears = yearOptions.filter(year =>
    year.toLowerCase().includes(yearSearchTerm.toLowerCase())
  );

  // Dropdown handlers
  //const handleCourseSelect = (courseCode: string) => {
  //setSelectedCourse(courseCode);
  //setCourseSearchTerm('');
  //setCourseDropdownOpen(false);
  //};

  //const handleYearSelect = (year: string) => {
  // setSelectedYear(year);
  //setYearSearchTerm('');
  //setYearDropdownOpen(false);
  //};

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
      const hash = bcrypt.hashSync(formData.password, salt())
      const dataToSave: IDData = {
        studentNumber: formData.studentNumber,
        email: formData.email,
        name: formData.name,
        courseYear: formData.courseYear,
        idPicture: formData.idPicture,
        password: hash, // In production, this should be hashed
      };
      setIdData(dataToSave);
      localStorage.setItem('VIRTUAL_ID_DATA', JSON.stringify(dataToSave));
      setCurrentView('display');
      setIsEditing(false);
    }
  };

  // Password verification
  const handlePasswordSubmit = () => {
    bcrypt.compare(passwordInput, idData.password, (err, result) => {
      if (err) {
        // Handle error
        console.error('Error comparing passwords:', err);
        return;
      }

      if (result) {
        setCurrentView('display');
        setPasswordInput('');
        console.log('Passwords match! User authenticated.');
      } else {
        alert('Incorrect password. Please try again.');
        setPasswordInput('');
        console.log('Passwords do not match! Authentication failed.');
      }
    });
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
    setSelectedCourse('');
    setSelectedYear('');
    setCourseSearchTerm('');
    setYearSearchTerm('');
    setCourseDropdownOpen(false);
    setYearDropdownOpen(false);
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
      setSelectedCourse('');
      setSelectedYear('');
      setCourseSearchTerm('');
      setYearSearchTerm('');
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
            <div className="course-year-container" style={{ display: 'flex', gap: '1rem' }}>
              <div className="course-selection" style={{ flex: 1, position: 'relative' }}>
                <label>Course *</label>
                <input
                  type="text"
                  value={selectedCourse ? courseOptions.find(c => c.code === selectedCourse)?.code || '' : courseSearchTerm}
                  onChange={(e) => {
                    setCourseSearchTerm(e.target.value);
                    setSelectedCourse('');
                    setCourseDropdownOpen(true);
                    // Clear course-related errors when typing
                    setErrors(prev => ({ ...prev, courseYear: undefined }));
                  }}
                  onClick={() => setCourseDropdownOpen(true)}
                  onBlur={() => {
                    // Delay closing to allow for selection
                    setTimeout(() => {
                      setCourseDropdownOpen(false);
                      // If no valid course is selected, clear the search term
                      if (!selectedCourse && courseSearchTerm) {
                        const exactMatch = courseOptions.find(course =>
                          course.code.toLowerCase() === courseSearchTerm.toLowerCase() ||
                          course.name.toLowerCase() === courseSearchTerm.toLowerCase()
                        );
                        if (!exactMatch) {
                          setCourseSearchTerm('');
                          setErrors(prev => ({
                            ...prev,
                            courseYear: 'Please select a valid course from the dropdown'
                          }));
                        }
                      }
                    }, 200);
                  }}
                  className={`form-input ${errors.courseYear ? 'error' : ''}`}
                  placeholder="Search for course..."
                  readOnly={selectedCourse !== ''} // Make readonly when course is selected
                />
                {selectedCourse && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourse('');
                      setCourseSearchTerm('');
                      setErrors(prev => ({ ...prev, courseYear: undefined }));
                    }}
                    className="clear-button" // or "clear-button-minimal" for the minimal version
                  >
                    ×
                  </button>
                )}
                {courseDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: '-100%',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1001,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '300px'
                  }}>
                    {filteredCourses.map((course) => (
                      <div
                        key={course.code}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur
                        onClick={() => {
                          setSelectedCourse(course.code);
                          setCourseSearchTerm('');
                          setCourseDropdownOpen(false);
                          setErrors(prev => ({ ...prev, courseYear: undefined }));
                        }}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <strong>{course.code}</strong> - {course.name.split(' - ')[1] || course.name}
                      </div>
                    ))}
                    {filteredCourses.length === 0 && (
                      <div style={{ padding: '10px 12px', color: '#666', fontSize: '14px' }}>
                        No courses found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="year-selection" style={{ flex: 1, position: 'relative' }}>
                <label>Year *</label>
                <input
                  type="text"
                  value={selectedYear || yearSearchTerm}
                  onChange={(e) => {
                    setYearSearchTerm(e.target.value);
                    setSelectedYear('');
                    setYearDropdownOpen(true);
                    // Clear year-related errors when typing
                    setErrors(prev => ({ ...prev, courseYear: undefined }));
                  }}
                  onClick={() => setYearDropdownOpen(true)}
                  onBlur={() => {
                    // Delay closing to allow for selection
                    setTimeout(() => {
                      setYearDropdownOpen(false);
                      // If no valid year is selected, clear the search term
                      if (!selectedYear && yearSearchTerm) {
                        const exactMatch = yearOptions.find(year =>
                          year.toLowerCase() === yearSearchTerm.toLowerCase()
                        );
                        if (!exactMatch) {
                          setYearSearchTerm('');
                          setErrors(prev => ({
                            ...prev,
                            courseYear: 'Please select a valid year from the dropdown'
                          }));
                        }
                      }
                    }, 200);
                  }}
                  className={`form-input ${errors.courseYear ? 'error' : ''}`}
                  placeholder="Search for year..."
                  readOnly={selectedYear !== ''} // Make readonly when year is selected
                />
                {selectedYear && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear('');
                      setYearSearchTerm('');
                      setErrors(prev => ({ ...prev, courseYear: undefined }));
                    }}
                    className="clear-button"
                  >
                    ×
                  </button>
                )}
                {yearDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0%',
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1001,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    maxWidth: '130px'
                  }}>
                    {filteredYears.map((year) => (
                      <div
                        key={year}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur
                        onClick={() => {
                          setSelectedYear(year);
                          setYearSearchTerm('');
                          setYearDropdownOpen(false);
                          setErrors(prev => ({ ...prev, courseYear: undefined }));
                        }}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {year}
                      </div>
                    ))}
                    {filteredYears.length === 0 && (
                      <div style={{ padding: '10px 12px', color: '#666', fontSize: '14px' }}>
                        No years found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
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

      {/* Click outside to close dropdowns */}
      {(courseDropdownOpen || yearDropdownOpen) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999
          }}
          onClick={() => {
            setCourseDropdownOpen(false);
            setYearDropdownOpen(false);
          }}
        />
      )}
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
