/**
 * Resume Builder Pro - Core Architecture Engine
 * Orchestrates real-time state mirror sync, dynamic structural repeaters,
 * asset buffering, and micro-animations via custom declarative state pipelines.
 */

// Application Constants & State Configurations
const LOCAL_STORAGE_KEY = 'resume_builder_pro_state';
const DEFAULT_AVATAR_PLACEHOLDER = ''; // Defaults to high-quality computed inline vector fallback on load if empty

// Main Core Application Instance State Layer
let appState = {
    theme: 'light',
    selectedTemplate: 'modern',
    personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        avatarDataUrl: DEFAULT_AVATAR_PLACEHOLDER
    },
    summaryText: '',
    experience: [],
    education: [],
    projects: [],
    skillsInput: '',
    certification: [],
    languagesInput: '',
    achievementsInput: '',
    interestsInput: ''
};

// ==========================================================================
// 1. DOM INITIALIZATION & EVENT LANDING PIPELINE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Phase 1: Initialize Framework Dependencies
    initLucideIcons();
    
    // Phase 2: Load State Matrix
    loadStateFromStorage();
    
    // Phase 3: Bind Core Global Interactivity Elements
    registerCoreEventBindings();
    
    // Phase 4: Construct Array Repeater DOM Nodes
    renderAllRepeaterForms();
    
    // Phase 5: Complete Initial Mirror Processing Sync
    hydrateFormUiFromState();
    executeLiveRenderPipeline();
});

function initLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ==========================================================================
// 2. FORM ACTION EVENT ROUTERS & SYSTEM LISTENERS
// ==========================================================================
function registerCoreEventBindings() {
    // Theme Switch Orchestrator
    document.getElementById('themeToggleBtn').addEventListener('click', toggleThemeMode);
    
    // Reset Data Workflow
    document.getElementById('resetFormBtn').addEventListener('click', triggerFormResetWorkflow);
    
    // PDF Export Blueprint Trigger
    document.getElementById('downloadPdfBtn').addEventListener('click', executePdfExportArchitecture);
    
    // Profile Photo Raw File Capture
    document.getElementById('photoUpload').addEventListener('change', processProfilePhotoBinaryStream);
    
    // Template Switch Matrix Selection Linkages
    document.querySelectorAll('.template-option').forEach(element => {
        element.addEventListener('click', (e) => {
            const targetButton = e.currentTarget;
            document.querySelectorAll('.template-option').forEach(btn => btn.classList.remove('active'));
            targetButton.classList.add('active');
            
            appState.selectedTemplate = targetButton.getAttribute('data-template');
            commitStateToStorage();
            executeLiveRenderPipeline();
        });
    });

    // Accordion Interactive Trigger Dispatches
    document.querySelectorAll('.section-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const fieldset = trigger.parentElement;
            const isExpanded = fieldset.classList.contains('expanded');
            
            // Toggle clicked section
            if (isExpanded) {
                fieldset.classList.remove('expanded');
            } else {
                // Collapse sibling accordion panels smoothly
                document.querySelectorAll('.form-section').forEach(section => section.classList.remove('expanded'));
                fieldset.classList.add('expanded');
            }
        });
    });

    // Native Live Keypress Event Interceptors for Top-Level Declarations
    const inlineSyncMap = [
        { id: 'fullName', section: 'personalInfo', key: 'fullName' },
        { id: 'jobTitle', section: 'personalInfo', key: 'jobTitle' },
        { id: 'email', section: 'personalInfo', key: 'email' },
        { id: 'phone', section: 'personalInfo', key: 'phone' },
        { id: 'location', section: 'personalInfo', key: 'location' },
        { id: 'linkedin', section: 'personalInfo', key: 'linkedin' },
        { id: 'github', section: 'personalInfo', key: 'github' },
        { id: 'portfolio', section: 'personalInfo', key: 'portfolio' },
        { id: 'summaryText', section: null, key: 'summaryText' },
        { id: 'skillsInput', section: null, key: 'skillsInput' },
        { id: 'languagesInput', section: null, key: 'languagesInput' },
        { id: 'achievementsInput', section: null, key: 'achievementsInput' },
        { id: 'interestsInput', section: null, key: 'interestsInput' }
    ];

    inlineSyncMap.forEach(binding => {
        const inputElement = document.getElementById(binding.id);
        if (inputElement) {
            inputElement.addEventListener('input', (e) => {
                if (binding.section) {
                    appState[binding.section][binding.key] = e.target.value;
                } else {
                    appState[binding.key] = e.target.value;
                }
                commitStateToStorage();
                executeLiveRenderPipeline();
            });
        }
    });

    // Array Expansion Add Button Target Links
    document.getElementById('addExperienceBtn').addEventListener('click', () => pushNewRepeaterItem('experience'));
    document.getElementById('addEducationBtn').addEventListener('click', () => pushNewRepeaterItem('education'));
    document.getElementById('addProjectBtn').addEventListener('click', () => pushNewRepeaterItem('projects'));
    document.getElementById('addCertificationBtn').addEventListener('click', () => pushNewRepeaterItem('certification'));
}

