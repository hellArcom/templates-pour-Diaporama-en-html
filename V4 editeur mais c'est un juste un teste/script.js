      
      /////////////////////////////////
     //// Pour les diapositives   //// 
    /////////////////////////////////
    const slides = document.querySelectorAll('.slide');
    const slideCounter = document.querySelector('.slide-counter');
    let currentSlide = 0;
    const slidesLength = slides.length;

    function updateSlideCounter() {
        slideCounter.textContent = `${currentSlide + 1}/${slidesLength}`;
    }

    function showSlide(index) {
        if (index < 0 || index >= slidesLength) {
            console.error("Index de diapositive invalide.");
            return;
        }
        for (let i = 0; i < slidesLength; i++) {
            const slide = slides[i];
            slide.classList.remove('active', 'previous', 'next');
            if (i < index) {
                slide.classList.add('previous');
            } else if (i > index) {
                slide.classList.add('next');
            }
        }
        slides[index].classList.add('active');
        updateSlideCounter();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slidesLength;
        showSlide(currentSlide);
    }

    function previousSlide() {
        currentSlide = (currentSlide - 1 + slidesLength) % slidesLength;
        showSlide(currentSlide);
    }

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'Space':
            case 'ArrowRight':
            case 'Enter':
            case 'ArrowDown':
            case 'click':
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                previousSlide();
                break;
        }
    });

    document.addEventListener("click", (event) => {
        if (parametresOuvert) return;
        else nextSlide();
    });

      /////////////////////////////////
     ///// Reconnaissance vocale /////
    /////////////////////////////////
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecognizing = false;  // Suivi de l'état de la reconnaissance vocale
    let recognitionStarted = false;  // Vérifier si la reconnaissance est démarrée


    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            console.log('Commande vocale :', transcript);
            analyserCommande(transcript);
        };

        recognition.onerror = (e) => {
            console.error('Erreur reconnaissance vocale:', e);
        };

        recognition.onend = () => {
            if (isRecognizing) {
                recognition.start();  // Redémarre la reconnaissance si elle est activée
            }
        };

        const toggleVoiceCommand = document.getElementById('toggleVoiceCommand');

        // Gérer l'activation/désactivation de la commande vocale
        toggleVoiceCommand.addEventListener('change', (event) => {
            if (event.target.checked) {
                // Activer la reconnaissance vocale
                if (!recognitionStarted) {
                    recognition.start();
                    recognitionStarted = true;
                }
                isRecognizing = true;
                console.log('Commande vocale activée');
            } else {
                // Désactiver la reconnaissance vocale
                if (recognitionStarted) {
                    recognition.stop();
                    recognitionStarted = false;
                }
                isRecognizing = false;
                console.log('Commande vocale désactivée');
            }
        });

        function analyserCommande(phrase) {
            let clean = phrase.replace(/[.,!?]/g, '').trim(); // Enlève les signes de ponctuation

            // Commandes plus flexibles
            let Diapo0_command = /^(?:va au\s+)?(?:1|un)$/i;  // Diapo 1
            let Diapo1_command = /^(?:va au\s+)?(?:2|deux|de)$/i; // Diapo 2
            let Diapo2_command = /^(?:va au\s+)?(?:3|trois)$/i; // Diapo 3
            let Diapo3_command = /^(?:va au\s+)?(?:4)$/i;  // Diapo 4
            let Diapo4_command = /^(?:va au\s+)?(?:5)$/i;  // Diapo 5
            let Diapo5_command = /^(?:va au\s+)?(?:6)$/i;  // Diapo 6

            // Test des commandes vocales
            if (Diapo0_command.test(clean)) {
                console.log("-> Commande reconnue : retour au sommaire !");
                currentSlide = 0;
                showSlide(0);
            }
            else if (Diapo1_command.test(clean)) {
                console.log("-> Commande reconnue : retour à la diapositive 1 !");
                currentSlide = 1;
                showSlide(1);
            }
            else if (Diapo2_command.test(clean)) {
                console.log("-> Commande reconnue : retour à la diapositive 2 !");
                currentSlide = 2;
                showSlide(2);
            }
            else if (Diapo3_command.test(clean)) {
                console.log("-> Commande reconnue : retour à la diapositive 3 !");
                currentSlide = 3;
                showSlide(3);
            }
            else if (Diapo4_command.test(clean)) {
                console.log("-> Commande reconnue : retour à la diapositive 4 !");
                currentSlide = 4;
                showSlide(4);
            }
            else if (Diapo5_command.test(clean)) {
                console.log("-> Commande reconnue : retour à la diapositive 5 !");
                currentSlide = 5;
                showSlide(5);
            }
            else {
                console.log("Commande non reconnue.");
            }
        }
    }


      /////////////////////////////////
     //// Animation des particules ///
    /////////////////////////////////

    // Paramètres avec varialbes
    let particleCount = 150;
    let particleSize = 0.8;
    let lineThickness = 0.5;
    let maxLineDistance = 120;
    let particle_color = "#00aa99";
    const particlesArray = [];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Création du canvas
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";

    // Fonction pour le redimensionnement
    const resizeHandler = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeHandler);

    // Fonction pour créer une particule
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = particleSize;
            this.color = particle_color;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
        }
        // Fonction pour mettre à jour la position de la particule
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        // Fonction pour dessiner la particule
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    // Fonction pour dessiner les lignes entre les particules
    function drawLines() {
        for (let i = 0; i < particlesArray.length; i++) {
            const particle1 = particlesArray[i];
            for (let j = i + 1; j < particlesArray.length; j++) {
                const particle2 = particlesArray[j];
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < maxLineDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.strokeStyle = "#00aa99";
                    ctx.lineWidth = lineThickness;
                    ctx.stroke();
                }
            }
        }
    }

    // Fonction pour initialiser les particules
    function initParticles() {
        for (let i = 0; i<particleCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particlesArray.push(new Particle(x, y));
        }
    }
        // Fonction pour animer les particules
        function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const particle of particlesArray) {
            particle.update();
            particle.draw();
        }
        drawLines();
        requestAnimationFrame(animate);
    }

      /////////////////////////////////
     ////////// Paramètre  ///////////
    /////////////////////////////////

    let parametresOuvert = false; //contrôle si on bloque les clics

    const boutonParametres = document.getElementById("btnParametres");
    const menuParametres = document.getElementById("menuParametres");
    const fermerMenu = document.getElementById("fermerMenu");

    boutonParametres.addEventListener("click", () => {
        menuParametres.style.right = "0";
        parametresOuvert = true; //bloque les clics pour les diapo
    });

    fermerMenu.addEventListener("click", () => {
        menuParametres.style.right = "-400px";
        parametresOuvert = false; //réactive les clics pour les diapo
    });

    // Ici c'est l'écouteur global qui passe à la slide suivante
    document.addEventListener("click", (event) => {
        if (parametresOuvert) return; //on bloque si le menu est ouvert

        // ton code pour changer de diapo ici
        console.log("Changer de diapo !");
    });

      /////////////////////////////////
     //////// Menue paramètre ////////
    /////////////////////////////////

    ////// Pour les particule ///////

    // Récupérer les éléments de saisie
    let inputParticleCount = document.getElementById("particleCount");
    let inputParticleSize = document.getElementById("particleSize");
    let inputLineThickness = document.getElementById("lineThickness");
    let inputMaxLineDistance = document.getElementById("maxLineDistance");
    let inputParticleColor = document.getElementById("particleColor");

    // Mettre à jour les variables avec les valeurs des champs
    inputParticleCount.addEventListener("input", () => {
        particleCount = parseInt(inputParticleCount.value, 10);
        particlesArray.length = 0; // Réinitialiser les particules
        initParticles(); // Re-créer les particules avec la nouvelle valeur
    });

    inputParticleSize.addEventListener("input", () => {
        particleSize = parseFloat(inputParticleSize.value);
        particlesArray.forEach(particle => {
            particle.size = particleSize; // Mettre à jour la taille des particules existantes
        });
    });

    inputLineThickness.addEventListener("input", () => {
        lineThickness = parseFloat(inputLineThickness.value);
    });

    inputMaxLineDistance.addEventListener("input", () => {
        maxLineDistance = parseFloat(inputMaxLineDistance.value);
    });

    inputParticleColor.addEventListener("input", () => {
        particle_color = inputParticleColor.value;
        particlesArray.forEach(particle => {
            particle.color = particle_color; // Mettre à jour la couleur des particules
        });
    });

    ////// Pour le thème ///////
    // Récupérer les éléments de saisie pour les couleurs du thème
    const inputMainBgColor = document.getElementById("mainBgColor");
    const inputTextColor = document.getElementById("textColor");
    const inputAccentColor = document.getElementById("accentColor");

    // Fonction pour mettre à jour les variables CSS
    function updateCSSVariables() {
        const root = document.documentElement;
        root.style.setProperty("--main-bg-color", inputMainBgColor.value);
        root.style.setProperty("--text-color", inputTextColor.value);
        root.style.setProperty("--accent-color", inputAccentColor.value);
    }

    // Écouter les changements sur les champs de couleur
    inputMainBgColor.addEventListener("input", updateCSSVariables);
    inputTextColor.addEventListener("input", updateCSSVariables);
    inputAccentColor.addEventListener("input", updateCSSVariables);


      /////////////////////////////////
     ////// Appel des fonction  //////
    /////////////////////////////////
    initParticles();
    animate();
    showSlide(currentSlide);