import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Key, BookOpen, Save } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, updateContextUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courseForm, setCourseForm] = useState({ course: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  
  const [courseMsg, setCourseMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && user.course) {
      setCourseForm({ course: user.course });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCourseUpdate = async (e) => {
    e.preventDefault();
    setCourseMsg({ type: '', text: '' });
    setIsUpdating(true);

    try {
      const res = await api.put('/update-course', { course: courseForm.course });
      updateContextUser({ course: res.data.course });
      setCourseMsg({ type: 'success', text: 'Course updated successfully!' });
    } catch (err) {
      setCourseMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update course' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    setIsUpdating(true);

    try {
      await api.put('/update-password', passwordForm);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name}!</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600' }}>Student Profile</h3>
          <div className="profile-info">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{user.name}</h4>
              <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div>
            <p className="form-label mb-2">Current Course</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--input-bg)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <BookOpen size={18} className="text-accent" />
              <span>{user.course}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Update Course Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} className="text-accent" />
              Change Course
            </h3>
            
            {courseMsg.text && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', 
                background: courseMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid var(--${courseMsg.type}-color)`,
                color: `var(--${courseMsg.type}-color)`, textAlign: 'center' }}>
                {courseMsg.text}
              </div>
            )}

            <form onSubmit={handleCourseUpdate}>
              <div className="form-group">
                <label className="form-label">New Course</label>
                <input
                  type="text"
                  className="form-input"
                  value={courseForm.course}
                  onChange={(e) => setCourseForm({ course: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={isUpdating || courseForm.course === user.course}>
                <Save size={18} />
                Update Course
              </button>
            </form>
          </div>

          {/* Update Password Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={20} className="text-accent" />
              Update Password
            </h3>
            
            {passwordMsg.text && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', 
                background: passwordMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid var(--${passwordMsg.type}-color)`,
                color: `var(--${passwordMsg.type}-color)`, textAlign: 'center' }}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={isUpdating}>
                <Save size={18} />
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
