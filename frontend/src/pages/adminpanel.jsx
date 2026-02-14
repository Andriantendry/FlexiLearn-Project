import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminpanel.css";

export default function AdminPanel() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVAK, setFilterVAK] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [profileDistribution, setProfileDistribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usersPerPage = 10;
  const adminUserId = localStorage.getItem("user_id");

  // ✅ Mapping lettre -> nom complet
  const mapLetterToProfile = (letter) => {
    const mapping = {
      "V": "Visual",
      "A": "Auditory",
      "K": "Kinesthetic"
    };
    return mapping[letter] || letter;
  };

  // ✅ Mapping lettre -> couleur
  const getProfileColor = (letter) => {
    const colors = {
      "V": "blue",
      "A": "purple",
      "K": "amber"
    };
    return colors[letter] || "blue";
  };

  // Récupérer les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/admin/stats?user_id=${adminUserId}`
        );
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des stats");
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Erreur stats:", err);
        setError(err.message);
      }
    };

    if (adminUserId) {
      fetchStats();
    }
  }, [adminUserId]);

  // Récupérer les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        let url = `http://localhost:8000/admin/users?user_id=${adminUserId}&limit=100`;
        
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs");
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur users:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (adminUserId) {
      fetchUsers();
    }
  }, [adminUserId, searchQuery]);

  // Récupérer la distribution des profils
  useEffect(() => {
    const fetchProfileDistribution = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/admin/analytics/profile-distribution?user_id=${adminUserId}`
        );
        
        if (!response.ok) {
          throw new Error("Erreur distribution");
        }
        
        const data = await response.json();
        setProfileDistribution(data);
      } catch (err) {
        console.error("Erreur distribution:", err);
      }
    };

    if (adminUserId) {
      fetchProfileDistribution();
    }
  }, [adminUserId]);

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId, username) => {
    const confirmation = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'utilisateur ${username} ?`
    );
    
    if (!confirmation) return;
    
    try {
      const response = await fetch(
        `http://localhost:8000/admin/user/${userId}?user_id=${adminUserId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      
      setUsers(users.filter(u => u.id !== userId));
      alert("Utilisateur supprimé avec succès");
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la suppression");
    }
  };

  // Fonction pour obtenir les initiales
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ Filtrage côté frontend par profil
  const filteredUsers = users.filter(user => {
    if (filterVAK === "All") return true;
    
    const profileMapping = {
      "Visual": "V",
      "Auditory": "A",
      "Kinesthetic": "K"
    };
    
    return user.profile_type === profileMapping[filterVAK];
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (!adminUserId) {
    return (
      <div className="admin-panel">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Accès refusé</h2>
          <p>Vous devez être connecté en tant qu'administrateur.</p>
          <button onClick={() => navigate("/signin")}>Se connecter</button>
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="admin-panel">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        {/* Sidebar - identique */}
        <aside className="admin-sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="logo-text">
              <h1>Flexilearn</h1>
              <p>ADMIN PANEL</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <a href="#" className="menu-item">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </a>
            <a href="#" className="menu-item active">
              <span className="material-symbols-outlined">group</span>
              <span>User Management</span>
            </a>
            <a href="#" className="menu-item">
              <span className="material-symbols-outlined">description</span>
              <span>Content Management</span>
            </a>
            <a href="#" className="menu-item">
              <span className="material-symbols-outlined">analytics</span>
              <span>Analytics</span>
            </a>
            <a href="#" className="menu-item">
              <span className="material-symbols-outlined">chat</span>
              <span>Feedback</span>
            </a>
            
            <div className="menu-divider"></div>
            
            <a href="#" className="menu-item">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </a>
          </nav>

          <div className="sidebar-user">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVrxh2tZPtW0zjRnvfcXZelJX0rCEee1HbEJIE8YBMAGFbei05F1SDg5b6IX9F5ZSpcp0EA_gfstgayz8YJydcW2GGVPOKkPbRt5ww5y1htZGNxZxlrtribsLkFJ7isb_ztVd_XVBfj6HHxuDvPnJCJgtKOTgCw2KwceZ-83OuZRVwgU6lEOotahW--q9xYrMw9jzkihvZokxsF8X2Zyyt2OsbzpGTp_hFG62FhtnObOqr9GdVSf7YsR5hcbKcl4-liu2b4ryAWDY" 
              alt="Admin"
              className="user-avatar"
            />
            <div className="user-info">
              <p className="user-name">Admin</p>
              <p className="user-role">Super Admin</p>
            </div>
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <header className="admin-header">
            <div className="header-left">
              <h1>User Management & Analytics</h1>
              <p>Monitor user engagement and learning style distributions.</p>
            </div>
            <div className="header-right">
              <button className="notif-btn">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="export-button">
                <span className="material-symbols-outlined">download</span>
                Export Data
              </button>
            </div>
          </header>

          <div className="admin-content">
            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon blue">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                  <span className="stat-badge green">
                    {stats?.recent_signups > 0 ? `+${stats.recent_signups}` : '0'}
                  </span>
                </div>
                <p className="stat-label">Total Users</p>
                <h3 className="stat-number">
                  {stats?.total_users?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon purple">
                    <span className="material-symbols-outlined">quiz</span>
                  </div>
                  <span className="stat-badge green">
                    {stats?.total_profiles || 0}
                  </span>
                </div>
                <p className="stat-label">VAK Assessments</p>
                <h3 className="stat-number">
                  {stats?.total_profiles?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon amber">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <span className="stat-badge green">
                    {stats?.verified_users || 0}
                  </span>
                </div>
                <p className="stat-label">Verified Users</p>
                <h3 className="stat-number">
                  {stats?.verified_users?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon emerald">
                    <span className="material-symbols-outlined">feedback</span>
                  </div>
                  <span className="stat-badge green">
                    {stats?.total_feedbacks || 0}
                  </span>
                </div>
                <p className="stat-label">Total Feedbacks</p>
                <h3 className="stat-number">
                  {stats?.total_feedbacks?.toLocaleString() || 0}
                </h3>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-section">
              <div className="chart-header">
                <div>
                  <h3>Learning Style Distribution</h3>
                  <p>Distribution des profils d'apprentissage VAK</p>
                </div>
                <div className="chart-legend">
                  <span><span className="dot blue"></span> Visual ({stats?.profiles_by_type?.V || 0})</span>
                  <span><span className="dot purple"></span> Auditory ({stats?.profiles_by_type?.A || 0})</span>
                  <span><span className="dot amber"></span> Kinesthetic ({stats?.profiles_by_type?.K || 0})</span>
                </div>
              </div>
              <div className="chart-area">
                {stats?.profiles_by_type && (
                  <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'flex-end', height: '250px', padding: '2rem' }}>
                    {Object.entries(stats.profiles_by_type).map(([letter, count]) => {
                      const colors = { "V": "#3B82F6", "A": "#A855F7", "K": "#F59E0B" };
                      const labels = { "V": "Visual", "A": "Auditory", "K": "Kinesthetic" };
                      const maxCount = Math.max(...Object.values(stats.profiles_by_type));
                      const height = (count / maxCount) * 200;
                      
                      return (
                        <div key={letter} style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{
                            height: `${height}px`,
                            backgroundColor: colors[letter],
                            borderRadius: '8px 8px 0 0',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {count}
                          </div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                            {labels[letter]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* User Table */}
            <div className="user-table-section">
              <div className="table-controls">
                <div className="search-container">
                  <span className="material-symbols-outlined">search</span>
                  <input 
                    type="text" 
                    placeholder="Search users by name, email or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-buttons">
                  <span className="filter-label">FILTER VAK:</span>
                  <button className={filterVAK === "All" ? "active" : ""} onClick={() => setFilterVAK("All")}>All</button>
                  <button className={filterVAK === "Visual" ? "active" : ""} onClick={() => setFilterVAK("Visual")}>Visual</button>
                  <button className={filterVAK === "Auditory" ? "active" : ""} onClick={() => setFilterVAK("Auditory")}>Auditory</button>
                  <button className={filterVAK === "Kinesthetic" ? "active" : ""} onClick={() => setFilterVAK("Kinesthetic")}>Kinesthetic</button>
                </div>
              </div>

              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
              ) : (
                <>
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>USER</th>
                        <th>VAK PROFILE</th>
                        <th>ROLE</th>
                        <th>STATUS</th>
                        <th>CREATED AT</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => {
                        const color = getProfileColor(user.profile_type);
                        const initials = getInitials(user.username);
                        
                        return (
                          <tr key={user.id}>
                            <td>
                              <div className="user-info-cell">
                                <div className={`user-avatar-circle ${color}`}>
                                  {initials}
                                </div>
                                <div>
                                  <p className="user-name-text">{user.username}</p>
                                  <p className="user-email-text">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              {user.profile_type ? (
                                <span className={`vak-tag ${color}`}>
                                  {/* ✅ Afficher la lettre (V, A, K) */}
                                  {user.profile_type}
                                </span>
                              ) : (
                                <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>No profile</span>
                              )}
                            </td>
                            <td>
                              <span className={`vak-tag ${user.role === 'admin' || user.role === 'superadmin' ? 'purple' : 'blue'}`}>
                                {user.role.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <div className="status-indicator">
                                <span className={`status-dot ${user.is_verified ? "active" : "offline"}`}></span>
                                {user.is_verified ? "Verified" : "Not Verified"}
                              </div>
                            </td>
                            <td className="activity-text">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td>
                              <button 
                                className="more-btn"
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                title="Supprimer l'utilisateur"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="table-pagination">
                    <p>Showing <strong>{indexOfFirstUser + 1} - {Math.min(indexOfLastUser, filteredUsers.length)}</strong> of {filteredUsers.length} users</p>
                    <div className="pagination-buttons">
                      <button 
                        className={currentPage === 1 ? "disabled" : ""}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      
                      {[...Array(Math.min(totalPages, 5))].map((_, index) => (
                        <button
                          key={index + 1}
                          className={currentPage === index + 1 ? "active" : ""}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        className={currentPage === totalPages ? "disabled" : ""}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}