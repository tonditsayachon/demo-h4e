// js/main.js (Final Version - July 2025)

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    // const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const resultsGrid = document.getElementById('results-grid');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const subTypeFilter = document.getElementById('sub-type-filter');
    const statusFilterButtons = document.querySelectorAll('.status-filter-btn');

    // --- State Variables ---
    let currentPage = 1;
    const itemsPerPage = 10;
    let currentStatusFilter = '';

    // --- Dark Mode Logic (Commented Out) ---
    /*
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        // darkModeToggle.textContent = '🌙';
    }
    if(darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                // darkModeToggle.textContent = '🌙';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                // darkModeToggle.textContent = '☀️';
            }
        });
    }
    */
    
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
            case 'halal-cert': return { text: 'ฮาลาล (รับรอง)', className: 'halal-cert' };
            case 'halal-fatwa': return { text: 'ฮาลาล (ฟัตวา)', className: 'halal-fatwa' };
            case 'mashbooh': return { text: 'มัชบูฮ์', className: 'mashbooh' };
            case 'haram': return { text: 'ฮารอม', className: 'haram' };
            case 'unidentified': return { text: 'ไม่ระบุ', className: 'unidentified' };
            default: return { text: 'ไม่ระบุ', className: 'unidentified' };
        }
    }
    
    // UPDATED displayItems with new distributor link format
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
            const distributorQueryString = `?distributors=${item.usedBy.join(',')}`;

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
                            <p><span>ประเภท:</span> ${item.type}</p>
                            <p><span>ประเภทย่อย:</span> ${item.subType || '-'}</p>
                        </div>
                        <p class="description">${item.description}</p>
                    </div>
                    <div class="card-footer">
                        <a href="distributors.html${distributorQueryString}" class="distributor-link-compact">
                            <span class="icon">🏢</span>
                            <span>Distr : ${item.usedBy.length}</span>
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
                        <p class="type">${item.type}</p>
                        <p class="description-new">${item.description}</p>
                    </div>
                    <div class="card-view-new-footer">
                        <div class="new-footer-distributors">
                             <a href="distributors.html${distributorQueryString}">
                                <span class="icon">🏢</span> Distr : ${item.usedBy.length}
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
                filterAndRender(false);
                const target = document.getElementById('search-section');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
            li.appendChild(link);
            paginationContainer.appendChild(li);
        }
    }

    function filterAndRender(isNewFilter = true) {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedSubType = subTypeFilter.value;

        const filteredData = eNumbersData.filter(item => {
            const matchesSearch = searchTerm === '' ||
                item.id.toLowerCase().includes(searchTerm) ||
                item.name.toLowerCase().includes(searchTerm);
            const matchesType = selectedType === '' || item.type === selectedType;
            const matchesSubType = selectedSubType === '' || item.subType === selectedSubType;
            const matchesStatus = currentStatusFilter === '' || item.status.startsWith(currentStatusFilter);
            
            return matchesSearch && matchesType && matchesSubType && matchesStatus;
        });

        if (isNewFilter) {
            currentPage = 1;
        }

        displayItems(currentPage, filteredData);
        setupPagination(filteredData, itemsPerPage);
    }

    // --- Event Listeners ---
    searchInput.addEventListener('input', () => filterAndRender(true));
    typeFilter.addEventListener('change', () => filterAndRender(true));
    subTypeFilter.addEventListener('change', () => filterAndRender(true));
    
    statusFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            statusFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentStatusFilter = button.dataset.status;
            filterAndRender(true);
        });
    });

    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewListBtn = document.getElementById('view-list-btn');
    const viewNewBtn = document.getElementById('view-new-btn');
    const viewButtons = [viewGridBtn, viewListBtn, viewNewBtn];

    viewGridBtn?.addEventListener('click', () => {
        resultsGrid.classList.remove('list-view', 'new-card-view');
        updateActiveButton(viewGridBtn);
    });
    viewListBtn?.addEventListener('click', () => {
        resultsGrid.classList.remove('new-card-view');
        resultsGrid.classList.add('list-view');
        updateActiveButton(viewListBtn);
    });
    viewNewBtn?.addEventListener('click', () => {
        resultsGrid.classList.remove('list-view');
        resultsGrid.classList.add('new-card-view');
        updateActiveButton(viewNewBtn);
    });

    function updateActiveButton(activeBtn) {
        viewButtons.forEach(btn => btn?.classList.remove('active'));
        activeBtn?.classList.add('active');
    }

    // --- Initial Load ---
    if(document.getElementById('results-grid')) {
        populateFilters();
        filterAndRender(true);
        updateActiveButton(viewGridBtn);
        document.querySelector('.status-filter-btn[data-status=""]')?.classList.add('active');
    }
});