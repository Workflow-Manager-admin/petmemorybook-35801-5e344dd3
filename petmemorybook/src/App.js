import React, { useState } from 'react';
import './App.css';

/**
 * Color variables (from spec):
 * --primary:   #F7C59F  (warm peach)
 * --secondary: #A1C6EA  (calm blue)
 * --accent:    #F67280  (muted red-pink)
 * We'll apply with inline and extra CSS where needed, on top of template's base CSS.
 */

/**
 * Enhancements for PetMemoryBook:
 * - Functional "Add Memory": form opens, memory is saved with date, description, and multi-photo upload.
 * - Enable file/photo upload and preview for Photos and Add Memory.
 */

function App() {
  // Track nav state and profile image upload (stub for now)
  const [route, setRoute] = useState("home");
  const [petProfileUrl, setPetProfileUrl] = useState(null);

  // Timeline (memories)
  const [memories, setMemories] = useState([]); // {date, text, photos: [base64]}
  const [addMemoryOpen, setAddMemoryOpen] = useState(false);
  const [memoryForm, setMemoryForm] = useState({
    date: "",
    text: "",
    files: [],
    previews: [],
  });

  // Photos (global uploaded images)
  const [photos, setPhotos] = useState([]);

  // Milestones state
  const [milestones, setMilestones] = useState([]); // {type, description, date}
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    type: "",
    description: "",
    date: "",
  });

  // Handler for fake navigation (no router)
  const go = (nav) => setRoute(nav);

  // Profile image
  const onProfilePicChange = e => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = evt => setPetProfileUrl(evt.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Utility: preview multiple images as dataURL
  function filesToDataURLs(fileList, cb) {
    if (!fileList || fileList.length === 0) cb([]);
    let left = fileList.length;
    const arr = [];
    Array.from(fileList).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = e => {
        arr[i] = e.target.result;
        left--;
        if (left === 0) cb(arr);
      };
      reader.readAsDataURL(file);
    });
  }

  // Handle Add Memory open/close
  const handleAddMemoryClick = () => {
    setAddMemoryOpen(true);
    setMemoryForm({
      date: "",
      text: "",
      files: [],
      previews: [],
    });
  };

  const handleMemoryFormChange = e => {
    const { name, value } = e.target;
    setMemoryForm(mem => ({ ...mem, [name]: value }));
  };

  // File input for Add Memory
  const handleMemoryFilesChange = e => {
    const files = Array.from(e.target.files);
    setMemoryForm(mem => ({ ...mem, files, previews: [] }));
    filesToDataURLs(files, (previews) =>
      setMemoryForm(mem => ({ ...mem, previews }))
    );
  };

  // Submit new memory
  const handleAddMemorySubmit = e => {
    e.preventDefault();
    if (!memoryForm.date || !memoryForm.text) return;
    setMemories(mems =>
      [
        ...mems,
        {
          date: memoryForm.date,
          text: memoryForm.text,
          photos: memoryForm.previews
        }
      ].sort((a, b) => (a.date < b.date ? -1 : 1))
    );
    // Add to global photos
    setPhotos(photosArr => ([
      ...photosArr,
      ...memoryForm.previews.map(img => ({
        src: img,
        key: Math.random().toString(36).slice(2)
      }))
    ]));
    setAddMemoryOpen(false);
    setMemoryForm({
      date: "",
      text: "",
      files: [],
      previews: [],
    });
  };

  // Photos upload (separate from Add Memory)
  const handlePhotosInputChange = (e) => {
    const files = Array.from(e.target.files);
    filesToDataURLs(files, (previews) => {
      setPhotos(arr =>
        [
          ...arr,
          ...previews.map(img => ({
            src: img,
            key: Math.random().toString(36).slice(2)
          }))
        ]
      );
    });
  };

  // PUBLIC_INTERFACE
  // Open Add Milestone form
  const handleAddMilestoneClick = () => {
    setAddMilestoneOpen(true);
    setMilestoneForm({
      type: "",
      description: "",
      date: "",
    });
  };

  // PUBLIC_INTERFACE
  // Handle form changes for Milestone
  const handleMilestoneFormChange = (e) => {
    const { name, value } = e.target;
    setMilestoneForm(form => ({
      ...form,
      [name]: value
    }));
  };

  // PUBLIC_INTERFACE
  // Submit a new milestone
  const handleAddMilestoneSubmit = (e) => {
    e.preventDefault();
    if (!milestoneForm.type || !milestoneForm.description || !milestoneForm.date) return;
    setMilestones(mils =>
      [
        ...mils,
        {
          type: milestoneForm.type,
          description: milestoneForm.description,
          date: milestoneForm.date
        }
      ].sort((a, b) => (a.date < b.date ? -1 : 1))
    );
    setAddMilestoneOpen(false);
    setMilestoneForm({
      type: "",
      description: "",
      date: "",
    });
  };

  // Nav structure
  const NAV = [
    { key: "home", label: "Home" },
    { key: "timeline", label: "Timeline" },
    { key: "photos", label: "Photos" },
    { key: "milestones", label: "Milestones" },
    { key: "scrapbook", label: "Scrapbook" },
    { key: "share", label: "Share" }
  ];

  // Main content (with new interactive features)
  function renderMain() {
    switch(route) {
      case "home":
        return (
          <div className="petbook-hero">
            <div className="petbook-profile-upload-block">
              <label htmlFor="profile-pic-upload" style={{ cursor: "pointer" }}>
                {petProfileUrl ?
                  <img
                    src={petProfileUrl}
                    alt="Pet Profile"
                    className="petbook-profile-image"
                  />
                  :
                  <span className="petbook-paw-bg">
                    <svg width="120" height="120" viewBox="0 0 110 110" fill="none">
                      <ellipse cx="35" cy="35" rx="24" ry="28" fill="#A1C6EA" />
                      <ellipse cx="75" cy="39" rx="22" ry="24" fill="#F7C59F"/>
                      <ellipse cx="62" cy="77" rx="21" ry="25" fill="#A1C6EA"/>
                      <ellipse cx="38" cy="74" rx="21" ry="25" fill="#F7C59F"/>
                      <ellipse cx="55" cy="70" rx="26" ry="28" fill="#F67280" />
                    </svg>
                  </span>
                }
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onProfilePicChange}
                />
              </label>
              <div className="petbook-profile-caption">
                {petProfileUrl ? "Your Pet's Profile Photo" : "Upload your pet's profile image"}
              </div>
            </div>
            <h1 className="petbook-title">Welcome to PetMemoryBook</h1>
            <div className="petbook-description">
              Create a beautiful, lasting memory book for your beloved pet. <br />
              Add memories, photos, milestones, and more &mdash; all in one warm, pet-friendly journal.
            </div>
          </div>
        );
      case "timeline":
        return (
          <section className="petbook-section">
            <h2 className="petbook-section-title">Timeline</h2>
            <div className="petbook-section-description">
              All your added memories in chronological order. Add your first memory below!
            </div>

            <div className="petbook-timeline-placeholder">
              {/* Add Memory Button */}
              {!addMemoryOpen && (
                <button className="btn petbook-btn-accent" style={{ marginBottom: 16 }} onClick={handleAddMemoryClick}>
                  + Add Memory
                </button>
              )}

              {/* Add Memory Form */}
              {addMemoryOpen && (
                <form onSubmit={handleAddMemorySubmit} style={{
                  background: "#fff8f7", border: "1.5px solid #F67280",
                  borderRadius: 8, padding: 18, marginBottom: 18, maxWidth: 420
                }}>
                  <div style={{ marginBottom: 10 }}>
                    <label>Date:<br/>
                      <input
                        type="date"
                        name="date"
                        value={memoryForm.date}
                        onChange={handleMemoryFormChange}
                        required
                        style={{ width: "100%", padding: 6, borderRadius: 3, border: "1px solid #DFB8A9" }}
                      /></label>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>Description:<br/>
                      <textarea
                        name="text"
                        value={memoryForm.text}
                        onChange={handleMemoryFormChange}
                        rows={3}
                        required
                        style={{ width: "100%", padding: 6, resize: "vertical", borderRadius: 3, border: "1px solid #DFB8A9" }}
                        placeholder="Share your memory..."
                      ></textarea>
                    </label>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>
                      Photos: <br/>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMemoryFilesChange}
                        style={{ marginTop: 5 }}
                      />
                    </label>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {memoryForm.previews.map((src, i) => (
                        <img key={i} src={src} style={{
                          width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid #eee"
                        }} alt={"preview"}/>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn petbook-btn-accent" style={{ marginRight: 10 }}>Add</button>
                  <button type="button" className="btn petbook-btn-secondary"
                    onClick={() => setAddMemoryOpen(false)}>Cancel</button>
                </form>
              )}

              {/* Timeline Memories */}
              {memories.length === 0 ? (
                <div className="petbook-timeline-empty">
                  <span style={{color: "#999"}}>No memories yet. Your story begins here!</span>
                </div>
              ) : (
                <div>
                  {[...memories].sort((a, b) => (a.date > b.date ? 1 : -1)).map((mem, idx) => (
                    <div key={mem.date + '-' + idx}
                      style={{
                        background: "#fff",
                        border: "1.2px solid #e6d0c6",
                        borderRadius: 8,
                        padding: "14px 18px",
                        marginBottom: 18,
                        boxShadow: "0 2px 12px 0 #f7c6bd11"
                      }}>
                      <div style={{fontWeight: 600, color: "#F67280", marginBottom: 4}}>
                        {mem.date}
                      </div>
                      <div style={{marginBottom: 6, color: "#975c3f"}}>
                        {mem.text}
                      </div>
                      {mem.photos && mem.photos.length > 0 &&
                        <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                          {mem.photos.map((src, i) => (
                            <img key={i} src={src} alt={"memory-pic"} style={{
                              width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid #eee"
                            }}/>
                          ))}
                        </div>
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      case "photos":
        return (
          <section className="petbook-section">
            <h2 className="petbook-section-title">Photos</h2>
            <div className="petbook-section-description">
              Upload and view your pet's favorite photos. All your photos appear in the scrapbook.
            </div>
            <div className="petbook-photos-placeholder">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosInputChange}
                style={{ margin: "16px 0" }}
                title="Choose photos to upload"
              />
              <div style={{display: "flex", flexWrap:"wrap", gap: 10}}>
                {photos.length === 0 && (
                  <span style={{color: "#999", marginTop: 8}}>No photos uploaded yet.</span>
                )}
                {photos.map(photo =>
                  <img key={photo.key} src={photo.src} alt="user-upload"
                    style={{
                      width: 90, height: 90, objectFit: "cover", borderRadius: '8px',
                      border: "1px solid #eee", background: "#f8f8f8"
                    }}
                  />
                )}
              </div>
            </div>
          </section>
        );
      case "milestones":
        return (
          <section className="petbook-section">
            <h2 className="petbook-section-title">Milestones</h2>
            <div className="petbook-section-description">
              Celebrate important moments in your pet’s life: birthdays, adoption days, more.
            </div>
            <div className="petbook-milestones-placeholder">
              {/* Add Milestone Button */}
              {!addMilestoneOpen && (
                <button
                  className="btn petbook-btn-secondary"
                  style={{ marginBottom: 16 }}
                  onClick={handleAddMilestoneClick}
                >
                  + Add Milestone
                </button>
              )}

              {/* Add Milestone Form */}
              {addMilestoneOpen && (
                <form
                  onSubmit={handleAddMilestoneSubmit}
                  style={{
                    background: "#f8fbff",
                    border: "1.5px solid #A1C6EA",
                    borderRadius: 8,
                    padding: 18,
                    marginBottom: 18,
                    maxWidth: 420,
                  }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <label>
                      Date:<br />
                      <input
                        type="date"
                        name="date"
                        value={milestoneForm.date}
                        onChange={handleMilestoneFormChange}
                        required
                        style={{
                          width: "100%",
                          padding: 6,
                          borderRadius: 3,
                          border: "1px solid #A1C6EA",
                        }}
                      />
                    </label>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>
                      Milestone Type:
                      <select
                        name="type"
                        value={milestoneForm.type}
                        onChange={handleMilestoneFormChange}
                        required
                        style={{
                          width: "100%",
                          padding: 6,
                          borderRadius: 3,
                          border: "1px solid #A1C6EA",
                          marginTop: 3,
                        }}
                      >
                        <option value="">-- Select --</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Adoption">Adoption Day</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="First Walk">First Walk</option>
                        <option value="Achievement">Major Achievement</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>
                      Description:<br />
                      <textarea
                        name="description"
                        value={milestoneForm.description}
                        onChange={handleMilestoneFormChange}
                        rows={2}
                        required
                        style={{
                          width: "100%",
                          padding: 6,
                          resize: "vertical",
                          borderRadius: 3,
                          border: "1px solid #A1C6EA",
                        }}
                        placeholder="Describe this special milestone..."
                      ></textarea>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn petbook-btn-secondary"
                    style={{ marginRight: 10 }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn petbook-btn-accent"
                    onClick={() => setAddMilestoneOpen(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}

              {/* Milestone Entries */}
              {milestones.length === 0 ? (
                <span style={{ color: "#999" }}>
                  No milestones yet. Add your first one!
                </span>
              ) : (
                <div>
                  {[...milestones].sort((a, b) =>
                    a.date > b.date ? 1 : -1
                  ).map((ms, idx) => (
                    <div
                      key={ms.date + '-' + ms.type + '-' + idx}
                      style={{
                        background: "#fff",
                        border: "1.2px solid #A1C6EA",
                        borderRadius: 8,
                        padding: "14px 18px",
                        marginBottom: 16,
                        boxShadow: "0 2px 12px 0 #c6e3fa21",
                      }}
                    >
                      <div style={{ fontWeight: 600, color: "#2196F3", marginBottom: 3 }}>
                        {ms.date} &mdash; <span style={{ color: "#3F51B5", fontWeight: 500 }}>{ms.type}</span>
                      </div>
                      <div style={{ marginBottom: 3, color: "#07518e" }}>
                        {ms.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      case "scrapbook":
        return (
          <section className="petbook-section">
            <h2 className="petbook-section-title">Scrapbook</h2>
            <div className="petbook-section-description">
              Your printable pet memory scrapbook. It updates automatically with your photos and milestones.
            </div>
            <div className="petbook-scrapbook-placeholder">
              {/* Scrapbook: Show all milestones and photos */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ color: "#A1C6EA", fontWeight: 600, fontSize: 19, margin: "10px 0 8px 0" }}>
                  All Milestones
                </h3>
                {milestones.length === 0 ? (
                  <span style={{ color: "#bbb" }}>No milestones yet.</span>
                ) : (
                  <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                    {[...milestones].sort((a, b) => a.date > b.date ? 1 : -1).map((ms, idx) => (
                      <li
                        key={ms.date + '-' + ms.type + '-' + idx}
                        style={{
                          background: "#F7FAFF",
                          border: "1.2px solid #A1C6EA",
                          borderRadius: 8,
                          padding: "12px 18px",
                          marginBottom: 10,
                          color: "#38454f"
                        }}
                      >
                        <strong style={{ color: "#2196F3" }}>{ms.type}</strong> ({ms.date}):<br />
                        <span style={{ color: "#2e4153" }}>{ms.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 style={{ color: "#F7C59F", fontWeight: 600, fontSize: 19, margin: "10px 0 8px 0" }}>
                  All Photos
                </h3>
                {photos.length === 0 ? (
                  <span style={{ color: "#bbb" }}>No photos uploaded yet.</span>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {photos.map(photo => (
                      <img
                        key={photo.key}
                        src={photo.src}
                        alt="scrapbook-upload"
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #eee",
                          background: "#f8f8f8",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 26 }}>
                <span style={{ color: "#999" }}>
                  Scrapbook preview and print/export controls go here.
                </span>
              </div>
            </div>
          </section>
        );
      case "share":
        return (
          <section className="petbook-section">
            <h2 className="petbook-section-title">Shareable Story Timeline</h2>
            <div className="petbook-section-description">
              Share your pet’s story with family and friends via a private or public link.
            </div>
            <div className="petbook-share-placeholder">
              <button className="btn petbook-btn-primary" disabled>Copy Share Link</button>
              <span style={{color: "#999", marginLeft: 16}}>Sharing coming soon.</span>
            </div>
          </section>
        );
      default:
        return null;
    }
  }

  return (
    <div className="app" style={{ background: "#FCFAF7" }}>
      {/* Navigation Bar */}
      <nav className="navbar petbook-navbar" style={{
        background: "white",
        borderBottom: "2px solid #f7c59f",
        color: "#432006",
        boxShadow: "0 4px 16px 0 rgba(80,35,0,0.06)"
      }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="logo" style={{ fontWeight: 700, fontSize: 22, letterSpacing: "0.5px", color: "#A0845C" }}>
              <span className="logo-symbol" style={{
                color: "#F67280", fontSize: 32, lineHeight: 1,
                verticalAlign: "middle", marginRight: 6
              }}>🐾</span> PetMemoryBook
            </div>
            <div className="petbook-nav-menu" style={{ display: "flex", gap: 18 }}>
              {NAV.map(item => (
                <button
                  key={item.key}
                  className={`btn petbook-nav-btn${route === item.key ? " petbook-nav-btn-active" : ""}`}
                  style={{
                    background: "none",
                    color: route === item.key ? "#F67280" : "#786957",
                    borderBottom: route === item.key ? "3px solid #F67280" : "2px solid transparent",
                    borderRadius: 0,
                    boxShadow: "none",
                    fontWeight: 500,
                    fontSize: 17,
                    padding: "6px 0 7px 0",
                  }}
                  onClick={() => go(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        <div className="container" style={{ maxWidth: 800, paddingTop: 120, paddingBottom: 48 }}>
          {renderMain()}
        </div>
      </main>

      {/* Subtle footer (optional) */}
      <footer style={{
        textAlign: "center", color: "#A1C6EA", fontSize: 14, padding: "16px 0 6px 0", opacity: 0.7
      }}>
        &copy; {new Date().getFullYear()} PetMemoryBook &ndash; Your Pet’s Story. All rights reserved.
      </footer>

      {/* Inline style for extra pet-themed color accents */}
      <style>{`
        .petbook-hero {
          display: flex; flex-direction: column; align-items: center; margin-bottom: 32px;
        }
        .petbook-profile-upload-block {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .petbook-profile-image {
          border-radius: 50%;
          width: 120px;
          height: 120px;
          object-fit: cover;
          border: 3px solid #A1C6EA;
          background: #F7C59F08 center/cover;
          box-shadow: 0 2px 10px 0 #E7CDAD44;
        }
        .petbook-paw-bg {
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; background: #FCFAF7;
          width: 122px; height: 122px;
          margin-bottom: 2px;
          box-shadow: 0 2px 10px 0 #A1C6EA33;
          border: 2px dashed #A1C6EA44;
        }
        .petbook-profile-caption {
          font-size: 1rem;
          color: #786957;
          margin-bottom: 8px;
          margin-top: 6px;
        }
        .petbook-title {
          color: #F67280; font-size: 2.3rem; font-weight: 700; margin: 16px 0 6px 0; letter-spacing: 0.5px;
        }
        .petbook-description {
          color: #786957; font-size: 1.2rem; margin-bottom: 16px; max-width: 480px;
        }
        .petbook-section {
          padding: 10px 0 20px 0;
        }
        .petbook-section-title {
          color: #F67280; font-size: 2rem; font-weight: 700; margin-bottom: 4px;
        }
        .petbook-section-description {
          color: #A0845C; font-size: 1.05rem; margin-bottom: 22px;
        }
        .petbook-btn-accent {
          background-color: #F67280 !important;
        }
        .petbook-btn-accent:hover {
          background-color: #F55772 !important;
        }
        .petbook-btn-secondary {
          background-color: #A1C6EA !important;
          color: #fff !important;
        }
        .petbook-btn-secondary:hover {
          background-color: #7AA5D9 !important;
        }
        .petbook-btn-primary {
          background-color: #F7C59F !important;
          color: #432006 !important;
        }
        .petbook-btn-primary:hover {
          background-color: #F5AD60 !important;
        }
        .petbook-nav-btn {
          min-width: 70px;
          cursor: pointer;
          background: none;
          outline: none;
          border: none;
          transition: color 0.18s, border-color 0.18s;
        }
        .petbook-nav-btn-active {
          color: #F67280 !important;
        }
        @media (max-width: 700px) {
          .petbook-nav-menu { gap: 12px; }
          .petbook-section-title { font-size: 1.35rem; }
          .petbook-hero { padding-top: 10px; }
          .petbook-profile-image, .petbook-paw-bg { width: 80px; height: 80px; }
        }
      `}</style>
    </div>
  );
}

export default App;