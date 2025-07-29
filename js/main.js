// js/main.js (Final Version with Advanced Search Logic)

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const resultsGrid = document.getElementById('results-grid');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const subTypeFilter = document.getElementById('sub-type-filter');
    const statusFilterButtons = document.querySelectorAll('.status-filter-btn');
    const mainSearchBtn = document.getElementById('main-search-btn');
    const advancedSearchToggle = document.getElementById('advanced-search-toggle');
    const searchFilterSection = document.getElementById('search-section');

    // --- State Variables ---
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentStatusFilter = '';

    // --- Functions ---
    // populateFilters, getStatusInfo, displayItems, setupPagination (These remain the same)
    
    function populateFilters() {
        const types = [...new Set(eNumbersData.map(item => item.type))].sort();
        const subTypes = [...new Set(eNumbersData.map(item => item.subType).filter(Boolean))].sort();
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
        subTypes.forEach(subType => {
            const option = document.createElement('option');
            option.value = subType;
            option.textContent = subType;
            subTypeFilter.appendChild(option);
        });
    }

    function getStatusInfo(statusKey) {
        switch (statusKey) {
            case 'halal-cert': return { text: 'ฮาลาล (รับรอง)', className: 'halal-cert' };
            case 'halal-fatwa': return { text: 'ฮาลาล (ฟัตวา)', className: 'halal-fatwa' };
            case 'mashbooh': return { text: 'มัชบูฮ์', className: 'mashbooh' };
            case 'haram': return { text: 'ฮารอม', className: 'haram' };
            case 'unidentified': return { text: 'ไม่ระบุ', className: 'unidentified' };
            default: return { text: 'ไม่ระบุ', className: 'unidentified' };
        }
    }
    
    function displayItems(page, data) {
        resultsGrid.innerHTML = '';
        page--;
        const start = itemsPerPage * page;
        const end = start + itemsPerPage;
        const paginatedItems = data.slice(start, end);

        if (paginatedItems.length === 0) {
            resultsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; margin: 40px 0;">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>';
            return;
        }

        for (const item of paginatedItems) {
            const statusInfo = getStatusInfo(item.status);
            const card = document.createElement('div');
            card.className = `card ${statusInfo.className}`; 
            const distributorQueryString = `?distributors=${item.usedBy.join(',')}&eNumberId=${item.id}`;
            card.innerHTML = `
                <div class="status-ribbon"></div> 
                <div class="card-header">
                    <h2>${item.id}</h2>
                    <span class="status ${statusInfo.className}">${statusInfo.text}</span>
                </div>
                <div class="card-main-content">
                    <div class="card-body">
                        <p class="name">${item.name}</p>
                        <div class="additive-details">
                            <p><span class="detail-icon">🧪</span><span>ประเภท:</span> ${item.type}</p>
                            <p><span class="detail-icon">🧬</span><span>ประเภทย่อย:</span> ${item.subType || '-'}</p>
                        </div>
                        <p class="description"><span class="detail-icon">📖</span>${item.description}</p>
                    </div>
                    <div class="card-footer">
                        <a href="distributors.html${distributorQueryString}" class="distributor-link-compact">
                            <span class="icon">🏢</span>
                            <span>ผู้จัดจำหน่าย: ${item.usedBy.length}</span>
                        </a>
                        <a href="e-number-single.html#${item.id}" class="btn-read-more">อ่านเพิ่มเติม</a>
                    </div>
                </div>
                <div class="card-view-new-wrapper">
                    <div class="card-view-new-header">
                        <span class="status ${statusInfo.className}">${statusInfo.text}</span>
                        <div class="e-number-logo">${item.id}</div>
                    </div>
                    <div class="card-view-new-body">
                        <p class="name">${item.name}</p>
                        <p class="type"><span class="detail-icon">🧪</span>${item.type}</p>
                        <p class="description-new"><span class="detail-icon">📖</span>${item.description}</p>
                    </div>
                    <div class="card-view-new-footer">
                        <div class="new-footer-distributors">
                             <a href="distributors.html${distributorQueryString}">
                                <span class="icon">🏢</span> ผู้จัดจำหน่าย: ${item.usedBy.length}
                             </a>
                        </div>
                        <div class="new-footer-readmore">
                            <a href="e-number-single.html#${item.id}">อ่านเพิ่มเติม</a>
                        </div>
                    </div>
                </div>
            `;
            resultsGrid.appendChild(card);
        }
    }

    function setupPagination(data, itemsPerPage) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(data.length / itemsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.className = 'page-item';
            if (i === currentPage) li.classList.add('active');
            const link = document.createElement('a');
            link.href = '#search-section';
            link.innerText = i;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                performSearch(false);
                document.getElementById('results-grid')?.scrollIntoView({ behavior: 'smooth' });
            });
            li.appendChild(link);
            paginationContainer.appendChild(li);
        }
    }


    function performSearch(isNewFilter = true) {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedSubType = subTypeFilter.value;

        const filteredData = eNumbersData.filter(item => {
            const matchesSearch = searchTerm === '' || item.id.toLowerCase().includes(searchTerm) || item.name.toLowerCase().includes(searchTerm);
            const matchesType = selectedType === '' || item.type === selectedType;
            const matchesSubType = selectedSubType === '' || item.subType === selectedSubType;
            const matchesStatus = currentStatusFilter === '' || item.status.startsWith(currentStatusFilter);
            return matchesSearch && matchesType && matchesSubType && matchesStatus;
        });

        if (isNewFilter) { currentPage = 1; }
        displayItems(currentPage, filteredData);
        setupPagination(filteredData, itemsPerPage);
    }
    
    function triggerSearchWithLoader() {
        resultsGrid.innerHTML = '<div class="loader"></div>';
        paginationContainer.innerHTML = '';
        setTimeout(() => {
            performSearch(true);
        }, 500);
    }
    
    // --- Event Listeners ---
    
    // 1. Main Search/Clear Button Click
    mainSearchBtn?.addEventListener('click', () => {
        if (searchInput.value.length > 0) {
            searchInput.value = '';
            mainSearchBtn.innerHTML = '🔍';
            mainSearchBtn.setAttribute('title', 'ค้นหา');
            // Optionally, trigger a search for everything after clearing
            triggerSearchWithLoader();
        } else {
            triggerSearchWithLoader();
        }
    });

    // 2. Typing in Search Input
    searchInput?.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            mainSearchBtn.innerHTML = '❌';
            mainSearchBtn.setAttribute('title', 'ล้างข้อมูล');
        } else {
            mainSearchBtn.innerHTML = '🔍';
            mainSearchBtn.setAttribute('title', 'ค้นหา');
        }
    });

    // 3. Pressing Enter in Search Box
    searchInput?.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            triggerSearchWithLoader();
        }
    });

    // 4. Advanced Search Toggle Button
    advancedSearchToggle?.addEventListener('click', () => {
        searchFilterSection.classList.toggle('show');
    });

    // 5. Advanced Filters (auto-search on change)
    typeFilter?.addEventListener('change', () => triggerSearchWithLoader());
    subTypeFilter?.addEventListener('change', () => triggerSearchWithLoader());
    statusFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            statusFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentStatusFilter = button.dataset.status;
            triggerSearchWithLoader(); // Auto-search when status changes
        });
    });

    // View Switcher Logic
    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewListBtn = document.getElementById('view-list-btn');
    const viewNewBtn = document.getElementById('view-new-btn');
    const viewButtons = [viewGridBtn, viewListBtn, viewNewBtn];

    function updateActiveButton(activeBtn) {
        viewButtons.forEach(btn => btn?.classList.remove('active'));
        activeBtn?.classList.add('active');
    }
    
    viewGridBtn?.addEventListener('click', () => { resultsGrid.className = 'results-grid'; updateActiveButton(viewGridBtn); });
    viewListBtn?.addEventListener('click', () => { resultsGrid.className = 'results-grid list-view'; updateActiveButton(viewListBtn); });
    viewNewBtn?.addEventListener('click', () => { resultsGrid.className = 'results-grid new-card-view'; updateActiveButton(viewNewBtn); });

    // --- Initial Load ---
    if(resultsGrid) {
        populateFilters();
        updateActiveButton(viewGridBtn);
        document.querySelector('.status-filter-btn[data-status=""]')?.classList.add('active');
    }
});