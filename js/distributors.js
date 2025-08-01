// js/distributors.js (Final Version with Corrected Data Structure)

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
        const provinces = [...new Set(distributorsData.filter(d => d.country_th === 'ไทย' && d.province_th).map(d => d.province_th))].sort();
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceFilter.appendChild(option);
        });
    }

    function displayDistributors(data) {
        grid.innerHTML = ''; 
        grid.className = 'distributor-grid card-style-grid';

        if (data.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>';
            return;
        }

        data.forEach(distributor => {
            const card = document.createElement('div');
            card.className = 'distributor-card-item';
            const locationText = distributor.country_th === 'ไทย' ? distributor.province_th : distributor.country_th;
            const certifiedCount = eNumbersData.filter(e => e.distributor_ids.includes(distributor.distributor_id)).length;

            card.innerHTML = `
                <div class="dist-card-header">
                    <img src="${distributor.logo}" alt="${distributor.company_name_th} Logo">
                </div>
                <div class="dist-card-body">
                    <h3>${distributor.company_name_th}</h3>
                    <p class="location"><span class="detail-icon">📍</span>${locationText || 'N/A'}</p>
                     <p class="certified-count"><i class="fas fa-flask"></i> ${certifiedCount} products</p> 
                </div>
                <div class="dist-card-footer">
                    <a href="distributor-single.html#${distributor.distributor_id}" class="btn-read-more">ดูรายละเอียด</a>
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
            const matchesName = (d.company_name_th.toLowerCase().includes(nameQuery) || d.company_name_en.toLowerCase().includes(nameQuery));
            const matchesLocation = locationQuery === '' || (locationQuery === 'Thailand' && d.country_th === 'ไทย') || (locationQuery === 'International' && d.country_th !== 'ไทย');
            const matchesProvince = provinceQuery === '' || d.province_th === provinceQuery;
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
        const preFilteredData = distributorsData.filter(d => idsToShow.includes(d.distributor_id));
        
        displayDistributors(preFilteredData);

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
        filterAndDisplay();
        nameSearch.addEventListener('input', filterAndDisplay);
        locationFilter.addEventListener('change', filterAndDisplay);
        provinceFilter.addEventListener('change', filterAndDisplay);
    }
});