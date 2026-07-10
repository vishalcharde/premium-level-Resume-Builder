/* ==========================================================================
   HIGH-FIDELITY CORE ARCHITECTURE ENGINE - REACTIVE RE-RENDER PIPELINE
   ========================================================================== */

const STORAGE_KEY = 'ATS_ENGINE_DATA_V4';

// Application Reactive Global State Matrix
let appState = {
    theme: 'light',
    selectedTemplate: 'modern',
    expandedSections: {
        personal: true,
        experience: false,
        education: false,
        skills: false
    },
    formData: {}
};

// Form Blueprints Matrix Configuration Layout Map
const formBlueprint = [
    {
        id: 'personal',
        title: 'Personal Information',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`,
        fields: [
            { id: 'profileImage', label: 'Profile Photo', type: 'image', fullWidth: true },
            { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Alex Mercer' },
            { id: 'jobTitle', label: 'Target Job Title', type: 'text', placeholder: 'Principal Software Engineer' },
            { id: 'email', label: 'Email Address', type: 'email', placeholder: 'alex.mercer@gmail.com' },
            { id: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 234-5678' },
            { id: 'location', label: 'Location (City, State)', type: 'text', placeholder: 'San Francisco, CA' },
            { id: 'website', label: 'Portfolio Link / Website', type: 'text', placeholder: 'alexmercer.dev' },
            { id: 'linkedin', label: 'LinkedIn URL Handle', type: 'text', placeholder: 'linkedin.com/in/alexmercer' },
            { id: 'github', label: 'GitHub Profile Handle', type: 'text', placeholder: 'github.com/alexmercer' },
            { id: 'summary', label: 'Professional Executive Summary', type: 'textarea', placeholder: 'Results-driven software architect with 8+ years of expertise leading large-scale microservices deployments...', fullWidth: true }
        ]
    },
    {
        id: 'experience',
        title: 'Professional Work Experience',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
        isRepeater: true,
        repeaterBlueprint: [
            { id: 'company', label: 'Company / Organization', type: 'text', placeholder: 'Stripe Inc.' },
            { id: 'role', label: 'Job Role / Title', type: 'text', placeholder: 'Senior Staff Engineer' },
            { id: 'duration', label: 'Timeframe Period (Dates)', type: 'text', placeholder: 'Jan 2022 - Present' },
            { id: 'location', label: 'Job Location', type: 'text', placeholder: 'San Francisco, CA (Hybrid)' },
            { id: 'description', label: 'Core Accomplishments & Duties', type: 'textarea', placeholder: '• Orchestrated transition from monolithic databases to highly-distributed CockroachDB backend configurations.\n• Guided a team of 14 core engineers scaling data flow throughput metrics upwards of 40%.', fullWidth: true }
        ]
    },
    {
        id: 'education',
        title: 'Education & Credentials',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>`,
        isRepeater: true,
        repeaterBlueprint: [
            { id: 'institution', label: 'University / School Name', type: 'text', placeholder: 'Stanford University' },
            { id: 'degree', label: 'Degree Earned / Field of Study', type: 'text', placeholder: 'M.S. Computer Science' },
            { id: 'duration', label: 'Graduation Year / Duration', type: 'text', placeholder: '2018 - 2020' },
            { id: 'honors', label: 'Academic Merits / Accomplishments', type: 'text', placeholder: 'GPA 3.92 / Specialization in Distributed AI Networks Systems' }
        ]
    },
    {
        id: 'skills',
        title: 'Core Competencies & Skills',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>`,
        fields: [
            { id: 'list', label: 'Skills Set (Comma Separated values)', type: 'textarea', placeholder: 'Go, Rust, Kubernetes, Redis, Apache Kafka, System Architecture, GraphQL, Amazon AWS', fullWidth: true, hint: 'Separate items with standard commas for clean parsing matching ATS tracking matrices.' }
        ]
    }
];

// Instantiates default structural schema payload state matrix
function setupDefaultEmptyState() {
    appState.formData = {
        personal: { profileImage: '', fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '' },
        experience: [],
        education: [],
        skills: { list: '' }
    };
}

// Complete Full Mock Data Blueprint Initialization Payload Vector
function loadMockDataBlueprint() {
    appState.formData = {
        personal: {
            profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
            fullName: 'Sarah Jenkins',
            jobTitle: 'Senior Cloud Solutions Infrastructure Architect',
            email: 's.jenkins@cloudscale.net',
            phone: '+1 (415) 889-3120',
            location: 'Seattle, WA',
            website: 'jenkinscloud.io',
            linkedin: 'linkedin.com/in/sarah-jenkins-cloud',
            github: 'github.com/sjenkins-infra',
            summary: 'Highly analytical, enterprise-grade cloud systems architect possessing over 8 years of production-level mastery deploying fault-tolerant multi-region cluster footprints. Spearheaded virtualization migrations minimizing runtime cloud-spend by 32% across complex global application loads.'
        },
        experience: [
            {
                company: 'Amazon Web Services (AWS)',
                role: 'Senior Staff Solutions Architect',
                duration: 'Mar 2023 - Present',
                location: 'Seattle, WA',
                description: '• Engineered core internal infrastructure optimization templates serving over 4,000 enterprise level configurations globally.\n• Cut service network handshakes latencies metrics down 18ms through clever data routing configurations.'
            },
            {
                company: 'HashiCorp Engineering Group',
                role: 'Infrastructure Automation Systems Specialist',
                duration: 'Jun 2020 - Feb 2023',
                location: 'Austin, TX (Remote)',
                description: '• Championed modular open-source Terraform enterprise engine drivers deployed over production arrays.\n• Authored cluster integration specs natively handling up to 500,000 requests per minute securely.'
            }
        ],
        education: [
            {
                institution: 'University of Washington',
                degree: 'B.S. Computer Engineering & Informatics Networks',
                duration: '2016 - 2020',
                honors: 'Summa Cum Laude Honors / Minor in Scaled Systems Management Science'
            }
        ],
        skills: {
            list: 'AWS, Terraform, Go, Python scripting, Kubernetes, Docker Engine, Linux Kernel optimization, CI/CD pipelines execution, Prometheus telemetry, IAM Securities matrix configuration'
        }
    };
    saveStateToLocalStorage();
    buildDynamicFormDOM();
    triggerLiveCanvasPipelineUpdate();
    showToastMessage('Mock enterprise system parameters loaded into scope.', 'success');
}

/* ==========================================================================
   STATE MANAGERS & LOCALSTORAGE WRAPPERS
   ========================================================================== */
function saveStateToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function initApplicationEngineState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.formData && parsed.formData.personal) {
                appState = parsed;
                return;
            }
        }
    } catch (e) {
        console.error("Local storage sync fault:", e);
    }
    setupDefaultEmptyState();
}

/* ==========================================================================
   UI ENGINE: FORM CONTROLS INJECTION ARCHITECTURE
   ========================================================================== */
function buildDynamicFormDOM() {
    const formContainer = document.getElementById('resumeDataForm');
    if (!formContainer) return;
    
    formContainer.innerHTML = '';

    formBlueprint.forEach(section => {
        const sectionNode = document.createElement('div');
        sectionNode.className = `form-section ${appState.expandedSections[section.id] ? 'expanded' : ''}`;
        sectionNode.setAttribute('data-section-id', section.id);

        // Header Accordion Area Wrapper Element
        const trigger = document.createElement('div');
        trigger.className = 'section-trigger';
        trigger.innerHTML = `
            <div class="trigger-title">
                ${section.icon}
                <span>${section.title}</span>
            </div>
            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        `;
        
        trigger.addEventListener('click', () => toggleFormSectionAccordion(section.id));
        sectionNode.appendChild(trigger);

        // Core Input Grid Wrapper Element Container
        const grid = document.createElement('div');
        grid.className = 'section-content-grid';

        if (section.isRepeater) {
            const repeaterWrapper = document.createElement('div');
            repeaterWrapper.className = 'repeater-list';
            repeaterWrapper.id = `repeater-list-${section.id}`;
            
            const items = appState.formData[section.id] || [];
            items.forEach((item, index) => {
                repeaterWrapper.appendChild(buildRepeaterCardDOM(section, index, item));
            });

            grid.appendChild(repeaterWrapper);

            // Add Record Button Assembly Component
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'add-repeater-item-btn';
            addBtn.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Add New Record Entry
            `;
            addBtn.addEventListener('click', () => addNewRepeaterRecordRow(section.id));
            grid.appendChild(addBtn);
        } else {
            section.fields.forEach(field => {
                grid.appendChild(buildStandardInputFieldDOM(section.id, field));
            });
        }

        sectionNode.appendChild(grid);
        formContainer.appendChild(sectionNode);
    });
}

