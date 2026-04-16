// Reviews Functionality
import { 
  doc, 
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getCurrentUser, db } from '/js/firebase-init.js';

let allReviews = [];
let currentSortBy = 'recent';

document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '/pages/signin.html';
    return;
  }
  
  // Setup star rating input
  const starButtons = document.querySelectorAll('#ratingInput .star');
  starButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const value = button.getAttribute('data-value');
      document.getElementById('rating').value = value;
      
      // Update visual state
      starButtons.forEach((btn, index) => {
        if (index < value) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  });
  
  // Setup review form
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleSubmitReview);
  }
  
  // Load reviews
  await loadReviews();
});

async function handleSubmitReview(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) return;
  
  const rating = parseInt(document.getElementById('rating').value);
  const title = document.getElementById('title').value;
  const reviewText = document.getElementById('reviewText').value;
  
  if (!title || !reviewText) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  try {
    const reviewData = {
      userId: user.uid,
      userName: user.displayName || user.email.split('@')[0],
      userEmail: user.email,
      rating: rating,
      title: title,
      text: reviewText,
      createdAt: new Date().toISOString(),
      helpful: 0,
      unhelpful: 0,
      verified: true
    };
    
    const reviewId = `review_${Date.now()}`;
    await setDoc(doc(db, 'reviews', reviewId), reviewData);
    
    showToast('Review submitted successfully!', 'success');
    
    // Reset form
    document.getElementById('reviewForm').reset();
    document.getElementById('rating').value = '5';
    document.querySelectorAll('#ratingInput .star').forEach((btn, index) => {
      if (index < 5) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Reload reviews
    await loadReviews();
    
  } catch (error) {
    console.error('Error submitting review:', error);
    showToast('Error submitting review', 'error');
  }
}

async function loadReviews() {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    
    const reviewsSnapshot = await getDocs(reviewsQuery);
    allReviews = [];
    
    reviewsSnapshot.forEach(doc => {
      allReviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    displayReviews();
    updateOverallRating();
    
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

function displayReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;
  
  // Sort reviews
  let sortedReviews = [...allReviews];
  
  if (currentSortBy === 'highest') {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  } else if (currentSortBy === 'lowest') {
    sortedReviews.sort((a, b) => a.rating - b.rating);
  } else if (currentSortBy === 'helpful') {
    sortedReviews.sort((a, b) => (b.helpful - b.unhelpful) - (a.helpful - a.unhelpful));
  }
  
  if (sortedReviews.length === 0) {
    container.innerHTML = '<p class="empty-state">No reviews yet. Be the first to share your experience!</p>';
    return;
  }
  
  container.innerHTML = sortedReviews.map(review => `
    <div class="review-item">
      <div class="review-header">
        <div class="review-user">
          <div class="review-avatar">${review.userName.charAt(0).toUpperCase()}</div>
          <div class="review-user-info">
            <h3>${escapeHtml(review.userName)}</h3>
            <p>${formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div class="review-rating">
          <div class="review-stars">
            ${Array.from({ length: review.rating }).map(() => '<i class="fas fa-star"></i>').join('')}
            ${Array.from({ length: 5 - review.rating }).map(() => '<i class="fas fa-star-half-alt"></i>').join('')}
          </div>
        </div>
      </div>
      
      <div class="review-title">${escapeHtml(review.title)}</div>
      <div class="review-text">${escapeHtml(review.text)}</div>
      
      <div class="review-footer">
        <div class="review-helpful">
          <button class="helpful-btn" onclick="markHelpful('${review.id}')">
            <i class="fas fa-thumbs-up"></i> Helpful (${review.helpful})
          </button>
          <button class="helpful-btn" onclick="markUnhelpful('${review.id}')">
            <i class="fas fa-thumbs-down"></i> (${review.unhelpful})
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateOverallRating() {
  if (allReviews.length === 0) return;
  
  // Calculate average rating
  const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = (totalRating / allReviews.length).toFixed(1);
  
  document.getElementById('overallScore').textContent = avgRating;
  document.getElementById('ratingCount').textContent = `Based on ${allReviews.length} reviews`;
  
  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviews.forEach(review => {
    distribution[review.rating]++;
  });
  
  for (let i = 5; i >= 1; i--) {
    const percentage = (distribution[i] / allReviews.length) * 100;
    const bar = document.getElementById(`bar${i}`);
    const count = document.getElementById(`count${i}`);
    
    if (bar) bar.style.width = percentage + '%';
    if (count) count.textContent = distribution[i];
  }
}

async function markHelpful(reviewId) {
  try {
    await updateDoc(doc(db, 'reviews', reviewId), {
      helpful: increment(1)
    });
    
    await loadReviews();
  } catch (error) {
    console.error('Error marking helpful:', error);
  }
}

async function markUnhelpful(reviewId) {
  try {
    await updateDoc(doc(db, 'reviews', reviewId), {
      unhelpful: increment(1)
    });
    
    await loadReviews();
  } catch (error) {
    console.error('Error marking unhelpful:', error);
  }
}

function sortReviews() {
  const sortSelect = document.getElementById('sortBy');
  currentSortBy = sortSelect.value;
  displayReviews();
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

console.log('Reviews functionality loaded');
