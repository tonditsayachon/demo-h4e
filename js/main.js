// js/main.js (Final Version with View Switcher Fix)

document.addEventListener('DOMContentLoaded', () => {
    const allContainers = document.querySelectorAll('.container');
    const fullWidthToggle = document.getElementById('full-width-toggle');
    const heroWrapper = document.getElementById('hero-wrapper');
    const heroSwitchBtns = document.querySelectorAll('.hero-switch-btn');
    const searchInputs = document.querySelectorAll('.main-search-input');
    const mainSearchBtns = document.querySelectorAll('.main-search-btn');
    const advancedSearchBtns = document.querySelectorAll('.advanced-search-btn');
    // --- Element Selectors ---
    const resultsWrapper = document.getElementById('results-wrapper');
    const resultsGrid = document.getElementById('results-grid');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const subTypeFilter = document.getElementById('sub-type-filter');
    const statusFilterButtons = document.querySelectorAll('.status-filter-btn');
    const mainSearchBtn = document.getElementById('main-search-btn');
    const advancedSearchToggle = document.getElementById('advanced-search-btn');
    const searchFilterSection = document.getElementById('search-section');
    const resultsMeta = document.getElementById('results-meta');

    // --- State Variables ---
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentStatusFilter = '';

    // --- Functions ---
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
            case 'halal-cert': return { text: 'ฮาลาล (รับรอง)', className: 'status-orange' };
            case 'halal-fatwa': return { text: 'ฮาลาล (ฟัตวา)', className: 'status-green' };
            case 'mashbooh': return { text: 'มัชบูฮ์', className: 'status-red' };
            case 'unidentified': return { text: 'ไม่ระบุ', className: 'status-grey' };
            default: return { text: 'ไม่ระบุ', className: 'status-grey' };
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
            // Add status class directly to card for styling compact view
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
                            <p><span class="detail-icon">🧪</span><span>ประเภท: </span> ${item.type}</p>
                            <p><span class="detail-icon">🧬</span><span>ประเภทย่อย:</span> ${item.subType || '-'}</p>
                        </div>
                        <p class="description"><span class="detail-icon">📖</span>${item.description}</p>
                    </div>
                    <div class="card-footer">
                        <a href="distributors.html${distributorQueryString}" class="distributor-link-compact">
                            <span class="icon">🏢</span>
                            <span>Distr. ${item.usedBy.length}</span>
                        </a>
                        <a href="e-number-single.html#${item.id}" class="btn-read-more">อ่านเพิ่มเติม</a>
                    </div>
                </div>
                <div class="card-view-compact-wrapper">
                    <div class="card-view-compact-header">
                        <span class="status ${statusInfo.className}">${statusInfo.text}</span>
                        <div class="e-number-logo">${item.id}</div>
                    </div>
                    <div class="card-view-compact-body">
                        <p class="name">${item.name}</p>
                        <p class="type"><span class="detail-icon">🧪</span>${item.type}</p>
                        <p class="description-compact"><span class="detail-icon">📖</span>${item.description}</p>
                    </div>
                    <div class="card-view-compact-footer">
                        <div class="compact-footer-distributors">
                             <a href="distributors.html${distributorQueryString}">
                                <span class="icon">🏢</span> Distr. : ${item.usedBy.length}
                             </a>
                        </div>
                        <div class="compact-footer-readmore">
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
        if (isNewFilter) { currentPage = 1; }

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
        
        resultsMeta.textContent = `พบผลลัพธ์ทั้งหมด ${filteredData.length} รายการ`;

        displayItems(currentPage, filteredData);
        setupPagination(filteredData, itemsPerPage);
    }
    
    function triggerSearchWithLoader() {
        resultsWrapper.style.display = 'block';
        resultsGrid.innerHTML = '<div class="loader"></div>';
        paginationContainer.innerHTML = '';
        resultsMeta.textContent = '';
        setTimeout(() => {
            performSearch(true);
        }, 500);
    }
    
    // --- Event Listeners ---
     fullWidthToggle?.addEventListener('click', () => {
        allContainers.forEach(container => container.classList.toggle('full-width'));
    });

    // 2. Hero Switcher
    heroSwitchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            heroSwitchBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const heroToShow = btn.dataset.hero;
            heroWrapper.className = `hero-wrapper show-${heroToShow}`;
        });
    });
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            currentSearchTerm = searchTerm.toLowerCase();
            // Sync both search inputs
            searchInputs.forEach(si => si.value = searchTerm);

            const hasText = searchTerm.length > 0;
            advancedSearchBtns.forEach(btn => btn.disabled = !hasText);
            
            mainSearchBtns.forEach(btn => {
                btn.innerHTML = hasText ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-magnifying-glass"></i>';
                btn.setAttribute('title', hasText ? 'ล้างข้อมูล' : 'ค้นหา');
            });
        });
        
        input.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                triggerSearchWithLoader();
            }
        });
    });

    mainSearchBtn?.addEventListener('click', () => {
        if (mainSearchBtn.innerHTML.includes('fa-xmark')) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            resultsWrapper.style.display = 'none';
            searchFilterSection.classList.remove('show');
        } else {
            triggerSearchWithLoader();
        }
    });

    searchInput?.addEventListener('input', () => {
        const hasText = searchInput.value.length > 0;
        advancedSearchToggle.disabled = !hasText;

        if (hasText) {
            mainSearchBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            mainSearchBtn.setAttribute('title', 'ล้างข้อมูล');
        } else {
            mainSearchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
            mainSearchBtn.setAttribute('title', 'ค้นหา');
        }
    });

    searchInput?.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            triggerSearchWithLoader();
        }
    });

    advancedSearchToggle?.addEventListener('click', () => {
        if (!advancedSearchToggle.disabled) {
            searchFilterSection.classList.toggle('show');
        }
    });

    typeFilter?.addEventListener('change', triggerSearchWithLoader);
    subTypeFilter?.addEventListener('change', triggerSearchWithLoader);
    statusFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            statusFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentStatusFilter = button.dataset.status;
            triggerSearchWithLoader();
        });
    });

    // View Switcher Logic
    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewListBtn = document.getElementById('view-list-btn');
    const viewCompactBtn = document.getElementById('view-compact-btn');
    const viewButtons = [viewGridBtn, viewListBtn, viewCompactBtn];

    function updateActiveButton(activeBtn) {
        viewButtons.forEach(btn => btn?.classList.remove('active'));
        activeBtn?.classList.add('active');
    }
    
    viewGridBtn?.addEventListener('click', () => { 
        resultsGrid.className = 'results-grid'; 
        updateActiveButton(viewGridBtn); 
    });
    viewListBtn?.addEventListener('click', () => { 
        resultsGrid.className = 'results-grid list-view'; 
        updateActiveButton(viewListBtn); 
    });
    viewCompactBtn?.addEventListener('click', () => { 
        resultsGrid.className = 'results-grid compact-card-view'; 
        updateActiveButton(viewCompactBtn); 
    });

    // --- Initial Load ---
    if(resultsGrid) {
        populateFilters();
        updateActiveButton(viewGridBtn);
        document.querySelector('.status-filter-btn[data-status=""]')?.classList.add('active');
    }
});