function buildStandardInputFieldDOM(sectionId, field) {
    const wrapper = document.createElement('div');
    wrapper.className = `input-group ${field.fullWidth ? 'full-width' : ''}`;
    
    const value = appState.formData[sectionId]?.[field.id] || '';

    if (field.type === 'image') {
        wrapper.innerHTML = `
            <label>${field.label}</label>
            <div class="photo-upload-wrapper">
                <div class="photo-preview-container">
                    <img id="img-preview-${field.id}" src="${value || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23e2e8f0%22/></svg>'}" alt="Avatar Preview"/>
                    <label for="file-input-${field.id}" class="upload-overlay">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                    </label>
                </div>
                <div class="upload-instructions">
                    <label for="file-input-${field.id}" class="upload-label-btn">Upload Image Resource File</label>
                    <div class="input-hint">JPG, PNG data channels supported.</div>
                </div>
                <input type="file" id="file-input-${field.id}" class="hidden-input" accept="image/*" />
            </div>
        `;
        
        setTimeout(() => {
            const inputNode = document.getElementById(`file-input-${field.id}`);
            inputNode?.addEventListener('change', (e) => pipelineImageConversion(e, sectionId, field.id));
        }, 0);

        return wrapper;
    }

    wrapper.innerHTML = `<label for="f-${sectionId}-${field.id}">${field.label}</label>`;

    let inputNode;
    if (field.type === 'textarea') {
        inputNode = document.createElement('textarea');
        inputNode.rows = 4;
    } else {
        inputNode = document.createElement('input');
        inputNode.type = field.type;
    }

    inputNode.id = `f-${sectionId}-${field.id}`;
    inputNode.placeholder = field.placeholder || '';
    inputNode.value = value;
    
    inputNode.addEventListener('input', (e) => {
        appState.formData[sectionId][field.id] = e.target.value;
        saveStateToLocalStorage();
        triggerLiveCanvasPipelineUpdate();
    });

    wrapper.appendChild(inputNode);
    if (field.hint) {
        const hint = document.createElement('div');
        hint.className = 'input-hint';
        hint.innerText = field.hint;
        wrapper.appendChild(hint);
    }

    return wrapper;
}

