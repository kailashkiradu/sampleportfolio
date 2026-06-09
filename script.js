/* ==========================================================================
   Akash J - Criminology Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Management (Dark/Light Mode) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme or default to light theme
    const savedTheme = localStorage.getItem('portfolio-theme');

    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = 'light-theme';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });

    // --- 2. Mobile Menu Navigation ---
    const hamburger = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });

    // --- 3. Scroll Spy (Active Links) & Header Shrink ---
    const header = document.querySelector('.main-header');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Progress bar width
        if (totalHeight > 0) {
            const progress = (scrollPosition / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Active link spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // --- 4. Interactive Timeline Nodes ---
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        const header = item.querySelector('.timeline-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Collapse all timeline items
            timelineItems.forEach(t => t.classList.remove('active'));
            
            // Toggle current timeline item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- 5. Publications Filtering & Search ---
    const searchInput = document.getElementById('research-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const pubCards = document.querySelectorAll('.pub-card');

    function filterPublications() {
        const searchQuery = searchInput.value.toLowerCase().trim();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

        pubCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const summary = card.querySelector('.pub-summary').textContent.toLowerCase();
            const categoriesStr = card.getAttribute('data-categories') || '';
            const categories = categoriesStr.split(' ');

            const matchesSearch = title.includes(searchQuery) || summary.includes(searchQuery);
            const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);

            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                // Animation trigger
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

    // Input Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', filterPublications);
    }

    // Filter Buttons Listener
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPublications();
        });
    });

    // Toggle Abstract / Details within publication cards
    const toggleAbstractBtns = document.querySelectorAll('.toggle-abstract-btn');
    toggleAbstractBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const detailsDiv = document.getElementById(targetId);
            const contentSpan = btn.querySelector('.btn-text-content');
            
            btn.classList.toggle('active');
            detailsDiv.classList.toggle('active');
            
            if (detailsDiv.classList.contains('active')) {
                contentSpan.textContent = 'Hide Details';
            } else {
                contentSpan.textContent = 'Read Details';
            }
        });
    });

    // --- 6. Pre-filling Form and Scroll from CTAs ---
    const contactForm = document.getElementById('contact-form');
    const formSubject = document.getElementById('form-subject');

    // Inquire Service Buttons
    const serviceBtns = document.querySelectorAll('.service-inquire-btn');
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.getAttribute('data-service');
            if (formSubject) {
                formSubject.value = serviceName;
            }
            scrollToContactSection();
        });
    });

    // Request Draft Buttons
    const requestBtns = document.querySelectorAll('.request-btn');
    requestBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check if it has a data-subject
            const subjectText = btn.getAttribute('data-subject');
            if (subjectText && formSubject) {
                e.preventDefault(); // Prevent default hash jumping
                formSubject.value = 'Research Inquiry';
                const messageTextarea = document.getElementById('form-message');
                if (messageTextarea) {
                    messageTextarea.value = `Dear Akash J,\n\nI am interested in reading your research work: "${subjectText.replace('Request full text: ', '')}". Please share a preprint or draft version when available.\n\nThank you!`;
                }
                scrollToContactSection();
            }
        });
    });

    function scrollToContactSection() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const offsetTop = contactSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // --- 7. Print-CV Trigger ---
    const cvBtn = document.getElementById('cv-download-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
    }

    // --- 8. Contact Form Validation & Submission UI ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            const successFeedback = document.getElementById('form-success-feedback');
            const submitBtn = document.getElementById('form-submit-btn');

            let isValid = true;

            // Name validation
            if (nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('invalid');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('invalid');
            }

            // Message validation
            if (messageInput.value.trim() === '') {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('invalid');
            }

            if (isValid) {
                // Mock success submission state
                submitBtn.disabled = true;
                const origBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Sending Message...</span>';

                setTimeout(() => {
                    successFeedback.style.display = 'flex';
                    submitBtn.style.display = 'none';
                    
                    // Reset inputs
                    nameInput.value = '';
                    emailInput.value = '';
                    messageInput.value = '';
                    
                    // Reset after 8 seconds
                    setTimeout(() => {
                        successFeedback.style.display = 'none';
                        submitBtn.style.display = 'flex';
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = origBtnText;
                    }, 8000);

                }, 1000);
            }
        });
    }

    // --- 9. Dynamic Article Modal ---
    const blogCards = document.querySelectorAll('.blog-post-card');
    const modal = document.getElementById('article-modal');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const modalBody = document.getElementById('modal-article-body');

    // Rich articles content object
    const articlesData = {
        'tech-women': {
            category: 'Public Safety',
            date: 'June 8, 2026',
            readTime: '5 min read',
            title: 'Technology-Driven Pathways for Women\'s Vulnerability Reduction',
            content: `
                <p>Victimization of women in public and semi-public spaces remains a persistent societal concern. Modern spatial criminology explores how digital applications, geo-referenced location triggers, and social alarm networks can act as immediate deterrents and protective networks. In our research, we analyze technology not just as a utility, but as an active agent in decreasing female vulnerability.</p>
                
                <blockquote>"Safety technologies must not act as reactive alerts alone; they must serve as proactive crime prevention networks that integrate public community vigilance."</blockquote>

                <h3>Dynamic Geo-Fencing</h3>
                <p>One of the primary tools under study is localized geo-fencing. By linking municipal crime mapping registries with real-time transit applications, users can receive subtle indicators regarding low-lit or high-incident pathways. Proactive routing systems can suggest alternative, higher-visibility corridors, empowering individual transit decisions.</p>
                
                <h3>SOS Communication Matrices</h3>
                <p>Standard SOS alarms often fail due to network delays or un-monitored lines. A robust SOS matrix utilizes multi-channel broadcasts: it triggers simultaneous notifications to local emergency services, community security patrols, and immediate family contacts. Integrating audio-recording features during an active alert can also serve as immediate, legally-compliant digital evidence for case reviews.</p>
            `
        },
        'forest-dimensions': {
            category: 'Eco-Criminology',
            date: 'June 1, 2026',
            readTime: '6 min read',
            title: 'Integrating Forest Patrols with Remote GIS Spatial Criminology',
            content: `
                <p>Environmental protection is a critical sector of modern policing. Poaching, illegal logging, and wildlife smuggling exploit vast, un-monitored terrains to evade detection. By integrating Geographic Information Systems (GIS) with traditional ranger patrols, we can transition conservation from speculative surveillance to structured, data-driven security.</p>
                
                <blockquote>"Eco-criminology addresses crimes that harm the biosphere. Safeguarding remote forests requires high-resolution spatial models and community partnerships."</blockquote>

                <h3>GIS Spatial Crime Mapping</h3>
                <p>GIS systems compile geographical layouts, historical infraction logs, seasonal water bodies, and animal migration corridors. Overlapping these data points reveals clear spatial crime hotspots. Rangers can optimize patrol frequencies along high-risk routes, ensuring maximum deterrence with minimal fuel and personnel overhead.</p>
                
                <h3>Community-Focused Wildlife Control</h3>
                <p>No technology can replace local community insight. Involving indigenous and border communities as data collection hubs turns residents into partners. Providing digital tools for reporting illegal tracks or logging indicators bridges the communication gap between field officers and residents, building a collective defense system.</p>
            `
        },
        'migrant-integration': {
            category: 'Migration Studies',
            date: 'May 15, 2026',
            readTime: '4 min read',
            title: 'Acculturation and Legal Safeguards for Interstate Workers',
            content: `
                <p>Interstate labor migration is a core driver of economic expansion in industrial hubs. However, workers from different linguistic and cultural backgrounds often experience social displacement, creating complex challenges in community integration, social security access, and public safety perceptions.</p>

                <blockquote>"Integrating migrant workers requires balanced policies that cover labor rights, public security, and cultural exchange."</blockquote>

                <h3>The Process of Acculturation</h3>
                <p>When workers relocate to new states, they navigate cultural adjustments and hybridization. Unlicensed contractors often exploit language barriers, placing workers in high-risk labor environments with limited civic access. Criminological studies show that social isolation can increase crime vulnerability, emphasizing the need for legal safeguards.</p>

                <h3>Proposed Safeguards</h3>
                <p>We propose a three-tiered structural response to support transient workers:</p>
                <ul>
                    <li><strong>Multilingual Support Interfaces:</strong> Deployed community safety kiosks and labor advisory centers in regional languages to ease contact with civic authorities.</li>
                    <li><strong>Identity & Benefit Portability:</strong> Integrating local registration lists with national social security schemes to prevent labor abuse and secure healthcare access.</li>
                    <li><strong>Cultural Exchange Forums:</strong> Hosting community dialogue events to reduce biases and promote mutual respect between local communities and migrant workforces.</li>
                </ul>
            `
        }
    };

    // Open Modal
    blogCards.forEach(card => {
        card.addEventListener('click', () => {
            const postId = card.getAttribute('data-post-id');
            const article = articlesData[postId];

            if (article) {
                // Populate modal content
                modalBody.innerHTML = `
                    <div class="modal-article-header">
                        <div class="modal-article-meta">
                            <span class="modal-article-category">${article.category}</span>
                            <span>•</span>
                            <span>${article.date}</span>
                            <span>•</span>
                            <span>${article.readTime}</span>
                        </div>
                        <h2>${article.title}</h2>
                    </div>
                    <div class="modal-article-body">
                        ${article.content}
                    </div>
                `;

                // Show modal
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                body.style.overflow = 'hidden'; // Lock background scroll

                // Focus close button for accessibility
                modalCloseBtn.focus();
            }
        });
    });

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Restore scroll
        modalBody.innerHTML = ''; // Clear content
    }

    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal on click outside of modal card
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