// ==========================================================================
// 3. STORAGE SYNC & THEME ENGINE FLUID ARCHITECTURE
// ==========================================================================
function loadStateFromStorage() {
    try {
        const storedJson = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedJson) {
            const parsedState = JSON.parse(storedJson);
            // Deep merge safety matching structural properties
            appState = Object.assign({}, appState, parsedState);
        } else {
            loadMockDataBlueprint();
        }
    } catch (e) {
        console.error("Storage read exception cleared. Standard layout injected.", e);
        loadMockDataBlueprint();
    }
}

function commitStateToStorage() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("State compilation storage synchronization breakdown", e);
    }
}

function hydrateFormUiFromState() {
    // Set theme global token attribute binding context
    document.documentElement.setAttribute('data-theme', appState.theme || 'light');
    updateThemeIconState(appState.theme);

    // Synchronize active template selection buttons
    document.querySelectorAll('.template-option').forEach(btn => {
        if (btn.getAttribute('data-template') === appState.selectedTemplate) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Bind Base Primary Personal Data Form Elements
    document.getElementById('fullName').value = appState.personalInfo.fullName || '';
    document.getElementById('jobTitle').value = appState.personalInfo.jobTitle || '';
    document.getElementById('email').value = appState.personalInfo.email || '';
    document.getElementById('phone').value = appState.personalInfo.phone || '';
    document.getElementById('location').value = appState.personalInfo.location || '';
    document.getElementById('linkedin').value = appState.personalInfo.linkedin || '';
    document.getElementById('github').value = appState.personalInfo.github || '';
    document.getElementById('portfolio').value = appState.personalInfo.portfolio || '';

    // Handle Profile Image Data Payload Processing
    if (appState.personalInfo.avatarDataUrl) {
        document.getElementById('avatarPreview').src = appState.personalInfo.avatarDataUrl;
    }

    // Freeform Text Inputs Data Mapping
    document.getElementById('summaryText').value = appState.summaryText || '';
    document.getElementById('skillsInput').value = appState.skillsInput || '';
    document.getElementById('languagesInput').value = appState.languagesInput || '';
    document.getElementById('achievementsInput').value = appState.achievementsInput || '';
    document.getElementById('interestsInput').value = appState.interestsInput || '';
}

function toggleThemeMode() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const computedNextTheme = (activeTheme === 'dark') ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', computedNextTheme);
    appState.theme = computedNextTheme;
    
    updateThemeIconState(computedNextTheme);
    commitStateToStorage();
    triggerToastNotification("Theme presentation configuration modified", "success");
}

function updateThemeIconState(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (!themeIcon) return;
    
    if (theme === 'dark') {
        themeIcon.setAttribute('data-lucide', 'moon');
    } else {
        themeIcon.setAttribute('data-lucide', 'sun');
    }
    initLucideIcons();
}

function processProfilePhotoBinaryStream(event) {
    const targetedFile = event.target.files[0];
    if (!targetedFile) return;

    // Security Assessment Constraint Check (Verify under 2.5MB ceiling allocation)
    if (targetedFile.size > 2500000) {
        triggerToastNotification("Image resource context exceeds 2.5MB payload constraints.", "danger");
        return;
    }

    const standardFileReader = new FileReader();
    standardFileReader.onload = function (readerEvent) {
        const base64UriString = readerEvent.target.result;
        appState.personalInfo.avatarDataUrl = base64UriString;
        document.getElementById('avatarPreview').src = base64UriString;
        
        commitStateToStorage();
        executeLiveRenderPipeline();
        triggerToastNotification("Profile imagery assets successfully rasterized", "success");
    };
    standardFileReader.readAsDataURL(targetedFile);
}

// ==========================================================================
// 4. MULTI-RECORD DYNAMIC ARRAYS & REPEATER UI FACTORIES
// ==========================================================================
function renderAllRepeaterForms() {
    renderSingleRepeaterSet('experience', 'experienceRepeaterContainer');
    renderSingleRepeaterSet('education', 'educationRepeaterContainer');
    renderSingleRepeaterSet('projects', 'projectRepeaterContainer');
    renderSingleRepeaterSet('certification', 'certificationRepeaterContainer');
}

function renderSingleRepeaterSet(stateTargetKey, domContainerId) {
    const targetParentNode = document.getElementById(domContainerId);
    if (!targetParentNode) return;
    
    targetParentNode.innerHTML = '';
    const arrayRecords = appState[stateTargetKey] || [];

    arrayRecords.forEach((itemRecord, arrayIndex) => {
        const structuredCard = document.createElement('div');
        structuredCard.className = 'repeater-card';
        structuredCard.setAttribute('data-index', arrayIndex);

        let bodyInputFieldsHtml = '';

        // Dynamic Schema Routing Matrix
        if (stateTargetKey === 'experience') {
            bodyInputFieldsHtml = `
                <div class="repeater-card-header">
                    <span class="repeater-index-title">Experience Block #${arrayIndex + 1}</span>
                    <button type="button" class="remove-repeater-item-btn" onclick="deleteRepeaterItem('experience', ${arrayIndex})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="input-group"><label>Company</label><input type="text" data-field="company" value="${itemRecord.company || ''}"></div>
                <div class="input-group"><label>Role / Position</label><input type="text" data-field="position" value="${itemRecord.position || ''}"></div>
                <div class="input-group"><label>Timeline / Dates</label><input type="text" data-field="duration" placeholder="e.g. Mar 2022 - Present" value="${itemRecord.duration || ''}"></div>
                <div class="input-group"><label>Location</label><input type="text" data-field="location" placeholder="e.g. Remote" value="${itemRecord.location || ''}"></div>
                <div class="input-group full-width"><label>Responsibilities & Scope</label><textarea rows="3" data-field="description">${itemRecord.description || ''}</textarea></div>
            `;
        } else if (stateTargetKey === 'education') {
            bodyInputFieldsHtml = `
                <div class="repeater-card-header">
                    <span class="repeater-index-title">Education Block #${arrayIndex + 1}</span>
                    <button type="button" class="remove-repeater-item-btn" onclick="deleteRepeaterItem('education', ${arrayIndex})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="input-group"><label>Institution</label><input type="text" data-field="institution" value="${itemRecord.institution || ''}"></div>
                <div class="input-group"><label>Degree Major</label><input type="text" data-field="degree" value="${itemRecord.degree || ''}"></div>
                <div class="input-group"><label>Graduation Timeline</label><input type="text" data-field="duration" placeholder="e.g. 2018 - 2022" value="${itemRecord.duration || ''}"></div>
                <div class="input-group"><label>GPA / Honors (Opt)</label><input type="text" data-field="gpa" placeholder="e.g. 3.9/4.0" value="${itemRecord.gpa || ''}"></div>
            `;
        } else if (stateTargetKey === 'projects') {
            bodyInputFieldsHtml = `
                <div class="repeater-card-header">
                    <span class="repeater-index-title">Project Block #${arrayIndex + 1}</span>
                    <button type="button" class="remove-repeater-item-btn" onclick="deleteRepeaterItem('projects', ${arrayIndex})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="input-group"><label>Project Name</label><input type="text" data-field="title" value="${itemRecord.title || ''}"></div>
                <div class="input-group"><label>Technologies Used</label><input type="text" data-field="technologies" placeholder="e.g. Vanilla JS, CSSGrid" value="${itemRecord.technologies || ''}"></div>
                <div class="input-group full-width"><label>Project Target URL / Repo</label><input type="url" data-field="link" placeholder="github.com/..." value="${itemRecord.link || ''}"></div>
                <div class="input-group full-width"><label>Impact / Contribution Description</label><textarea rows="3" data-field="description">${itemRecord.description || ''}</textarea></div>
            `;
        } else if (stateTargetKey === 'certification') {
            bodyInputFieldsHtml = `
                <div class="repeater-card-header">
                    <span class="repeater-index-title">Certification #${arrayIndex + 1}</span>
                    <button type="button" class="remove-repeater-item-btn" onclick="deleteRepeaterItem('certification', ${arrayIndex})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div class="input-group"><label>Certification Name</label><input type="text" data-field="name" value="${itemRecord.name || ''}"></div>
                <div class="input-group"><label>Issuing Authority</label><input type="text" data-field="issuer" value="${itemRecord.issuer || ''}"></div>
                <div class="input-group full-width"><label>Date / License Key (Optional)</label><input type="text" data-field="date" value="${itemRecord.date || ''}"></div>
            `;
        }

        structuredCard.innerHTML = bodyInputFieldsHtml;
        
        // Loop map structural values securely dynamically on real-time interface key entries
        structuredCard.querySelectorAll('input, textarea').forEach(inputField => {
            inputField.addEventListener('input', (event) => {
                const targetModelField = event.target.getAttribute('data-field');
                appState[stateTargetKey][arrayIndex][targetModelField] = event.target.value;
                commitStateToStorage();
                executeLiveRenderPipeline();
            });
        });

        targetParentNode.appendChild(structuredCard);
    });

    initLucideIcons();
}

function pushNewRepeaterItem(stateTargetKey) {
    let emptyModelTemplate = {};
    let domContainerMappingId = '';

    if (stateTargetKey === 'experience') {
        emptyModelTemplate = { company: '', position: '', duration: '', location: '', description: '' };
        domContainerMappingId = 'experienceRepeaterContainer';
    } else if (stateTargetKey === 'education') {
        emptyModelTemplate = { institution: '', degree: '', duration: '', gpa: '' };
        domContainerMappingId = 'educationRepeaterContainer';
    } else if (stateTargetKey === 'projects') {
        emptyModelTemplate = { title: '', technologies: '', link: '', description: '' };
        domContainerMappingId = 'projectRepeaterContainer';
    } else if (stateTargetKey === 'certification') {
        emptyModelTemplate = { name: '', issuer: '', date: '' };
        domContainerMappingId = 'certificationRepeaterContainer';
    }

    if (!appState[stateTargetKey]) {
        appState[stateTargetKey] = [];
    }

    appState[stateTargetKey].push(emptyModelTemplate);
    commitStateToStorage();
    renderSingleRepeaterSet(stateTargetKey, domContainerMappingId);
    executeLiveRenderPipeline();
}

function deleteRepeaterItem(stateTargetKey, targetIndex) {
    let domContainerMappingId = '';
    if (stateTargetKey === 'experience') domContainerMappingId = 'experienceRepeaterContainer';
    if (stateTargetKey === 'education') domContainerMappingId = 'educationRepeaterContainer';
    if (stateTargetKey === 'projects') domContainerMappingId = 'projectRepeaterContainer';
    if (stateTargetKey === 'certification') domContainerMappingId = 'certificationRepeaterContainer';

    appState[stateTargetKey].splice(targetIndex, 1);
    commitStateToStorage();
    renderSingleRepeaterSet(stateTargetKey, domContainerMappingId);
    executeLiveRenderPipeline();
    triggerToastNotification("Segment iteration index dropped safely", "success");
}

// Global accessor assignment ensuring native declarative HTML execution contexts function
window.deleteRepeaterItem = deleteRepeaterItem;

// ==========================================================================
// 5. THE LIVE ATS HIGH-FIDELITY RENDER PIPELINE
// ==========================================================================
function executeLiveRenderPipeline() {
    const canvasMountPoint = document.getElementById('resumeCanvas');
    if (!canvasMountPoint) return;

    // Flush current engine css presentation layer state assignment token
    canvasMountPoint.className = `resume-canvas template-${appState.selectedTemplate}`;
    
    // Core HTML Document Construction Fragments Blueprint Assembly
    let renderingBufferHtml = '';

    // ================== LAYOUT ARCHITECTURE ROUTER MUX ==================
    if (appState.selectedTemplate === 'tech') {
        // Two-Column Asymmetric Engineering Layout Archetype
        renderingBufferHtml = `
            ${buildHeaderHtmlBlock()}
            <div class="tech-main-col">
                ${buildSummaryHtmlBlock()}
                ${buildExperienceHtmlBlock()}
                ${buildProjectsHtmlBlock()}
            </div>
            <div class="tech-side-col">
                ${buildSkillsHtmlBlock()}
                ${buildEducationHtmlBlock()}
                ${buildCertificationsHtmlBlock()}
                ${buildLanguagesHtmlBlock()}
                ${buildAchievementsHtmlBlock()}
                ${buildInterestsHtmlBlock()}
            </div>
        `;
    } else {
        // Classic Linear Modern & Executive Standard Single-Column Stack Formats
        renderingBufferHtml = `
            ${buildHeaderHtmlBlock()}
            ${buildSummaryHtmlBlock()}
            ${buildExperienceHtmlBlock()}
            ${buildEducationHtmlBlock()}
            ${buildProjectsHtmlBlock()}
            ${buildSkillsHtmlBlock()}
            ${buildCertificationsHtmlBlock()}
            ${buildLanguagesHtmlBlock()}
            ${buildAchievementsHtmlBlock()}
            ${buildInterestsHtmlBlock()}
        `;
    }

    canvasMountPoint.innerHTML = renderingBufferHtml;
}

// --------------------------------------------------------------------------
// COMPONENT COMPILERS: DYNAMIC DOM GENERATORS
// --------------------------------------------------------------------------
function buildHeaderHtmlBlock() {
    const p = appState.personalInfo;
    if (!p.fullName && !p.jobTitle && !p.email && !p.phone) {
        return `<div class="canvas-header"><div class="canvas-identity"><h2>Identity Structure</h2><p>Provide contact variables</p></div></div>`;
    }

    // Process structured array collection to strip clear space lines safely
    const contactDirectivesList = [];
    if (p.email) contactDirectivesList.push(`<span>${p.email}</span>`);
    if (p.phone) contactDirectivesList.push(`<span>${p.phone}</span>`);
    if (p.location) contactDirectivesList.push(`<span>${p.location}</span>`);
    if (p.linkedin) contactDirectivesList.push(`<span>${p.linkedin}</span>`);
    if (p.github) contactDirectivesList.push(`<span>${p.github}</span>`);
    if (p.portfolio) contactDirectivesList.push(`<span>${p.portfolio}</span>`);

    let parsedPhotoMarkup = '';
    if (appState.selectedTemplate === 'tech' && p.avatarDataUrl) {
        parsedPhotoMarkup = `<img src="${p.avatarDataUrl}" class="canvas-profile-img" alt="Profile Vector Link">`;
    }

    return `
        <div class="canvas-header">
            ${parsedPhotoMarkup}
            <div class="canvas-identity">
                <h2>${p.fullName || 'Your Full Name'}</h2>
                <p>${p.jobTitle || 'Target Career Title'}</p>
            </div>
            <div class="canvas-contact">
                ${contactDirectivesList.join(appState.selectedTemplate === 'executive' ? ' | ' : '')}
            </div>
        </div>
    `;
}

function buildSummaryHtmlBlock() {
    if (!appState.summaryText) return '';
    return `
        <div class="canvas-section">
            <div class="canvas-section-title">Professional Summary</div>
            <p class="canvas-item-desc">${appState.summaryText}</p>
        </div>
    `;
}

function buildExperienceHtmlBlock() {
    if (!appState.experience || appState.experience.length === 0) return '';
    
    const itemsMarkup = appState.experience.map(exp => {
        if (!exp.company && !exp.position) return '';
        return `
            <div style="margin-bottom: 12px;">
                <div class="canvas-item-meta">
                    <span class="canvas-item-title">${exp.position || 'Professional Title'}</span>
                    <span class="canvas-item-date">${exp.duration || ''}</span>
                </div>
                <div class="canvas-item-meta">
                    <span class="canvas-item-subtitle">${exp.company || 'Organization entity'}</span>
                    <span class="canvas-item-date" style="font-weight:400; font-size:0.8rem;">${exp.location || ''}</span>
                </div>
                ${exp.description ? `<p class="canvas-item-desc">${exp.description}</p>` : ''}
            </div>
        `;
    }).join('');

    return itemsMarkup ? `<div class="canvas-section"><div class="canvas-section-title">Work Experience</div>${itemsMarkup}</div>` : '';
}

function buildEducationHtmlBlock() {
    if (!appState.education || appState.education.length === 0) return '';

    const itemsMarkup = appState.education.map(edu => {
        if (!edu.institution && !edu.degree) return '';
        return `
            <div style="margin-bottom: 10px;">
                <div class="canvas-item-meta">
                    <span class="canvas-item-title">${edu.degree || 'Degree Major/Course'}</span>
                    <span class="canvas-item-date">${edu.duration || ''}</span>
                </div>
                <div class="canvas-item-meta">
                    <span class="canvas-item-subtitle">${edu.institution || 'Educational Establishment'}</span>
                    ${edu.gpa ? `<span class="canvas-item-date">${edu.gpa}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');

    return itemsMarkup ? `<div class="canvas-section"><div class="canvas-section-title">Education</div>${itemsMarkup}</div>` : '';
}

function buildProjectsHtmlBlock() {
    if (!appState.projects || appState.projects.length === 0) return '';

    const itemsMarkup = appState.projects.map(proj => {
        if (!proj.title) return '';
        return `
            <div style="margin-bottom: 12px;">
                <div class="canvas-item-meta">
                    <span class="canvas-item-title">${proj.title} ${proj.technologies ? `<span style="font-weight:500; font-size:0.78rem; color:var(--canvas-text-muted);">[ ${proj.technologies} ]</span>` : ''}</span>
                    ${proj.link ? `<span class="canvas-item-date" style="font-size:0.78rem;">${proj.link}</span>` : ''}
                </div>
                ${proj.description ? `<p class="canvas-item-desc">${proj.description}</p>` : ''}
            </div>
        `;
    }).join('');

    return itemsMarkup ? `<div class="canvas-section"><div class="canvas-section-title">Key Projects</div>${itemsMarkup}</div>` : '';
}

function buildSkillsHtmlBlock() {
    if (!appState.skillsInput) return '';
    
    // Split on commas and display clean tag tokens
    const skillTokens = appState.skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skillTokens.length === 0) return '';

    if (appState.selectedTemplate === 'executive') {
        return `
            <div class="canvas-section">
                <div class="canvas-section-title">Technical Expertise</div>
                <div style="line-height: 1.6; text-align: center;">
                    ${skillTokens.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div class="canvas-section">
            <div class="canvas-section-title">Skills Overview</div>
            <div class="tag-cloud">
                ${skillTokens.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `;
}

function buildCertificationsHtmlBlock() {
    if (!appState.certification || appState.certification.length === 0) return '';

    const itemsMarkup = appState.certification.map(cert => {
        if (!cert.name) return '';
        return `
            <div class="canvas-item-meta" style="margin-bottom: 4px;">
                <span class="canvas-item-title" style="font-size:0.88rem;">${cert.name} <span style="font-weight:500; font-size:0.8rem; color:var(--canvas-text-muted);">— ${cert.issuer || ''}</span></span>
                <span class="canvas-item-date">${cert.date || ''}</span>
            </div>
        `;
    }).join('');

    return itemsMarkup ? `<div class="canvas-section"><div class="canvas-section-title">Certifications</div>${itemsMarkup}</div>` : '';
}

function buildLanguagesHtmlBlock() {
    if (!appState.languagesInput) return '';
    return `
        <div class="canvas-section">
            <div class="canvas-section-title">Languages</div>
            <p class="canvas-item-desc" style="font-size:0.88rem;">${appState.languagesInput}</p>
        </div>
    `;
}

function buildAchievementsHtmlBlock() {
    if (!appState.achievementsInput) return '';
    return `
        <div class="canvas-section">
            <div class="canvas-section-title">Honors & Achievements</div>
            <p class="canvas-item-desc" style="font-size:0.88rem;">${appState.achievementsInput}</p>
        </div>
    `;
}

function buildInterestsHtmlBlock() {
    if (!appState.interestsInput) return '';
    return `
        <div class="canvas-section">
            <div class="canvas-section-title">Interests</div>
            <p class="canvas-item-desc" style="font-size:0.88rem; font-style: italic;">${appState.interestsInput}</p>
        </div>
    `;
}

// ==========================================================================
// 6. HIGH-FIDELITY PDF PRINT CONVERTER ARCHITECTURE
// ==========================================================================
function executePdfExportArchitecture() {
    const targetDocumentNode = document.getElementById('resumeCanvas');
    if (!targetDocumentNode) return;

    triggerToastNotification("Compiling layout engine assets...", "success");

    // Clean execution configurations optimized matching strict structural dimension ratios
    const layoutSettingsOptions = {
        margin: 0,
        filename: `${appState.personalInfo.fullName?.replace(/\s+/g, '_') || 'Resume'}_BuilderPro.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Instantiate and execute the pipeline promise chain wrapper natively
    window.html2pdf().set(layoutSettingsOptions).from(targetDocumentNode).save()
        .then(() => {
            triggerToastNotification("PDF file successfully distributed.", "success");
        })
        .catch((error) => {
            console.error("PDF generation pipeline breakdown context:", error);
            triggerToastNotification("Print conversion execution thread fault.", "danger");
        });
}

// ==========================================================================
// 7. RESET ACTION PIPELINES & SEED INJECTIONS
// ==========================================================================
function triggerFormResetWorkflow() {
    if (confirm("Are you certain you wish to purge all field modifications? Data configurations will be permanently overwritten.")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        
        // Wipe model property data mappings
        appState.personalInfo = { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', avatarDataUrl: '' };
        appState.summaryText = '';
        appState.experience = [];
        appState.education = [];
        appState.projects = [];
        appState.skillsInput = '';
        appState.certification = [];
        appState.languagesInput = '';
        appState.achievementsInput = '';
        appState.interestsInput = '';
        
        hydrateFormUiFromState();
        renderAllRepeaterForms();
        executeLiveRenderPipeline();
        
        triggerToastNotification("Workspace cleared to blank defaults", "success");
    }
}

function loadMockDataBlueprint() {
    appState.personalInfo = {
        fullName: "Alex Morgan",
        jobTitle: "Senior Frontend Engineer & Designer",
        email: "alex.morgan@designsystem.io",
        phone: "+1 (555) 019-2834",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexmorgan",
        github: "github.com/alexmorgan",
        portfolio: "alexmorgan.dev",
        avatarDataUrl: ""
    };
    appState.summaryText = "Innovative and performance-driven Frontend Engineer with over 6 years of expertise architecting fluid SaaS management tools and data platforms. Champion of strict clean systems, type-safe reactive structures, and responsive pixel layout choreography.";
    appState.skillsInput = "JavaScript (ES6+), TypeScript, Semantic HTML5, CSS3/PostCSS, UI/UX Engineering, Responsive Architecture, Canvas API, Performance Analysis";
    appState.experience = [
        {
            company: "Enterprise Cloud Ledger Systems",
            position: "Lead UI Systems Engineer",
            duration: "Jan 2024 - Present",
            location: "San Francisco, CA",
            description: "• Spearheaded redesign of core data tables lowering interaction latency by 45%\n• Built reusable vanilla components deployed across 4 sibling platform entities\n• Directed team of 6 engineers ensuring design token structural fidelity"
        },
        {
            company: "Core Dynamic Widgets Inc",
            position: "Senior Web App Developer",
            duration: "Jun 2021 - Dec 2023",
            location: "Austin, TX (Remote)",
            description: "• Implemented offline synchronization layers leveraging advanced LocalStorage buffers\n• Optimized render threads dropping initial system bundle parsing footprint by 32%"
        }
    ];
    appState.education = [
        {
            institution: "University of California, Berkeley",
            degree: "Bachelor of Science in Computer Science",
            duration: "2017 - 2021",
            gpa: "GPA 3.86 / 4.0"
        }
    ];
    appState.projects = [
        {
            title: "Micro State Orchestrator Matrix",
            technologies: "TypeScript, EventBus API",
            link: "github.com/alexm/matrix-sync",
            description: "A zero-dependency pub-sub engine maintaining transactional context consistency across async storage threads."
        }
    ];
    appState.certification = [
        { name: "Certified Web Architect Professional", issuer: "W3 Consortium Matrix", date: "2025" }
    ];
    appState.languagesInput = "English (Native), German (Conversational)";
    appState.achievementsInput = "• Winner of Global Core Hackathon 2025 (Out of 420 structural solution pitches)\n• Standardized code review workflows saving ~8 engineering hours weekly platform-wide";
    appState.interestsInput = "Open Source Library Maintenance, Type-face Typography Design, High-Altitude Mountaineering";
}

// ==========================================================================
// 8. TOAST NOTIFICATION TELEMETRY ENGINE
// ==========================================================================
function triggerToastNotification(displayMessage, statusType = 'success') {
    const toastNode = document.getElementById('toastNotification');
    if (!toastNode) return;

    toastNode.innerText = displayMessage;
    toastNode.className = `toast-card toast-${statusType} show`;

    // Drop show active animation classes after duration window bounds
    setTimeout(() => {
        toastNode.classList.remove('show');
    }, 3500);
}