function buildRepeaterCardDOM(section, index, initialData) {
    const card = document.createElement('div');
    card.className = 'repeater-card';
    
    card.innerHTML = `
        <div class="repeater-card-header">
            <span class="repeater-index-title">${section.title} Entry Record #${index + 1}</span>
            <button type="button" class="remove-repeater-item-btn" title="Remove Record Row">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;

    card.querySelector('.remove-repeater-item-btn').addEventListener('click', () => {
        removeRepeaterRecordRow(section.id, index);
    });

    section.repeaterBlueprint.forEach(field => {
        const group = document.createElement('div');
        group.className = `input-group ${field.fullWidth ? 'full-width' : ''}`;
        group.innerHTML = `<label>${field.label}</label>`;

        let inputNode;
        if (field.type === 'textarea') {
            inputNode = document.createElement('textarea');
            inputNode.rows = 3;
        } else {
            inputNode = document.createElement('input');
            inputNode.type = field.type;
        }

        inputNode.placeholder = field.placeholder || '';
        inputNode.value = initialData[field.id] || '';
        
        inputNode.addEventListener('input', (e) => {
            appState.formData[section.id][index][field.id] = e.target.value;
            saveStateToLocalStorage();
            triggerLiveCanvasPipelineUpdate();
        });

        group.appendChild(inputNode);
        card.appendChild(group);
    });

    return card;
}

/* ==========================================================================
   REPEATER ACTIONS ENGINE & CONTROL TRANSITIONS
   ========================================================================== */
function toggleFormSectionAccordion(sectionId) {
    appState.expandedSections[sectionId] = !appState.expandedSections[sectionId];
    saveStateToLocalStorage();
    
    const node = document.querySelector(`.form-section[data-section-id="${sectionId}"]`);
    if (node) {
        node.classList.toggle('expanded', appState.expandedSections[sectionId]);
    }
}

function addNewRepeaterRecordRow(sectionId) {
    const blueprint = formBlueprint.find(b => b.id === sectionId);
    if (!blueprint) return;

    const newRecordObj = {};
    blueprint.repeaterBlueprint.forEach(f => newRecordObj[f.id] = '');
    
    appState.formData[sectionId].push(newRecordObj);
    saveStateToLocalStorage();
    
    buildDynamicFormDOM();
    triggerLiveCanvasPipelineUpdate();
}

function removeRepeaterRecordRow(sectionId, index) {
    appState.formData[sectionId].splice(index, 1);
    saveStateToLocalStorage();
    
    buildDynamicFormDOM();
    triggerLiveCanvasPipelineUpdate();
    showToastMessage('Record removed successfully.', 'danger');
}

function pipelineImageConversion(event, sectionId, fieldId) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = function() {
        const dataUrl = reader.result;
        appState.formData[sectionId][fieldId] = dataUrl;
        saveStateToLocalStorage();
        
        const img = document.getElementById(`img-preview-${fieldId}`);
        if (img) img.src = dataUrl;
        
        triggerLiveCanvasPipelineUpdate();
        showToastMessage('Image asset loaded into application sandbox.', 'success');
    };
    reader.readAsDataURL(file);
}

/* ==========================================================================
   PRINT TEMPLATE RENDERING MATRIX ENGINES
   ========================================================================== */
function triggerLiveCanvasPipelineUpdate() {
    const canvas = document.getElementById('resumeCanvas');
    if (!canvas) return;

    // Reset template state wrapper CSS classes mappings definitions layout
    canvas.className = `resume-canvas template-${appState.selectedTemplate}`;
    
    const d = appState.formData;

    if (appState.selectedTemplate === 'tech') {
        // Splitted Sidebar Layout Pipeline Layout Spec
        canvas.innerHTML = `
            <header class="canvas-header">
                ${d.personal?.profileImage ? `<img class="canvas-profile-img" src="${d.personal.profileImage}" alt="Profile avatar asset" />` : '<div class="canvas-profile-img"></div>'}
                <div class="canvas-identity">
                    <h2>${d.personal?.fullName || 'Your Full Name'}</h2>
                    <p>${d.personal?.jobTitle || 'Target Job Title'}</p>
                </div>
                <div class="canvas-contact">
                    ${d.personal?.email ? `<div>${d.personal.email}</div>` : ''}
                    ${d.personal?.phone ? `<div>${d.personal.phone}</div>` : ''}
                    ${d.personal?.location ? `<div>${d.personal.location}</div>` : ''}
                    ${d.personal?.website ? `<div>${d.personal.website}</div>` : ''}
                </div>
            </header>
            <div class="tech-main-col">
                ${renderExperienceCanvasLayer(d.experience)}
                ${renderEducationCanvasLayer(d.education)}
            </div>
            <div class="tech-side-col">
                ${renderSummarySectionCanvasLayer(d.personal?.summary)}
                ${renderSkillsSectionCanvasLayer(d.skills?.list)}
                ${renderSocialLinksCanvasLayer(d.personal)}
            </div>
        `;
    } else {
        // Linear Flow Render Pipelines Matrix Layout (Modern & Executive)
        canvas.innerHTML = `
            <header class="canvas-header">
                <div class="canvas-identity">
                    <h2>${d.personal?.fullName || 'Your Full Name'}</h2>
                    <p>${d.personal?.jobTitle || 'Target Job Title'}</p>
                </div>
                <div class="canvas-contact">
                    ${d.personal?.email ? `<div>${d.personal.email}</div>` : ''}
                    ${d.personal?.phone ? `<div>${d.personal.phone}</div>` : ''}
                    ${d.personal?.location ? `<div>${d.personal.location}</div>` : ''}
                    ${d.personal?.website ? `<div>${d.personal.website}</div>` : ''}
                    ${d.personal?.linkedin ? `<div>${d.personal.linkedin}</div>` : ''}
                    ${d.personal?.github ? `<div>${d.personal.github}</div>` : ''}
                </div>
            </header>
            ${renderSummarySectionCanvasLayer(d.personal?.summary)}
            ${renderExperienceCanvasLayer(d.experience)}
            ${renderEducationCanvasLayer(d.education)}
            ${renderSkillsSectionCanvasLayer(d.skills?.list)}
        `;
    }
}

function renderSummarySectionCanvasLayer(summaryText) {
    if (!summaryText) return '';
    return `
        <section class="canvas-section">
            <h3 class="canvas-section-title">Executive Summary</h3>
            <p class="canvas-item-desc">${summaryText}</p>
        </section>
    `;
}

function renderExperienceCanvasLayer(expList) {
    if (!expList || expList.length === 0) return '';
    let blocksHtml = '';
    
    expList.forEach(item => {
        blocksHtml += `
            <div class="canvas-item-block">
                <div class="canvas-item-meta">
                    <span class="canvas-item-title">${item.company || 'Organization Name'}</span>
                    <span class="canvas-item-date">${item.duration || 'Timeline frame'}</span>
                </div>
                <div class="canvas-item-meta">
                    <span class="canvas-item-subtitle">${item.role || 'Job title role'}</span>
                    <span class="canvas-item-date" style="font-style: italic;">${item.location || ''}</span>
                </div>
                ${item.description ? `<p class="canvas-item-desc">${item.description}</p>` : ''}
            </div>
        `;
    });

    return `
        <section class="canvas-section">
            <h3 class="canvas-section-title">Professional History</h3>
            <div>${blocksHtml}</div>
        </section>
    `;
}

function renderEducationCanvasLayer(eduList) {
    if (!eduList || eduList.length === 0) return '';
    let blocksHtml = '';

    eduList.forEach(item => {
        blocksHtml += `
            <div class="canvas-item-block">
                <div class="canvas-item-meta">
                    <span class="canvas-item-title">${item.institution || 'Institution entity'}</span>
                    <span class="canvas-item-date">${item.duration || ''}</span>
                </div>
                <div class="canvas-item-meta">
                    <span class="canvas-item-subtitle">${item.degree || 'Degree certification'}</span>
                </div>
                ${item.honors ? `<p class="canvas-item-desc" style="font-style: italic; color: var(--canvas-text-muted);">${item.honors}</p>` : ''}
            </div>
        `;
    });

    return `
        <section class="canvas-section">
            <h3 class="canvas-section-title">Education Architecture</h3>
            <div>${blocksHtml}</div>
        </section>
    `;
}

function renderSkillsSectionCanvasLayer(skillsCommaStr) {
    if (!skillsCommaStr) return '';
    const array = skillsCommaStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (array.length === 0) return '';

    let tagsHtml = '';
    array.forEach(skill => {
        tagsHtml += `<span class="skill-tag">${skill}</span>`;
    });

    return `
        <section class="canvas-section">
            <h3 class="canvas-section-title">Target Core Capabilities</h3>
            <div class="tag-cloud">${tagsHtml}</div>
        </section>
    `;
}

function renderSocialLinksCanvasLayer(personal) {
    if (!personal?.linkedin && !personal?.github) return '';
    return `
        <section class="canvas-section">
            <h3 class="canvas-section-title">Social Matrices</h3>
            <div style="font-size: 0.82rem; display: flex; flex-direction: column; gap: 4px;">
                ${personal.linkedin ? `<div><strong>LinkedIn:</strong> ${personal.linkedin}</div>` : ''}
                ${personal.github ? `<div><strong>GitHub:</strong> ${personal.github}</div>` : ''}
            </div>
        </section>
    `;
}

/* ==========================================================================
   EXPORT PIPELINE GATEWAY MECHANICS (html2pdf integration execution)
   ========================================================================== */
function executeExportPdfPipeline() {
    const targetElement = document.getElementById('resumeCanvas');
    if (!targetElement) return;

    showToastMessage('Generating optimized ATS data layer structure...', 'success');
    
    const ownerName = appState.formData.personal?.fullName || 'Resume';
    const optimizedFileName = `${ownerName.replace(/\s+/g, '_')}_ATS_Optimized.pdf`;

    const renderingOptions = {
        margin: 0,
        filename: optimizedFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(renderingOptions).from(targetElement).save()
        .then(() => {
            showToastMessage('PDF download sequence finished.', 'success');
        })
        .catch(err => {
            console.error(err);
            showToastMessage('Export fault encountered during pipeline execution.', 'danger');
        });
}

/* ==========================================================================
   GLOBAL TELEMETRY ENGINE CONNECTORS & BOOTSTRAP PIPELINE
   ========================================================================== */
function showToastMessage(msg, type = 'success') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    toast.innerText = msg;
    toast.className = `toast-card show toast-${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function registerApplicationEventWireframes() {
    // Theme Switcher Wireframe Hook
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
        appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', appState.theme);
        saveStateToLocalStorage();
    });

    // Reset Application Data Parameters Engine Wireframe Hook
    document.getElementById('clearDataBtn')?.addEventListener('click', () => {
        if (confirm('Are you absolutely certain you desire to scrub all saved inputs data?')) {
            setupDefaultEmptyState();
            saveStateToLocalStorage();
            buildDynamicFormDOM();
            triggerLiveCanvasPipelineUpdate();
            showToastMessage('System state variables scrubbed.', 'danger');
        }
    });

    // Template Selector Wireframe Event Routing Engine Mapping Loop
    document.querySelectorAll('.template-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.currentTarget;
            document.querySelectorAll('.template-option').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            
            appState.selectedTemplate = targetBtn.getAttribute('data-template');
            saveStateToLocalStorage();
            triggerLiveCanvasPipelineUpdate();
        });
    });

    // Export Action System Pipeline Gateway Hook
    document.getElementById('downloadPdfBtn')?.addEventListener('click', executeExportPdfPipeline);
}

// Global Application Sandbox Engine Ignition Pipeline Bootstrap Entry point
document.addEventListener('DOMContentLoaded', () => {
    initApplicationEngineState();
    
    // Set system theme initial render layout matrix matching cached environment configs
    document.documentElement.setAttribute('data-theme', appState.theme);
    
    // If local storage environment contains no payload variables, boot up mock data schema architecture
    const storageCheck = localStorage.getItem(STORAGE_KEY);
    if (!storageCheck) {
        loadMockDataBlueprint();
    } else {
        buildDynamicFormDOM();
        triggerLiveCanvasPipelineUpdate();
    }
    
    registerApplicationEventWireframes();
});
