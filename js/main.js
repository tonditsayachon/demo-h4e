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
        const typeKey = currentLanguage === 'en' ? 'type_en' : 'type_th';
        const subTypeKey = currentLanguage === 'en' ? 'sub_type_en' : 'sub_type_th';
        const types = [...new Set(eNumbersData.map(item => item[typeKey]))].sort();
        const subTypes = [...new Set(eNumbersData.map(item => item[subTypeKey]).filter(Boolean))].sort();
        
        typeFilter.innerHTML = `<option value="">${translations[currentLanguage]['filter_type']}</option>`;
        subTypeFilter.innerHTML = `<option value="">${translations[currentLanguage]['filter_subtype']}</option>`;

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
            case 'haram': return { text: 'ฮารอม', className: 'status-red' };
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
            resultsGrid.innerHTML = '<p class="no-results-message">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>';
            return;
        }

        const nameKey = currentLanguage === 'en' ? 'name_en' : 'name_th';
        const typeKey = currentLanguage === 'en' ? 'type_en' : 'type_th';
        const subTypeKey = currentLanguage === 'en' ? 'sub_type_en' : 'sub_type_th';
        const originKey = currentLanguage === 'en' ? 'origin_en' : 'origin_th';
        const descKey = currentLanguage === 'en' ? 'description_en' : 'description_th';

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
                        <p class="name">${item[nameKey]}</p>
                        <div class="additive-details">
                            <p><span class="detail-icon"><i class="fa-solid fa-flask"></i></span><span class="lang-text" data-key="card_type">ประเภท:</span> ${item[typeKey]}</p>
                            <p><span class="detail-icon"><i class="fa-solid fa-circle-plus"></i></span><span class="lang-text" data-key="card_subtype">ประเภทย่อย:</span> ${item[subTypeKey] || '-'}</p>
                            <p><span class="detail-icon"><i class="fa-solid fa-house-circle-check"></i></span><span class="lang-text" data-key="card_origin">แหล่งที่มา:</span> ${item[originKey]}</p>
                        </div>
                        <p class="description"><span class="detail-icon"><i class="fa-solid fa-circle-info"></i></span>${item[descKey]}</p>
                    </div>
                    <div class="card-footer">
                        <a href="distributors.html${distributorQueryString}" class="distributor-link-compact">
                            <span class="icon">🏢</span>
                            <span class="lang-text" data-key="card_distributors">${translations[currentLanguage]['card_distributors'](item.distributor_ids.length)}</span>
                        </a>
                        <a href="e-number-single.html#${item.e_code}" class="btn-read-more lang-text" data-key="card_readmore">อ่านเพิ่มเติม</a>
                    </div>
                </div>
                <div class="card-view-compact-wrapper">
                    <div class="card-view-compact-header">
                        <span class="status ${statusInfo.className}">${statusInfo.text}</span>
                        <div class="e-number-logo">${item.e_code}</div>
                    </div>
                    <div class="card-view-compact-body">
                        <p class="name">${item[nameKey]}</p>
                        <p class="type"><span class="detail-icon">🔬</span>${item[originKey]}</p>
                        <p class="description-compact"><span class="detail-icon">📖</span>${item[descKey]}</p>
                    </div>
                    <div class="card-view-compact-footer">
                        <div class="compact-footer-distributors">
                             <a href="distributors.html${distributorQueryString}">
                                <span class="icon">🏢</span>
                                <span class="lang-text" data-key="card_distributors">${translations[currentLanguage]['card_distributors'](item.distributor_ids.length)}</span>
                             </a>
                        </div>
                        <div class="compact-footer-readmore">
                            <a href="e-number-single.html#${item.e_code}" class="lang-text" data-key="card_readmore">อ่านเพิ่มเติม</a>
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
        const typeKey = currentLanguage === 'en' ? 'type_en' : 'type_th';
        const subTypeKey = currentLanguage === 'en' ? 'sub_type_en' : 'sub_type_th';

        const filteredData = eNumbersData.filter(item => {
            const matchesSearch = currentSearchTerm === '' || (item.e_code || '').toLowerCase().includes(currentSearchTerm) || (item.name_en || '').toLowerCase().includes(currentSearchTerm) || (item.name_th || '').includes(currentSearchTerm);
            const matchesType = typeFilter.value === '' || item[typeKey] === typeFilter.value;
            const matchesSubType = subTypeFilter.value === '' || item[subTypeKey] === subTypeFilter.value;
            const matchesStatus = currentStatusFilter === '' || (item.status || '').toLowerCase().replace(" certified", "").replace(" fatwa", "").startsWith(currentStatusFilter);
            return matchesSearch && matchesType && matchesSubType && matchesStatus;
        });
        resultsMeta.innerHTML = `<span class="lang-text" data-key="results_found">${translations[currentLanguage]['results_found'](filteredData.length)}</span>`;
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
        heroWrapper.classList.toggle('full-width');
        const icon = fullWidthToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-expand-arrows-alt');
            icon.classList.toggle('fa-compress-arrows-alt');
        }
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