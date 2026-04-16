// Dashboard Functionality
import { 
  doc, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getCurrentUser, db } from '/js/firebase-init.js';

let currentUserData = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '/pages/signin.html';
    return;
  }
  
  // Load user data
  await loadDashboardData(user.uid);
  
  // Setup form handlers
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordChange);
  }
});

async function loadDashboardData(userId) {
  try {
    // Load user profile
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      currentUserData = userDoc.data();
      updateUserUI(currentUserData);
    }
    
    // Load user's projects
    const projectsQuery = query(
      collection(db, `users/${userId}/orders`),
      where('status', '!=', 'completed')
    );
    
    const projectsSnapshot = await getDocs(projectsQuery);
    const projects = [];
    projectsSnapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    displayProjects(projects);
    updateStats(userId);
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

function updateUserUI(userData) {
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  
  if (userName) userName.textContent = userData.fullName || userData.email;
  if (userEmail) userEmail.textContent = userData.email;
  
  // Populate profile form
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileCompany = document.getElementById('profileCompany');
  const profilePhone = document.getElementById('profilePhone');
  const profileBio = document.getElementById('profileBio');
  
  if (profileName) profileName.value = userData.fullName || '';
  if (profileEmail) profileEmail.value = userData.email || '';
  if (profileCompany) profileCompany.value = userData.company || '';
  if (profilePhone) profilePhone.value = userData.phone || '';
  if (profileBio) profileBio.value = userData.bio || '';
}

function displayProjects(projects) {
  const container = document.getElementById('projectsContainer') || document.getElementById('recentProjects');
  
  if (!container) return;
  
  if (projects.length === 0) {
    container.innerHTML = '<p class="empty-state">No active projects. <a href="/pages/order.html">Create your first project</a></p>';
    return;
  }
  
  container.innerHTML = projects.map(project => `
    <div class="project-card glass-morphism">
      <h3>${project.projectName}</h3>
      <div class="project-status">${project.projectStatus}</div>
      <p>${project.businessName}</p>
      <p class="project-date">Created: ${formatDate(project.createdAt)}</p>
      <div style="margin-top: 15px;">
        <div style="background: var(--obsidian-light); border-radius: 8px; height: 8px; margin-bottom: 10px;">
          <div style="background: var(--electric-blue); height: 100%; width: ${getProjectProgress(project.projectStatus)}%; border-radius: 8px; transition: width 0.3s;"></div>
        </div>
        <small style="color: #aaa;">${getProjectProgress(project.projectStatus)}% Complete</small>
      </div>
      <button class="btn btn-primary" style="margin-top: 15px; width: 100%;" onclick="viewProjectDetails('${project.id}', '${project.projectName}')">
        View Details
      </button>
    </div>
  `).join('');
}

function getProjectProgress(status) {
  const progressMap = {
    'planning': 20,
    'design': 40,
    'development': 60,
    'testing': 80,
    'launch': 100,
    'completed': 100
  };
  return progressMap[status] || 20;
}

function viewProjectDetails(projectId, projectName) {
  const modal = document.getElementById('projectModal');
  if (modal) {
    document.getElementById('projectModalTitle').textContent = projectName;
    
    // Update status tracker
    const statuses = ['planning', 'design', 'development', 'testing', 'launch'];
    statuses.forEach(status => {
      const element = document.getElementById(`step-${status}`);
      if (element) {
        element.classList.remove('active', 'completed');
        // This would be set based on actual project status
      }
    });
    
    modal.style.display = 'block';
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) modal.style.display = 'none';
}

async function updateStats(userId) {
  try {
    const ordersQuery = query(collection(db, `users/${userId}/orders`));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    let activeProjects = 0;
    let completedProjects = 0;
    let totalSpent = 0;
    
    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      if (order.status === 'completed') {
        completedProjects++;
      } else {
        activeProjects++;
      }
      // Add price calculation based on package
      const packagePrices = { starter: 999, professional: 2499, enterprise: 4999 };
      totalSpent += packagePrices[order.package] || 0;
    });
    
    const activeElement = document.getElementById('activeProjects');
    const completedElement = document.getElementById('completedProjects');
    const spentElement = document.getElementById('totalSpent');
    const memberElement = document.getElementById('memberSince');
    
    if (activeElement) activeElement.textContent = activeProjects;
    if (completedElement) completedElement.textContent = completedProjects;
    if (spentElement) spentElement.textContent = formatCurrency(totalSpent);
    if (memberElement && currentUserData) {
      const joinDate = new Date(currentUserData.createdAt);
      const today = new Date();
      const daysAgo = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
      memberElement.textContent = daysAgo + ' days';
    }
    
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) return;
  
  const userData = {
    fullName: document.getElementById('profileName').value,
    company: document.getElementById('profileCompany').value,
    phone: document.getElementById('profilePhone').value,
    bio: document.getElementById('profileBio').value
  };
  
  try {
    await updateDoc(doc(db, 'users', user.uid), userData);
    showToast('Profile updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('Error updating profile', 'error');
  }
}

async function handlePasswordChange(e) {
  e.preventDefault();
  
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;
  
  if (newPassword !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }
  
  if (!isValidPassword(newPassword)) {
    showToast('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error');
    return;
  }
  
  try {
    const user = getCurrentUser();
    await user.updatePassword(newPassword);
    showToast('Password updated successfully!', 'success');
    document.getElementById('passwordForm').reset();
  } catch (error) {
    console.error('Error updating password:', error);
    showToast('Error updating password: ' + error.message, 'error');
  }
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
  const modal = document.getElementById('projectModal');
  if (modal && event.target === modal) {
    closeProjectModal();
  }
});

console.log('Dashboard functionality loaded');
