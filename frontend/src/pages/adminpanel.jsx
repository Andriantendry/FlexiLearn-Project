import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminpanel.css";

export default function AdminPanel() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVAK, setFilterVAK] = useState("All");

  const users = [
    {
      id: 1,
      initials: "JS",
      name: "Julianne Smith",
      email: "j.smith@edu.com",
      vakProfile: "VISUAL",
      status: "Active",
      engagement: 92,
      lastActivity: "2 mins ago",
      color: "blue"
    },
    {
      id: 2,
      initials: "MK",
      name: "Marcus Kane",
      email: "m.kane@provider.net",
      vakProfile: "AUDITORY",
      status: "Active",
      engagement: 65,
      lastActivity: "14 hours ago",
      color: "purple"
    },
    {
      id: 3,
      initials: "TR",
      name: "Tanya Roberts",
      email: "t.roberts@learning.org",
      vakProfile: "KINESTHETIC",
      status: "Offline",
      engagement: 42,
      lastActivity: "3 days ago",
      color: "amber"
    }
  ];

  return (
    <div className="admin-panel">
      <div className="admin-container">
        {/* Sidebar */}
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
              alt="Alex Morgan"
              className="user-avatar"
            />
            <div className="user-info">
              <p className="user-name">Alex Morgan</p>
              <p className="user-role">Super Admin</p>
            </div>
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Header */}
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
                  <span className="stat-badge green">+12.5%</span>
                </div>
                <p className="stat-label">Total Users</p>
                <h3 className="stat-number">12,840</h3>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon purple">
                    <span className="material-symbols-outlined">quiz</span>
                  </div>
                  <span className="stat-badge green">+5.2%</span>
                </div>
                <p className="stat-label">VAK Assessments</p>
                <h3 className="stat-number">8,520</h3>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon amber">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <span className="stat-badge red">-2.4%</span>
                </div>
                <p className="stat-label">Active Sessions</p>
                <h3 className="stat-number">1,204</h3>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon emerald">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <span className="stat-badge green">+7.1%</span>
                </div>
                <p className="stat-label">Avg. Engagement</p>
                <h3 className="stat-number">88.4%</h3>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-section">
              <div className="chart-header">
                <div>
                  <h3>Learning Style Trends</h3>
                  <p>Assessment completions by style over the last 30 days</p>
                </div>
                <div className="chart-legend">
                  <span><span className="dot blue"></span> Visual</span>
                  <span><span className="dot purple"></span> Auditory</span>
                  <span><span className="dot amber"></span> Kinesthetic</span>
                </div>
              </div>
              <div className="chart-area">
                <svg className="chart-svg" viewBox="0 0 900 300" preserveAspectRatio="none">
                  <path d="M0,200 Q100,180 150,190 T300,160 T450,140 T600,100 T750,80 T900,120" 
                    fill="none" stroke="#3B82F6" strokeWidth="3" />
                  <path d="M0,220 Q100,210 150,215 T300,190 T450,180 T600,160 T750,140 T900,160" 
                    fill="none" stroke="#A855F7" strokeWidth="3" />
                  <path d="M0,180 Q100,190 150,175 T300,200 T450,170 T600,190 T750,150 T900,140" 
                    fill="none" stroke="#F59E0B" strokeWidth="3" />
                </svg>
                <div className="chart-labels">
                  <span>01 OCT</span>
                  <span>05 OCT</span>
                  <span>10 OCT</span>
                  <span>15 OCT</span>
                  <span>20 OCT</span>
                  <span>25 OCT</span>
                  <span>30 OCT</span>
                </div>
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

              <table className="user-table">
                <thead>
                  <tr>
                    <th>USER</th>
                    <th>VAK PROFILE</th>
                    <th>STATUS</th>
                    <th>ENGAGEMENT</th>
                    <th>LAST ACTIVITY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info-cell">
                          <div className={`user-avatar-circle ${user.color}`}>
                            {user.initials}
                          </div>
                          <div>
                            <p className="user-name-text">{user.name}</p>
                            <p className="user-email-text">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`vak-tag ${user.color}`}>
                          {user.vakProfile}
                        </span>
                      </td>
                      <td>
                        <div className="status-indicator">
                          <span className={`status-dot ${user.status === "Active" ? "active" : "offline"}`}></span>
                          {user.status}
                        </div>
                      </td>
                      <td>
                        <div className="engagement-progress">
                          <div className="progress-fill" style={{width: `${user.engagement}%`}}></div>
                        </div>
                      </td>
                      <td className="activity-text">{user.lastActivity}</td>
                      <td>
                        <button className="more-btn">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="table-pagination">
                <p>Showing <strong>1 - 3</strong> of 12,840 users</p>
                <div className="pagination-buttons">
                  <button className="disabled">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="active">1</button>
                  <button>2</button>
                  <button>3</button>
                  <button>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}