import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Components/Auth_context';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Account() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState('mine');
  const [myPrompts, setMyPrompts] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPublic, setEditedPublic] = useState(true);
  const [message, setMessage] = useState('');

  //Redirect guests to login
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setActiveSection(params.get('section') || 'mine');
  }, [location.search]);


  const fetchAll = () => {
    //Your prompts
    fetch('http://localhost:5000/api/prompts', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setMyPrompts(data.prompts || []);
        else setMessage('Error loading your prompts');
      })
      .catch(() => setMessage('Error loading your prompts'));

    //Saved prompts
    fetch('http://localhost:5000/api/saved-prompts', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSavedPrompts(data.prompts || []);
        else setMessage('Error loading saved prompts');
      })
      .catch(() => setMessage('Error loading saved prompts'));
  };

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  //Start editing
  const startEditing = (prompt) => {
    setEditingId(prompt.id);
    setEditedText(prompt.content);
    setEditedDescription(prompt.description || '');
    setEditedPublic(prompt.public ?? true);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditedText('');
    setEditedDescription('');
    setEditedPublic(true);
  };

  //Save edits
  const saveEdit = async id => {
    const res = await fetch('http://localhost:5000/api/update-prompt', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        content: editedText,
        description: editedDescription,
        public: editedPublic
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMyPrompts(data.prompts || []);
      cancelEditing();
    } else {
      alert(data.error || 'Failed to update prompt');
    }
  };

  //Delete prompt
  const deletePrompt = async id => {
    if (!window.confirm('Delete this prompt?')) return;
    const res = await fetch('http://localhost:5000/api/delete-prompt', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      setMyPrompts(data.prompts || []);
      setSavedPrompts(savedPrompts.filter(p => p.id !== id));
    } else {
      alert(data.error || 'Failed to delete prompt');
    }
  };

  //Save and unsave 
  const toggleFavorite = async (id, fav) => {
    const res = await fetch('http://localhost:5000/api/favorite-prompt', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, favorite: fav }),
    });
    const data = await res.json();
    if (data.success) {
      fetchAll();
    } else {
      alert(data.error || 'Failed to update saved status');
    }
  };

  return (
    <div className="bg-[#B0C4DE] min-h-screen">
      <Navbar />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 p-6 space-y-2">
          <button
            onClick={() => navigate('/account?section=mine')}
            className={`w-full text-left px-4 py-2 rounded ${
              activeSection === 'mine'
                ? 'bg-hover-blue text-[#5A4FCF] font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Your Prompts
          </button>
          <button
            onClick={() => navigate('/account?section=saved')}
            className={`w-full text-left px-4 py-2 rounded ${
              activeSection === 'saved'
                ? 'bg-hover-blue text-[#5A4FCF] font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Saved Prompts
          </button>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </aside>

    
        <section className="w-full md:w-3/4 p-6 space-y-6">
          {/* Your Prompts */}
          {activeSection === 'mine' && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Your Prompts</h3>
              {myPrompts.length === 0 ? (
                <p className="text-gray-500">You haven't created any prompts yet.</p>
              ) : (
                <ul className="space-y-4">
                  {myPrompts.map(prompt => (
                    <li
                      key={prompt.id}
                      className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center"
                    >
                      <div className="flex-1">
                        {editingId === prompt.id ? (
                          <>
                            {/* Content */}
                            <input
                              value={editedText}
                              onChange={e => setEditedText(e.target.value)}
                              className="border p-2 w-full mb-2 rounded"
                            />
                            {/* Description */}
                            <textarea
                              value={editedDescription}
                              onChange={e => setEditedDescription(e.target.value)}
                              className="border p-2 w-full mb-2 rounded"
                              rows="3"
                            />
                            {/* Public toggle */}
                            <label className="inline-flex items-center mb-2">
                              <input
                                type="checkbox"
                                checked={editedPublic}
                                onChange={e => setEditedPublic(e.target.checked)}
                                className="mr-2 h-4 w-4"
                              />
                              <span className="text-sm">Make Public</span>
                            </label>
                            {/* Save/Cancel */}
                            <div className="space-x-2">
                              <button
                                onClick={() => saveEdit(prompt.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 mb-1">
                              {prompt.username}
                            </p>
                            <p className="text-lg">{prompt.content}</p>
                            {prompt.description && (
                              <p className="italic text-gray-700 mb-2">
                                {prompt.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {editingId !== prompt.id && (
                        <div className="mt-2 md:mt-0 flex space-x-2 text-sm">
                          <button
                            onClick={() => startEditing(prompt)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePrompt(prompt.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => toggleFavorite(prompt.id, !prompt.favorite)}
                            className="text-yellow-600 hover:underline"
                          >
                            {prompt.favorite ? 'Unsave' : 'Save'}
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Saved Prompts */}
          {activeSection === 'saved' && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Saved Prompts</h3>
              {savedPrompts.length === 0 ? (
                <p className="text-gray-500">You haven't saved any prompts yet.</p>
              ) : (
                <ul className="space-y-4">
                  {savedPrompts.map(prompt => (
                    <li
                      key={prompt.id}
                      className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                    >
                      <span>
                        {prompt.content}
                        {prompt.description && (
                          <p className="italic text-gray-700">{prompt.description}</p>
                        )}
                      </span>
                      <button
                        onClick={() => toggleFavorite(prompt.id, false)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Unsave
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
