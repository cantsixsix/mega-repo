// Utility functions for all apps

const API_URL = 'http://localhost:8790';

function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.remove('hidden');
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.add('hidden');
}

async function apiCall(appSlug, data) {
  const response = await fetch(`${API_URL}/apps/${appSlug}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:250px;animation:slideInRight .3s ease';
  alert.textContent = message;
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.style.animation = 'slideOutRight .3s ease';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}