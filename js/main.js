// js/main.js (Final Corrected Version)

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const langSwitcherBtn = document.getElementById('lang-switcher-btn');
    const fullWidthToggle = document.getElementById('full-width-toggle');
    const heroSwitchBtn = document.getElementById('hero-switch-btn');
    const heroWrapper = document.getElementById('hero-wrapper');
    const searchInputs = document.querySelectorAll('.main-search-input');
    const mainSearchBtns = document.querySelectorAll('.main-search-btn');
    const advancedSearchBtns = document.querySelectorAll('.advanced-search-btn');
    const resultsWrapper = document.getElementById('results-wrapper');
    const resultsGrid = document.getElementById('results-grid');
    const paginationContainer = document.getElementById('pagination');
    const typeFilter = document.getElementById('type-filter');
    const subTypeFilter = document.getElementById('sub-type-filter');
    const statusFilterButtons = document.querySelectorAll('.status-filter-btn');
    const searchFilterSection = document.getElementById('search-section');
    const resultsMeta = document.getElementById('results-meta');

    // --- State Variables ---
     let currentLanguage = 'en'; // Default language
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentStatusFilter = '';
    let currentSearchTerm = '';

    // --- Functions ---
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);

        document.querySelectorAll('.lang-text').forEach(el => {
            const key = el.dataset.key;
            if (translations[lang] && translations[lang][key]) {
                // This handles both simple strings and functions
                const translation = translations[lang][key];
                el.textContent = typeof translation === 'function' ? translation(0) : translation;
            }
        });

        document.querySelectorAll('.lang-placeholder').forEach(el => {
            const key = el.dataset.key;
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        const flagIcon = langSwitcherBtn.querySelector('img');
        if (lang === 'en') {
            flagIcon.src = 'assets/images/us-flag.svg';
            flagIcon.alt = 'English Language';
            document.documentElement.lang = 'en';
        } else {
            flagIcon.src = 'assets/images/th-flag.svg';
            flagIcon.alt = 'Thai Language';
            document.documentElement.lang = 'th';
        }
        
        // Re-populate filters with the correct language
        populateFilters();
        
        // Re-render results if they are already displayed
        if (document.getElementById('results-wrapper').style.display === 'block') {
            performSearch(false); // false to keep current page
        }
    }
    function populateFilters() {
        const types = [...new Set(eNumbersData.map(item => item.type_th))].sort();
        const subTypes = [...new Set(eNumbersData.map(item => item.sub_type_th).filter(Boolean))].sort();
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            if(typeFilter) typeFilter.appendChild(option);
        });
        subTypes.forEach(subType => {
            const option = document.createElement('option');
            option.value = subType;
            option.textContent = subType;
            if(subTypeFilter) subTypeFilter.appendChild(option);
        });
    }

    function getStatusInfo(statusKey) {
        switch (statusKey) {
            case 'Halal Certified': return { text: 'ฮาลาล (รับรอง)', className: 'status-orange' };
            case 'Halal Fatwa': return { text: 'ฮาลาล (ฟัตวา)', className: 'status-green' };
            case 'Mashbooh': return { text: 'มัชบูฮ์', className: 'status-red' };
            case 'Haram': return { text: 'ฮารอม', className: 'status-red' };
            case 'Unidentified': return { text: 'ไม่ระบุ', className: 'status-grey' };
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
            resultsGrid.innerHTML = '<p class="no-results-message">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>';
            return;
        }

        for (const item of paginatedItems) {
            const statusInfo = getStatusInfo(item.status);
            const card = document.createElement('div');
            card.className = `card ${statusInfo.className}`; 
            const distributorQueryString = `?distributors=${item.distributor_ids.join(',')}&eNumberId=${item.e_code}`;
            card.innerHTML = `
                <div class="status-ribbon"></div> 
                <div class="card-header">
                    <h2>${item.e_code}</h2>
                    <span class="status ${statusInfo.className}">${statusInfo.text}</span>
                </div>
                <div class="card-main-content">
                    <div class="card-body">
                        <p class="name">${item.name_th}</p>
                        <div class="additive-details">
                            <p><span class="detail-icon">🧪</span><span>ประเภท: </span> ${item.type_th}</p>
                            <p><span class="detail-icon">🧬</span><span>ประเภทย่อย:</span> ${item.sub_type_th || '-'}</p>
                        </div>
                        <p class="description"><span class="detail-icon">📖</span>${item.description_th}</p>
                    </div>
                    <div class="card-footer">
                        <a href="distributors.html${distributorQueryString}" class="distributor-link-compact">
                            <span class="icon">🏢</span>
                            <span>Distr. ${item.distributor_ids.length}</span>
                        </a>
                        <a href="e-number-single.html#${item.e_code}" class="btn-read-more">อ่านเพิ่มเติม</a>
                    </div>
                </div>
                <div class="card-view-compact-wrapper">
                    <div class="card-view-compact-header">
                        <span class="status ${statusInfo.className}">${statusInfo.text}</span>
                        <div class="e-number-logo">${item.e_code}</div>
                    </div>
                    <div class="card-view-compact-body">
                        <p class="name">${item.name_th}</p>
                        <p class="type"><span class="detail-icon">🔬</span>${item.origin_th}</p>
                        <p class="description-compact"><span class="detail-icon">📖</span>${item.description_th}</p>
                    </div>
                    <div class="card-view-compact-footer">
                        <div class="compact-footer-distributors">
                             <a href="distributors.html${distributorQueryString}">
                                <span class="icon">🏢</span> Distr. : ${item.distributor_ids.length}
                             </a>
                        </div>
                        <div class="compact-footer-readmore">
                            <a href="e-number-single.html#${item.e_code}">อ่านเพิ่มเติม</a>
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
            link.href = '#results-wrapper';
            link.innerText = i;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                performSearch(false);
                resultsWrapper.scrollIntoView({ behavior: 'smooth' });
            });
            li.appendChild(link);
            paginationContainer.appendChild(li);
        }
    }

    function performSearch(isNewFilter = true) {
        if (isNewFilter) { currentPage = 1; }
        
        const filteredData = eNumbersData.filter(item => {
            const itemECode = item.e_code || '';
            const itemNameEn = item.name_en || '';
            const itemNameTh = item.name_th || '';
            const itemTypeTh = item.type_th || '';
            const itemSubTypeTh = item.sub_type_th || '';
            const itemStatus = item.status || '';

            const matchesSearch = currentSearchTerm === '' || 
                                  itemECode.toLowerCase().includes(currentSearchTerm) || 
                                  itemNameEn.toLowerCase().includes(currentSearchTerm) || 
                                  itemNameTh.includes(currentSearchTerm);
            const matchesType = typeFilter.value === '' || itemTypeTh === typeFilter.value;
            const matchesSubType = subTypeFilter.value === '' || itemSubTypeTh === subTypeFilter.value;
            const matchesStatus = currentStatusFilter === '' || itemStatus.toLowerCase().replace(" certified", "").startsWith(currentStatusFilter);
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
    langSwitcherBtn?.addEventListener('click', () => {
        const newLang = currentLanguage === 'en' ? 'th' : 'en';
        setLanguage(newLang);
    });
    fullWidthToggle?.addEventListener('click', () => {
        heroWrapper.parentElement.classList.toggle('full-width');
        fullWidthToggle.querySelector('i').classList.toggle('fa-expand-arrows-alt');
        fullWidthToggle.querySelector('i').classList.toggle('fa-compress-arrows-alt');
    });

    heroSwitchBtn?.addEventListener('click', () => {
        heroWrapper.classList.toggle('show-light');
    });

    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            currentSearchTerm = searchTerm.toLowerCase();
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

    mainSearchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.innerHTML.includes('fa-xmark')) {
                searchInputs.forEach(input => input.value = '');
                searchInputs[0].dispatchEvent(new Event('input'));
                resultsWrapper.style.display = 'none';
                searchFilterSection.classList.remove('show');
            } else {
                triggerSearchWithLoader();
            }
        });
    });

    advancedSearchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                searchFilterSection.classList.toggle('show');
            }
        });
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
         const savedLang = localStorage.getItem('language') || 'en';
        setLanguage(savedLang);
        populateFilters();
        updateActiveButton(viewGridBtn);
        document.querySelector('.status-filter-btn[data-status=""]')?.classList.add('active');
    }
});