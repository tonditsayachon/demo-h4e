// js/distributors.js (Corrected with URL Parameter Logic)

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const grid = document.getElementById('distributor-grid');
    const nameSearch = document.getElementById('name-search');
    const locationFilter = document.getElementById('location-filter');
    const provinceFilter = document.getElementById('province-filter');
    const activeFilterInfo = document.getElementById('active-filter-info');
    const filterSection = document.querySelector('.distributor-filters');

    // --- Functions ---
    function populateProvinces() {
        const provinces = [...new Set(
            distributorsData
                .filter(d => d.location.country === 'Thailand' && d.location.province)
                .map(d => d.location.province)
        )].sort();

        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceFilter.appendChild(option);
        });
    }

    function displayDistributors(data) {
        grid.innerHTML = ''; 

        if (data.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>';
            return;
        }

        data.forEach(distributor => {
            const card = document.createElement('a');
            card.href = `distributor-single.html#${distributor.id}`;
            card.className = 'distributor-card';

            const locationText = distributor.location.country === 'Thailand'
                ? distributor.location.province
                : distributor.location.country;

            card.innerHTML = `
                <img src="${distributor.logo}" alt="${distributor.name} Logo">
                <h3>${distributor.name}</h3>
                <p>${locationText}</p>
                <span class="btn btn-primary" style="font-size: 0.9em; padding: 8px 15px;">ดูรายละเอียด</span>
            `;
            grid.appendChild(card);
        });
    }

    function filterAndDisplay() {
        const nameQuery = nameSearch.value.toLowerCase();
        const locationQuery = locationFilter.value;
        const provinceQuery = provinceFilter.value;

        if (locationQuery === 'International') {
            provinceFilter.disabled = true;
            provinceFilter.value = '';
        } else {
            provinceFilter.disabled = false;
        }

        const filteredData = distributorsData.filter(d => {
            const matchesName = d.name.toLowerCase().includes(nameQuery);
            const matchesLocation = locationQuery === '' ||
                (locationQuery === 'Thailand' && d.location.country === 'Thailand') ||
                (locationQuery === 'International' && d.location.country !== 'Thailand');
            const matchesProvince = provinceQuery === '' || d.location.province === provinceQuery;
            return matchesName && matchesLocation && matchesProvince;
        });

        displayDistributors(filteredData);
    }

    // --- Main Logic ---
    populateProvinces(); // Populate provinces dropdown first

    // 👇 NEW LOGIC: Check for URL parameters 👇
    const urlParams = new URLSearchParams(window.location.search);
    const distributorIdsFromUrl = urlParams.get('distributors');

    if (distributorIdsFromUrl) {
        // --- If URL parameters exist, filter by them ---
        const idsToShow = distributorIdsFromUrl.split(',').map(Number);
        const preFilteredData = distributorsData.filter(d => idsToShow.includes(d.id));
        
        displayDistributors(preFilteredData);

        // Disable filters and show a "clear" button for better UX
        filterSection.style.display = 'none';
        activeFilterInfo.innerHTML = `
            <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <span>แสดงผลลัพธ์จากหน้าที่แล้ว</span>
                <a href="distributors.html" class="btn btn-primary" style="font-size: 0.9em; padding: 8px 15px;">แสดงทั้งหมด</a>
            </div>
        `;
    } else {
        // --- If no URL parameters, run the normal filter logic ---
        filterAndDisplay(); // Initial display
        nameSearch.addEventListener('input', filterAndDisplay);
        locationFilter.addEventListener('change', filterAndDisplay);
        provinceFilter.addEventListener('change', filterAndDisplay);
    }

    // Dark mode toggle logic
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '🌙';
        }
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            darkModeToggle.textContent = isDarkMode ? '🌙' : '☀️';
        });
    }
});