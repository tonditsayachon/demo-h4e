// js/distributors.js (Final Version - July 2025)

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const grid = document.getElementById('distributor-grid');
    const nameSearch = document.getElementById('name-search');
    const locationFilter = document.getElementById('location-filter');
    const provinceFilter = document.getElementById('province-filter');
    const activeFilterInfo = document.getElementById('active-filter-info');
    const filterSection = document.querySelector('.distributor-filters');
    const pageHeader = document.querySelector('.page-header h1');

    // --- Functions ---
    function populateProvinces() {
        const provinces = [...new Set(distributorsData.filter(d => d.location.country === 'Thailand' && d.location.province).map(d => d.location.province))].sort();
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceFilter.appendChild(option);
        });
    }

    // NEW displayDistributors function for card-like layout
    function displayDistributors(data) {
        grid.innerHTML = ''; 
        grid.className = 'distributor-grid card-style-grid'; // Use a new class for styling

        if (data.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>';
            return;
        }

        data.forEach(distributor => {
            const card = document.createElement('div');
            card.className = 'distributor-card-item'; // New class for individual cards

            const locationText = distributor.location.country === 'Thailand' ? distributor.location.province : distributor.location.country;

            card.innerHTML = `
                <div class="dist-card-header">
                    <img src="${distributor.logo}" alt="${distributor.name} Logo">
                </div>
                <div class="dist-card-body">
                    <h3>${distributor.name}</h3>
                    <p class="location"><span class="detail-icon">📍</span>${locationText}</p>
                </div>
                <div class="dist-card-footer">
                    <a href="distributor-single.html#${distributor.id}" class="btn-read-more">ดูรายละเอียด</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function filterAndDisplay() {
        const nameQuery = nameSearch.value.toLowerCase();
        const locationQuery = locationFilter.value;
        const provinceQuery = provinceFilter.value;

        provinceFilter.disabled = (locationQuery !== 'Thailand');
        if(provinceFilter.disabled) provinceFilter.value = '';

        const filteredData = distributorsData.filter(d => {
            const matchesName = d.name.toLowerCase().includes(nameQuery);
            const matchesLocation = locationQuery === '' || (locationQuery === 'Thailand' && d.location.country === 'Thailand') || (locationQuery === 'International' && d.location.country !== 'Thailand');
            const matchesProvince = provinceQuery === '' || d.location.province === provinceQuery;
            return matchesName && matchesLocation && matchesProvince;
        });
        displayDistributors(filteredData);
    }

    // --- Main Logic ---
    populateProvinces();

    const urlParams = new URLSearchParams(window.location.search);
    const distributorIdsFromUrl = urlParams.get('distributors');
    const eNumberIdFromUrl = urlParams.get('eNumberId');

    if (distributorIdsFromUrl) {
        const idsToShow = distributorIdsFromUrl.split(',').map(Number);
        const preFilteredData = distributorsData.filter(d => idsToShow.includes(d.id));
        
        displayDistributors(preFilteredData);

        // Update UI to show context
        if(eNumberIdFromUrl) {
            pageHeader.textContent = `ผู้จัดจำหน่ายสำหรับสาร: ${eNumberIdFromUrl}`;
        }
        filterSection.style.display = 'none';
        activeFilterInfo.innerHTML = `
            <div class="active-filter-banner">
                <span>แสดงผลลัพธ์จากหน้าที่แล้ว</span>
                <a href="distributors.html" class="btn-read-more">แสดงผู้จัดจำหน่ายทั้งหมด</a>
            </div>
        `;
    } else {
        filterAndDisplay(); // Initial display for all distributors
        nameSearch.addEventListener('input', filterAndDisplay);
        locationFilter.addEventListener('change', filterAndDisplay);
        provinceFilter.addEventListener('change', filterAndDisplay);
    }

    
   
});