import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { Plus, LogOut, CheckCircle, Circle, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/auth');
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      if (!err.response || err.response?.status === 401 || err.response?.status === 403) {
        navigate('/auth');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...newTask };
      if (payload.dueDate) {
        // datetime-local gives "YYYY-MM-DDTHH:mm", Spring Boot LocalDateTime expects seconds
        payload.dueDate = payload.dueDate.length === 16 ? payload.dueDate + ':00' : payload.dueDate;
      } else {
        // Default to tomorrow in ISO format without the Z or milliseconds
        const tmrw = new Date(Date.now() + 86400000);
        const offset = tmrw.getTimezoneOffset() * 60000;
        const localTmrw = new Date(tmrw.getTime() - offset);
        payload.dueDate = localTmrw.toISOString().slice(0, 19); 
      }

      await api.post('/tasks', payload);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      let errorMsg = 'Failed to create task!';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') errorMsg += ' ' + err.response.data;
        else errorMsg += ' ' + JSON.stringify(err.response.data);
      }
      alert(errorMsg);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
        dueDate: task.dueDate
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const decodePriorityColor = (priority) => {
    if (!priority) return 'var(--accent-yellow)';
    const p = priority.toLowerCase();
    if (p.includes('high') || p.includes('urgent')) return 'var(--accent-red)';
    if (p.includes('med')) return 'var(--accent-orange)';
    return 'var(--accent-yellow)';
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-1px' }}>
          Lets<span style={{ color: 'var(--accent-orange)' }}>Go</span>
        </h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Create Task
          </button>
          <button className="btn-ghost" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </motion.header>

      {/* Task List */}
      <motion.div layout className="task-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              layout
              key={task.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass"
              style={{
                padding: '25px',
                position: 'relative',
                overflow: 'hidden',
                opacity: task.status === 'Completed' ? 0.7 : 1
              }}
              whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(220, 150, 100, 0.25)' }}
            >
              {/* Priority Glow / Border */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: decodePriorityColor(task.priority),
                boxShadow: `0 0 15px ${decodePriorityColor(task.priority)}`
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', 
                  textDecoration: task.status === 'Completed' ? 'line-through' : 'none' 
                }}>
                  {task.title}
                </h3>
                <button 
                  onClick={() => toggleTaskStatus(task)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.status === 'Completed' ? 'var(--accent-red)' : 'var(--text-muted)', transition: '0.3s' }}
                >
                  {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
                {task.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.5)', padding: '5px 10px', borderRadius: '20px'
                }}>
                  <Clock size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                </span>

                <button 
                  onClick={() => deleteTask(task.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '5px' }}
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {tasks.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)' }}>
          <CheckCircle size={64} style={{ marginBottom: '20px', opacity: 0.5, color: 'var(--accent-yellow)' }} />
          <h2>You're all caught up!</h2>
          <p>No tasks remaining. Time to relax or create a new one.</p>
        </motion.div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass"
              style={{ width: '100%', maxWidth: '500px', padding: '40px', margin: '20px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: '25px', color: 'var(--text-main)', fontSize: '1.8rem' }}>New Task</h2>
              <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input className="input-glass" type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
                <textarea className="input-glass" placeholder="Description" rows="3" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} required style={{ resize: 'none' }} />
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <select className="input-glass" style={{ flex: 1 }} value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                  <input className="input-glass" type="datetime-local" style={{ flex: 1 }} value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Task</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
