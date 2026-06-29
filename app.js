document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Navigation Menu & Scroll Highlight Logic
    // ----------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    // Mobile navigation drawer toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            const isActive = navLinks.classList.contains('active');
            menuToggle.innerHTML = isActive 
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
            }
        });

        // Close menu when clicking link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
            });
        });
    }

    // Scroll active link observer
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => item.classList.remove('active'));
                
                const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                } else if (id === 'home' || id === 'why-choose-us') {
                    const homeLink = document.getElementById('link-home');
                    if (homeLink) homeLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
        if (section) observer.observe(section);
    });

    // Shrink header on scroll
    const header = document.querySelector('.navbar-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.backgroundColor = 'rgba(7, 10, 19, 0.95)';
            header.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
        } else {
            header.style.padding = '1rem 0';
            header.style.backgroundColor = 'rgba(7, 10, 19, 0.75)';
            header.style.boxShadow = 'none';
        }
    });

    // ----------------------------------------------------
    // 2. Custom Dialog Modal Management
    // ----------------------------------------------------
    const modal = document.getElementById('registration-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalIconContainer = document.getElementById('modal-icon-container');
    const modalClose = document.getElementById('modal-close');
    const modalOk = document.getElementById('modal-ok');

    const showModal = (title, message, isSuccess = true) => {
        if (!modal) return;
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        if (isSuccess) {
            modalIconContainer.classList.remove('error-state');
            modalIconContainer.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="modal-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        } else {
            modalIconContainer.classList.add('error-state');
            modalIconContainer.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="modal-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        }
        
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalOk.focus();
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOk) modalOk.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    }

    // ----------------------------------------------------
    // 3. Event Cards Linkage Auto-Selection
    // ----------------------------------------------------
    const eventActionLinks = document.querySelectorAll('.event-action-link');
    const selectEventDropdown = document.getElementById('reg-event');

    eventActionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const eventVal = link.getAttribute('data-event-select');
            if (selectEventDropdown && eventVal) {
                selectEventDropdown.value = eventVal;
                // Clear any previous event validation error styling
                const errEvent = document.getElementById('err-event');
                if (errEvent) errEvent.classList.remove('active');
                selectEventDropdown.classList.remove('invalid');
            }
        });
    });

    // ----------------------------------------------------
    // 4. Form Validation Logic
    // ----------------------------------------------------
    const form = document.getElementById('event-register-form');
    const inputFullname = document.getElementById('reg-fullname');
    const inputEmail = document.getElementById('reg-email');
    const inputPhone = document.getElementById('reg-phone');
    const selectEvent = document.getElementById('reg-event');

    const errFullname = document.getElementById('err-fullname');
    const errEmail = document.getElementById('err-email');
    const errPhone = document.getElementById('err-phone');
    const errEvent = document.getElementById('err-event');

    // Email regex validator
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Phone number regex (flexible 10 digits standard check)
    const isValidPhone = (phone) => {
        const regex = /^\d{10}$/;
        // Clear non-digit chars to validate 10 digits
        const digits = phone.replace(/\D/g, '');
        return regex.test(digits);
    };

    // Helper to toggle error messages
    const toggleFieldValidity = (inputEl, errorEl, isValid) => {
        if (isValid) {
            inputEl.classList.remove('invalid');
            errorEl.classList.remove('active');
        } else {
            inputEl.classList.add('invalid');
            errorEl.classList.add('active');
        }
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let formIsValid = true;

            // 1. Name validation
            const nameVal = inputFullname.value.trim();
            if (nameVal === '') {
                toggleFieldValidity(inputFullname, errFullname, false);
                formIsValid = false;
            } else {
                toggleFieldValidity(inputFullname, errFullname, true);
            }

            // 2. Email validation
            const emailVal = inputEmail.value.trim();
            if (emailVal === '' || !isValidEmail(emailVal)) {
                toggleFieldValidity(inputEmail, errEmail, false);
                formIsValid = false;
            } else {
                toggleFieldValidity(inputEmail, errEmail, true);
            }

            // 3. Phone validation
            const phoneVal = inputPhone.value.trim();
            if (phoneVal === '' || !isValidPhone(phoneVal)) {
                toggleFieldValidity(inputPhone, errPhone, false);
                formIsValid = false;
            } else {
                toggleFieldValidity(inputPhone, errPhone, true);
            }

            // 4. Event select validation
            const eventVal = selectEvent.value;
            if (eventVal === '' || eventVal === null) {
                toggleFieldValidity(selectEvent, errEvent, false);
                formIsValid = false;
            } else {
                toggleFieldValidity(selectEvent, errEvent, true);
            }

            // If form passes all validation checks, show success message
            if (formIsValid) {
                showModal(
                    "Registration Status", 
                    "Registration completed successfully! Thank you for registering.", 
                    true
                );
                
                // Reset form fields
                form.reset();
                
                // Clear any leftover field validation state styles
                [inputFullname, inputEmail, inputPhone, selectEvent].forEach(el => {
                    el.classList.remove('invalid');
                });
                [errFullname, errEmail, errPhone, errEvent].forEach(el => {
                    el.classList.remove('active');
                });
            }
        });

        // Real-time error clearance on input focus or change
        inputFullname.addEventListener('input', () => {
            if (inputFullname.value.trim() !== '') {
                toggleFieldValidity(inputFullname, errFullname, true);
            }
        });

        inputEmail.addEventListener('input', () => {
            if (isValidEmail(inputEmail.value.trim())) {
                toggleFieldValidity(inputEmail, errEmail, true);
            }
        });

        inputPhone.addEventListener('input', () => {
            if (isValidPhone(inputPhone.value.trim())) {
                toggleFieldValidity(inputPhone, errPhone, true);
            }
        });

        selectEvent.addEventListener('change', () => {
            if (selectEvent.value !== '') {
                toggleFieldValidity(selectEvent, errEvent, true);
            }
        });
    }

    // ----------------------------------------------------
    // 5. Event Preparation Planner Logic
    // ----------------------------------------------------
    const taskInput = document.getElementById('planner-task-input');
    const addTaskBtn = document.getElementById('planner-add-btn');
    const plannerList = document.getElementById('planner-list');
    const taskCountSpan = document.getElementById('planner-count');
    const clearCompletedBtn = document.getElementById('planner-clear-completed');

    // Default sample tasks
    const defaultTasks = [
        "Book venue",
        "Confirm chief guest",
        "Arrange refreshments",
        "Design event posters",
        "Send invitations",
        "Prepare registration desk",
        "Arrange sound system"
    ];

    // Local storage key prefix
    const LOCAL_STORAGE_KEY = 'smes_planner_tasks';

    // Fetch tasks list
    let plannerTasks = [];

    const loadTasks = () => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            plannerTasks = JSON.parse(saved);
        } else {
            // Populate defaults
            plannerTasks = defaultTasks.map((text, idx) => ({
                id: Date.now() + idx,
                text: text,
                completed: false
            }));
            saveTasks();
        }
    };

    const saveTasks = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plannerTasks));
    };

    const updatePlannerUI = () => {
        if (!plannerList) return;
        
        plannerList.innerHTML = '';
        
        if (plannerTasks.length === 0) {
            plannerList.innerHTML = `<li class="planner-item" style="justify-content: center; color: var(--text-dark); font-style: italic;">No tasks in planner. Add one to start preparing!</li>`;
            taskCountSpan.textContent = "Total Tasks: 0";
            if (clearCompletedBtn) clearCompletedBtn.style.display = 'none';
            return;
        }

        let completedCount = 0;

        plannerTasks.forEach(task => {
            if (task.completed) completedCount++;

            const li = document.createElement('li');
            li.className = 'planner-item';
            li.setAttribute('data-id', task.id);

            // Checkbox and label wrapper
            const label = document.createElement('label');
            label.className = 'planner-checkbox-label';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

            const span = document.createElement('span');
            span.textContent = task.text;

            label.appendChild(checkbox);
            label.appendChild(span);

            // Delete button ("Remove Task")
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-task-btn';
            removeBtn.textContent = 'Remove Task';
            removeBtn.setAttribute('aria-label', `Remove task: ${task.text}`);
            removeBtn.addEventListener('click', () => removeTask(task.id));

            li.appendChild(label);
            li.appendChild(removeBtn);
            
            plannerList.appendChild(li);
        });

        // Update counts
        taskCountSpan.textContent = `Total Tasks: ${plannerTasks.length} (${completedCount} completed)`;
        
        // Show/hide clear completed
        if (clearCompletedBtn) {
            clearCompletedBtn.style.display = completedCount > 0 ? 'block' : 'none';
        }
    };

    const addNewTask = () => {
        if (!taskInput) return;
        const text = taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        plannerTasks.push(newTask);
        saveTasks();
        updatePlannerUI();
        taskInput.value = '';
        taskInput.focus();
    };

    const removeTask = (id) => {
        plannerTasks = plannerTasks.filter(task => task.id !== id);
        saveTasks();
        updatePlannerUI();
    };

    const toggleTaskCompletion = (id) => {
        const task = plannerTasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            updatePlannerUI();
        }
    };

    const clearCompletedTasks = () => {
        plannerTasks = plannerTasks.filter(task => !task.completed);
        saveTasks();
        updatePlannerUI();
    };

    // Bind Planner Events
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addNewTask);
    }
    if (taskInput) {
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addNewTask();
            }
        });
    }
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }

    // Initialize planner
    loadTasks();
    updatePlannerUI();
});
