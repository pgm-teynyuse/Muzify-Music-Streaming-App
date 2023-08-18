const showOverlayBtn = document.getElementById('showOverlayBtn');
const overlay = document.getElementById('overlay');

showOverlayBtn.addEventListener('click', () => {
  overlay.style.display = 'flex';
});

overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    overlay.style.display = 'none';
  }
});

console.log('test')


document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('roleSelect');
    const filterButton = document.getElementById('filterButton');

    filterButton.addEventListener('click', () => {
        const selectedRole = roleSelect.value;
        window.location.href = `/users?sortByRole=${selectedRole}`;
    });
});
