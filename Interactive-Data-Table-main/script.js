// Sample data
let originalData = [
  { name: "Alice Johnson", position: "Manager", department: "HR", salary: 75000 },
  { name: "Bob Smith", position: "Developer", department: "IT", salary: 82000 },
  { name: "Carol White", position: "Designer", department: "Marketing", salary: 68000 },
  { name: "David Brown", position: "Engineer", department: "Engineering", salary: 90000 },
  { name: "Emily Davis", position: "Analyst", department: "Finance", salary: 70000 }
];

let currentData = [...originalData];
let selectedRows = new Set(); // To store indices of selected rows

// DOM Elements
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const addEmployeeBtn = document.getElementById("addEmployee");
const removeSelectedBtn = document.getElementById("removeSelected");
const addEmployeeModal = document.getElementById("addEmployeeModal");
const closeModalBtn = document.querySelector(".close");
const employeeForm = document.getElementById("employeeForm");
const addAnotherBtn = document.getElementById("addAnother");

// Theme Toggle Functionality
function initTheme() {
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Light Mode';
  }
}

themeToggle.addEventListener('click', () => {
  // Toggle dark mode class on body
  document.body.classList.toggle('dark-mode');
  
  // Update button text and save preference
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.textContent = '☀️ Light Mode';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'light');
  }
});

// Render Table
function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    
    // Add selected class if row is selected
    if (selectedRows.has(index)) {
      tr.classList.add('selected');
    }
    
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.position}</td>
      <td>${row.department}</td>
      <td>$${row.salary.toLocaleString()}</td>
    `;
    
    // Add click handler for selection
    tr.addEventListener('click', () => {
      toggleRowSelection(index);
    });
    
    tableBody.appendChild(tr);
  });
  updateRemoveSelectedButtonVisibility();
}

// Toggle row selection
function toggleRowSelection(index) {
  if (selectedRows.has(index)) {
    selectedRows.delete(index);
  } else {
    selectedRows.add(index);
  }
  renderTable(currentData); // Re-render to update selection visual
}

// Update visibility of "Remove Selected" button
function updateRemoveSelectedButtonVisibility() {
  if (selectedRows.size > 0) {
    removeSelectedBtn.style.display = 'inline-block';
  } else {
    removeSelectedBtn.style.display = 'none';
  }
}

// Sort Table
function sortTable(key) {
  let direction = 1;
  // Determine sort direction based on current data order
  if (currentData.length > 1 && currentData[0][key] !== undefined && currentData[1][key] !== undefined) {
    if (typeof currentData[0][key] === 'string') {
      if (currentData[0][key].localeCompare(currentData[1][key]) > 0) {
        direction = -1;
      }
    } else if (currentData[0][key] > currentData[1][key]) {
      direction = -1;
    }
  }

  currentData.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return direction * valA.localeCompare(valB);
    } else {
      return direction * (valA - valB);
    }
  });

  renderTable(currentData);
}

// Search Filter
searchInput.addEventListener("input", function () {
  const term = this.value.toLowerCase();
  const filtered = originalData.filter((item) =>
    item.name.toLowerCase().includes(term) ||
    item.position.toLowerCase().includes(term) ||
    item.department.toLowerCase().includes(term)
  );
  currentData = [...filtered];
  renderTable(currentData);
});

// Add Employee Modal
addEmployeeBtn.addEventListener("click", () => {
  addEmployeeModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  addEmployeeModal.style.display = "none";
  employeeForm.reset(); // Reset form when closing
});

window.addEventListener("click", (event) => {
  if (event.target === addEmployeeModal) {
    addEmployeeModal.style.display = "none";
    employeeForm.reset(); // Reset form when clicking outside
  }
});

// Add Employee Form Submission
employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addEmployeeFromForm();
  // Do not close modal on submit, allow "Add Another"
});

addAnotherBtn.addEventListener("click", () => {
  addEmployeeFromForm();
});

function addEmployeeFromForm() {
  const newEmployee = {
    name: document.getElementById("nameInput").value,
    position: document.getElementById("positionInput").value,
    department: document.getElementById("departmentInput").value,
    salary: parseInt(document.getElementById("salaryInput").value)
  };
  
  // Basic validation
  if (!newEmployee.name || !newEmployee.position || !newEmployee.department || isNaN(newEmployee.salary)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // Add to data arrays
  originalData.push(newEmployee);
  currentData = [...originalData];
  
  // Reset form for next entry
  employeeForm.reset();
  
  // Update table
  renderTable(currentData);
}

// Remove Selected Employees
removeSelectedBtn.addEventListener("click", () => {
  if (selectedRows.size === 0) {
    alert("Please select employees to remove.");
    return;
  }

  if (confirm(`Are you sure you want to remove ${selectedRows.size} selected employee(s)?`)) {
    // Convert Set to Array, sort in descending order to avoid index issues during removal
    const indicesToRemove = Array.from(selectedRows).sort((a, b) => b - a);

    indicesToRemove.forEach(index => {
      originalData.splice(index, 1);
    });

    // Clear selected rows and re-render
    selectedRows.clear();
    currentData = [...originalData];
    renderTable(currentData);
  }
});

// Initial render and theme setup
renderTable(originalData);
initTheme();
