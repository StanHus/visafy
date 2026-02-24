export type Language = "en" | "es" | "ru";

export type Translations = typeof en;

const en = {
  // Navbar
  nav: {
    dashboard: "Dashboard",
    signOut: "Sign Out",
    signIn: "Sign In",
    getStarted: "Get Started",
  },

  // Landing page
  landing: {
    heroTitle: "Your path to Spain, simplified.",
    heroSubtitle:
      "Navigate Spain\u2019s immigration process with a guided application that handles every step for you.",
    cta: "Start your application",
    howItWorks: "How it works",
    step1Title: "Create your account",
    step1Desc: "Sign up and start your personalized immigration application.",
    step2Title: "Complete the application",
    step2Desc: "Fill in your details through our guided multi-step form.",
    step3Title: "Submit and track",
    step3Desc: "Submit your application and monitor its progress.",
    footerRights: "All rights reserved.",
  },

  // Auth
  auth: {
    signInTitle: "Sign in",
    signUpTitle: "Create an account",
    noAccount: "Don\u2019t have an account?",
    createOne: "Create one",
    haveAccount: "Already have an account?",
    signInLink: "Sign in",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    passwordPlaceholderNew: "Min. 8 characters",
    fullNameLabel: "Full name",
    fullNamePlaceholder: "John Doe",
    signInButton: "Sign In",
    createAccountButton: "Create Account",
    termsText:
      "By creating an account, you agree to our Terms of Service and Privacy Policy.",
    errorInvalidCredentials: "Invalid email or password",
    errorGeneric: "Something went wrong. Please try again.",
    errorAutoSignIn: "Account created but could not sign in automatically.",
  },

  // Onboarding
  onboarding: {
    stepTitles: [
      "Visa Type",
      "Personal",
      "Details",
      "Financial",
      "Documents",
      "Review",
    ],

    // Step 1
    step1Title: "Select your visa type",
    step1Subtitle: "Choose the visa category that fits your situation.",
    step1Error: "Please select a visa type to continue",
    visaTypes: {
      work_visa: {
        title: "Work Visa",
        description: "Employment-based immigration with a job offer in Spain",
      },
      golden_visa: {
        title: "Golden Visa",
        description: "Residency through significant investment in Spain",
      },
      student_visa: {
        title: "Student Visa",
        description: "Study at Spanish educational institutions",
      },
      digital_nomad: {
        title: "Digital Nomad Visa",
        description: "Remote work for foreign companies from Spain",
      },
      family_reunification: {
        title: "Family Reunification",
        description: "Join family members who are legal residents",
      },
      non_lucrative: {
        title: "Non-Lucrative Visa",
        description: "Live in Spain with passive income or savings",
      },
    },

    // Step 2
    step2Title: "Personal information",
    step2Subtitle: "Enter your details as they appear on your passport.",
    fields: {
      fullName: { label: "Full Name", placeholder: "As on passport" },
      dateOfBirth: { label: "Date of Birth", placeholder: "" },
      nationality: { label: "Nationality", placeholder: "e.g. United States" },
      passportNumber: {
        label: "Passport Number",
        placeholder: "e.g. AB1234567",
      },
      passportExpiry: { label: "Passport Expiry Date", placeholder: "" },
      phone: { label: "Phone Number", placeholder: "+1 234 567 8900" },
      email: { label: "Email Address", placeholder: "" },
      country: {
        label: "Current Country",
        placeholder: "e.g. United States",
      },
      city: { label: "Current City", placeholder: "e.g. New York" },
    },

    // Step 3 - visa details
    step3Title: "details",
    step3Subtitle:
      "Provide specific information required for your visa type.",
    visaFields: {
      employerName: {
        label: "Employer Name",
        placeholder: "Company name in Spain",
      },
      employerAddress: {
        label: "Employer Address",
        placeholder: "Full address",
      },
      jobTitle: { label: "Job Title", placeholder: "Your position" },
      contractStartDate: {
        label: "Contract Start Date",
        placeholder: "",
      },
      contractEndDate: { label: "Contract End Date", placeholder: "" },
      annualSalary: {
        label: "Annual Salary (EUR)",
        placeholder: "e.g. 45000",
      },
      investmentType: {
        label: "Investment Type",
        placeholder: "e.g. Real estate, Financial assets",
      },
      investmentAmount: {
        label: "Investment Amount (EUR)",
        placeholder: "e.g. 500000",
      },
      investmentDescription: {
        label: "Investment Description",
        placeholder: "Details about your investment",
      },
      investmentLocation: {
        label: "Investment Location",
        placeholder: "City/region in Spain",
      },
      universityName: {
        label: "University Name",
        placeholder: "Name of institution",
      },
      programName: {
        label: "Program Name",
        placeholder: "e.g. MBA, Computer Science",
      },
      programDuration: {
        label: "Program Duration",
        placeholder: "e.g. 2 years",
      },
      programStartDate: { label: "Program Start Date", placeholder: "" },
      enrollmentStatus: {
        label: "Enrollment Status",
        placeholder: "e.g. Accepted, Enrolled",
      },
      workType: {
        label: "Work Type",
        placeholder: "Employee or Freelancer",
      },
      companyName: {
        label: "Company/Client Name",
        placeholder: "Your employer or main client",
      },
      companyCountry: {
        label: "Company Country",
        placeholder: "Where the company is based",
      },
      monthlyIncome: {
        label: "Monthly Income (EUR)",
        placeholder: "e.g. 3500",
      },
      remoteWorkDescription: {
        label: "Work Description",
        placeholder: "Brief description of your role",
      },
      sponsorName: {
        label: "Sponsor Full Name",
        placeholder: "Name of your family member in Spain",
      },
      sponsorRelationship: {
        label: "Relationship to Sponsor",
        placeholder: "e.g. Spouse, Parent, Child",
      },
      sponsorResidencePermit: {
        label: "Sponsor's Residence Permit Number",
        placeholder: "NIE or permit number",
      },
      sponsorAddress: {
        label: "Sponsor's Address in Spain",
        placeholder: "Full address",
      },
      incomeSource: {
        label: "Source of Income",
        placeholder: "e.g. Pension, Investments, Savings",
      },
      monthlyAmount: {
        label: "Monthly Income/Funds (EUR)",
        placeholder: "e.g. 3000",
      },
      savingsAmount: {
        label: "Total Savings (EUR)",
        placeholder: "e.g. 100000",
      },
      plannedResidence: {
        label: "Planned City of Residence",
        placeholder: "e.g. Barcelona, Madrid",
      },
    },

    // Step 4
    step4Title: "Financial information",
    step4Subtitle: "Provide details about your financial situation.",
    step4Fields: {
      annualIncome: {
        label: "Annual Income (EUR)",
        placeholder: "e.g. 60000",
      },
      monthlyIncome: {
        label: "Monthly Income (EUR)",
        placeholder: "e.g. 5000",
      },
      bankName: { label: "Bank Name", placeholder: "e.g. Chase, HSBC" },
      bankAccountCountry: {
        label: "Bank Account Country",
        placeholder: "e.g. United States",
      },
      sourceOfFunds: { label: "Source of Funds", placeholder: "" },
    },
    fundSources: {
      select: "Select source of funds",
      employment: "Employment / Salary",
      self_employment: "Self-Employment / Business",
      investments: "Investments / Dividends",
      savings: "Savings",
      pension: "Pension / Retirement",
      family_support: "Family Support",
      other: "Other",
    },

    // Step 5
    step5Title: "Upload documents",
    step5Subtitle: "Upload required documents. PDF, JPG, or PNG up to 10MB each.",
    step5Error: "Application not found. Please go back and try again.",
    uploadFailed: "Upload failed. Please try again.",
    uploading: "Uploading",
    replace: "Replace",
    upload: "Upload",
    docsUploaded: "documents uploaded.",
    docsNote: "You can continue and upload remaining documents later.",
    docLabels: {
      passport: "Passport Copy",
      photo: "Passport Photo",
      employment_contract: "Employment Contract",
      criminal_record: "Criminal Record Certificate",
      health_insurance: "Health Insurance",
      proof_of_income: "Proof of Income",
      bank_statement: "Bank Statement",
      accommodation_proof: "Accommodation Proof",
    },

    // Step 6
    step6Title: "Review & submit",
    step6Subtitle: "Review your information before submitting.",
    step6Error: "Please agree to the terms and conditions to submit",
    sectionVisaType: "Visa Type",
    sectionPersonal: "Personal Information",
    sectionFinancial: "Financial Information",
    sectionDocuments: "Documents",
    selectedVisa: "Selected Visa",
    noDocuments: "No documents uploaded yet.",
    termsConfirm:
      "I confirm that all the information provided is accurate and complete. I understand that providing false information may result in my application being rejected. I agree to the",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",

    // Navigation
    back: "Back",
    continue: "Continue",
    continueToReview: "Continue to Review",
    submitApplication: "Submit Application",
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    welcomeBack: "Welcome back,",
    noAppTitle: "No application yet",
    noAppDesc:
      "Start your immigration journey by creating a new visa application.",
    startApp: "Start Application",
    continueApp: "Continue Application",
    progress: "Progress",
    stepOf: "Step {current} of {total}",
    created: "Created",
    updated: "Updated",
    visaType: "Visa Type",
    status: "Status",
    notSelected: "Not selected",
    timeline: "Timeline",
    current: "Current",
    timelineSteps: {
      draft: "Application Started",
      submitted: "Application Submitted",
      under_review: "Under Review",
      approved: "Decision Made",
    },
    signOut: "Sign Out",
  },

  // Validation errors
  validation: {
    required: "{field} is required",
  },
};

const es: Translations = {
  nav: {
    dashboard: "Panel",
    signOut: "Cerrar Sesi\u00f3n",
    signIn: "Iniciar Sesi\u00f3n",
    getStarted: "Comenzar",
  },

  landing: {
    heroTitle: "Tu camino a Espa\u00f1a, simplificado.",
    heroSubtitle:
      "Navega el proceso de inmigraci\u00f3n de Espa\u00f1a con una solicitud guiada que gestiona cada paso por ti.",
    cta: "Comienza tu solicitud",
    howItWorks: "C\u00f3mo funciona",
    step1Title: "Crea tu cuenta",
    step1Desc:
      "Reg\u00edstrate y comienza tu solicitud de inmigraci\u00f3n personalizada.",
    step2Title: "Completa la solicitud",
    step2Desc:
      "Rellena tus datos a trav\u00e9s de nuestro formulario guiado.",
    step3Title: "Env\u00eda y sigue",
    step3Desc: "Env\u00eda tu solicitud y monitorea su progreso.",
    footerRights: "Todos los derechos reservados.",
  },

  auth: {
    signInTitle: "Iniciar sesi\u00f3n",
    signUpTitle: "Crear una cuenta",
    noAccount: "\u00bfNo tienes una cuenta?",
    createOne: "Crear una",
    haveAccount: "\u00bfYa tienes una cuenta?",
    signInLink: "Iniciar sesi\u00f3n",
    emailLabel: "Correo electr\u00f3nico",
    emailPlaceholder: "tu@ejemplo.com",
    passwordLabel: "Contrase\u00f1a",
    passwordPlaceholder: "Ingresa tu contrase\u00f1a",
    passwordPlaceholderNew: "M\u00edn. 8 caracteres",
    fullNameLabel: "Nombre completo",
    fullNamePlaceholder: "Juan P\u00e9rez",
    signInButton: "Iniciar Sesi\u00f3n",
    createAccountButton: "Crear Cuenta",
    termsText:
      "Al crear una cuenta, aceptas nuestros T\u00e9rminos de Servicio y Pol\u00edtica de Privacidad.",
    errorInvalidCredentials: "Correo o contrase\u00f1a inv\u00e1lidos",
    errorGeneric: "Algo sali\u00f3 mal. Intenta de nuevo.",
    errorAutoSignIn:
      "Cuenta creada pero no se pudo iniciar sesi\u00f3n autom\u00e1ticamente.",
  },

  onboarding: {
    stepTitles: [
      "Tipo de Visa",
      "Personal",
      "Detalles",
      "Finanzas",
      "Documentos",
      "Revisi\u00f3n",
    ],

    step1Title: "Selecciona tu tipo de visa",
    step1Subtitle: "Elige la categor\u00eda de visa que se ajuste a tu situaci\u00f3n.",
    step1Error: "Por favor selecciona un tipo de visa para continuar",
    visaTypes: {
      work_visa: {
        title: "Visa de Trabajo",
        description:
          "Inmigraci\u00f3n laboral con una oferta de empleo en Espa\u00f1a",
      },
      golden_visa: {
        title: "Golden Visa",
        description:
          "Residencia mediante una inversi\u00f3n significativa en Espa\u00f1a",
      },
      student_visa: {
        title: "Visa de Estudiante",
        description: "Estudiar en instituciones educativas espa\u00f1olas",
      },
      digital_nomad: {
        title: "Visa de N\u00f3mada Digital",
        description:
          "Trabajo remoto para empresas extranjeras desde Espa\u00f1a",
      },
      family_reunification: {
        title: "Reagrupaci\u00f3n Familiar",
        description:
          "Reunirte con familiares que son residentes legales",
      },
      non_lucrative: {
        title: "Visa No Lucrativa",
        description:
          "Vivir en Espa\u00f1a con ingresos pasivos o ahorros",
      },
    },

    step2Title: "Informaci\u00f3n personal",
    step2Subtitle:
      "Ingresa tus datos como aparecen en tu pasaporte.",
    fields: {
      fullName: { label: "Nombre Completo", placeholder: "Como en el pasaporte" },
      dateOfBirth: { label: "Fecha de Nacimiento", placeholder: "" },
      nationality: {
        label: "Nacionalidad",
        placeholder: "ej. Estados Unidos",
      },
      passportNumber: {
        label: "N\u00famero de Pasaporte",
        placeholder: "ej. AB1234567",
      },
      passportExpiry: {
        label: "Fecha de Vencimiento del Pasaporte",
        placeholder: "",
      },
      phone: {
        label: "N\u00famero de Tel\u00e9fono",
        placeholder: "+1 234 567 8900",
      },
      email: { label: "Correo Electr\u00f3nico", placeholder: "" },
      country: { label: "Pa\u00eds Actual", placeholder: "ej. Estados Unidos" },
      city: { label: "Ciudad Actual", placeholder: "ej. Nueva York" },
    },

    step3Title: "detalles",
    step3Subtitle:
      "Proporciona informaci\u00f3n espec\u00edfica requerida para tu tipo de visa.",
    visaFields: {
      employerName: {
        label: "Nombre del Empleador",
        placeholder: "Nombre de la empresa en Espa\u00f1a",
      },
      employerAddress: {
        label: "Direcci\u00f3n del Empleador",
        placeholder: "Direcci\u00f3n completa",
      },
      jobTitle: {
        label: "Puesto de Trabajo",
        placeholder: "Tu posici\u00f3n",
      },
      contractStartDate: {
        label: "Fecha de Inicio del Contrato",
        placeholder: "",
      },
      contractEndDate: {
        label: "Fecha de Fin del Contrato",
        placeholder: "",
      },
      annualSalary: {
        label: "Salario Anual (EUR)",
        placeholder: "ej. 45000",
      },
      investmentType: {
        label: "Tipo de Inversi\u00f3n",
        placeholder: "ej. Inmuebles, Activos financieros",
      },
      investmentAmount: {
        label: "Monto de Inversi\u00f3n (EUR)",
        placeholder: "ej. 500000",
      },
      investmentDescription: {
        label: "Descripci\u00f3n de la Inversi\u00f3n",
        placeholder: "Detalles sobre tu inversi\u00f3n",
      },
      investmentLocation: {
        label: "Ubicaci\u00f3n de la Inversi\u00f3n",
        placeholder: "Ciudad/regi\u00f3n en Espa\u00f1a",
      },
      universityName: {
        label: "Nombre de la Universidad",
        placeholder: "Nombre de la instituci\u00f3n",
      },
      programName: {
        label: "Nombre del Programa",
        placeholder: "ej. MBA, Ciencias de la Computaci\u00f3n",
      },
      programDuration: {
        label: "Duraci\u00f3n del Programa",
        placeholder: "ej. 2 a\u00f1os",
      },
      programStartDate: {
        label: "Fecha de Inicio del Programa",
        placeholder: "",
      },
      enrollmentStatus: {
        label: "Estado de Inscripci\u00f3n",
        placeholder: "ej. Aceptado, Inscrito",
      },
      workType: {
        label: "Tipo de Trabajo",
        placeholder: "Empleado o Freelancer",
      },
      companyName: {
        label: "Nombre de Empresa/Cliente",
        placeholder: "Tu empleador o cliente principal",
      },
      companyCountry: {
        label: "Pa\u00eds de la Empresa",
        placeholder: "D\u00f3nde est\u00e1 basada la empresa",
      },
      monthlyIncome: {
        label: "Ingreso Mensual (EUR)",
        placeholder: "ej. 3500",
      },
      remoteWorkDescription: {
        label: "Descripci\u00f3n del Trabajo",
        placeholder: "Breve descripci\u00f3n de tu rol",
      },
      sponsorName: {
        label: "Nombre Completo del Patrocinador",
        placeholder: "Nombre de tu familiar en Espa\u00f1a",
      },
      sponsorRelationship: {
        label: "Relaci\u00f3n con el Patrocinador",
        placeholder: "ej. C\u00f3nyuge, Padre, Hijo",
      },
      sponsorResidencePermit: {
        label: "N\u00famero de Permiso de Residencia del Patrocinador",
        placeholder: "NIE o n\u00famero de permiso",
      },
      sponsorAddress: {
        label: "Direcci\u00f3n del Patrocinador en Espa\u00f1a",
        placeholder: "Direcci\u00f3n completa",
      },
      incomeSource: {
        label: "Fuente de Ingresos",
        placeholder: "ej. Pensi\u00f3n, Inversiones, Ahorros",
      },
      monthlyAmount: {
        label: "Ingresos/Fondos Mensuales (EUR)",
        placeholder: "ej. 3000",
      },
      savingsAmount: {
        label: "Ahorros Totales (EUR)",
        placeholder: "ej. 100000",
      },
      plannedResidence: {
        label: "Ciudad de Residencia Planeada",
        placeholder: "ej. Barcelona, Madrid",
      },
    },

    step4Title: "Informaci\u00f3n financiera",
    step4Subtitle: "Proporciona detalles sobre tu situaci\u00f3n financiera.",
    step4Fields: {
      annualIncome: {
        label: "Ingreso Anual (EUR)",
        placeholder: "ej. 60000",
      },
      monthlyIncome: {
        label: "Ingreso Mensual (EUR)",
        placeholder: "ej. 5000",
      },
      bankName: { label: "Nombre del Banco", placeholder: "ej. Chase, HSBC" },
      bankAccountCountry: {
        label: "Pa\u00eds de la Cuenta Bancaria",
        placeholder: "ej. Estados Unidos",
      },
      sourceOfFunds: { label: "Fuente de Fondos", placeholder: "" },
    },
    fundSources: {
      select: "Selecciona fuente de fondos",
      employment: "Empleo / Salario",
      self_employment: "Trabajo Independiente / Negocio",
      investments: "Inversiones / Dividendos",
      savings: "Ahorros",
      pension: "Pensi\u00f3n / Jubilaci\u00f3n",
      family_support: "Apoyo Familiar",
      other: "Otro",
    },

    step5Title: "Subir documentos",
    step5Subtitle:
      "Sube los documentos requeridos. PDF, JPG o PNG hasta 10MB cada uno.",
    step5Error:
      "Solicitud no encontrada. Vuelve atr\u00e1s e intenta de nuevo.",
    uploadFailed: "Error al subir. Intenta de nuevo.",
    uploading: "Subiendo",
    replace: "Reemplazar",
    upload: "Subir",
    docsUploaded: "documentos subidos.",
    docsNote:
      "Puedes continuar y subir los documentos restantes despu\u00e9s.",
    docLabels: {
      passport: "Copia del Pasaporte",
      photo: "Foto de Pasaporte",
      employment_contract: "Contrato de Trabajo",
      criminal_record: "Certificado de Antecedentes Penales",
      health_insurance: "Seguro M\u00e9dico",
      proof_of_income: "Comprobante de Ingresos",
      bank_statement: "Extracto Bancario",
      accommodation_proof: "Comprobante de Alojamiento",
    },

    step6Title: "Revisar y enviar",
    step6Subtitle: "Revisa tu informaci\u00f3n antes de enviar.",
    step6Error:
      "Por favor acepta los t\u00e9rminos y condiciones para enviar",
    sectionVisaType: "Tipo de Visa",
    sectionPersonal: "Informaci\u00f3n Personal",
    sectionFinancial: "Informaci\u00f3n Financiera",
    sectionDocuments: "Documentos",
    selectedVisa: "Visa Seleccionada",
    noDocuments: "No se han subido documentos a\u00fan.",
    termsConfirm:
      "Confirmo que toda la informaci\u00f3n proporcionada es precisa y completa. Entiendo que proporcionar informaci\u00f3n falsa puede resultar en el rechazo de mi solicitud. Acepto los",
    termsOfService: "T\u00e9rminos de Servicio",
    and: "y",
    privacyPolicy: "Pol\u00edtica de Privacidad",

    back: "Atr\u00e1s",
    continue: "Continuar",
    continueToReview: "Continuar a Revisi\u00f3n",
    submitApplication: "Enviar Solicitud",
  },

  dashboard: {
    title: "Panel",
    welcomeBack: "Bienvenido de nuevo,",
    noAppTitle: "Sin solicitud a\u00fan",
    noAppDesc:
      "Comienza tu viaje de inmigraci\u00f3n creando una nueva solicitud de visa.",
    startApp: "Iniciar Solicitud",
    continueApp: "Continuar Solicitud",
    progress: "Progreso",
    stepOf: "Paso {current} de {total}",
    created: "Creado",
    updated: "Actualizado",
    visaType: "Tipo de Visa",
    status: "Estado",
    notSelected: "No seleccionado",
    timeline: "Cronolog\u00eda",
    current: "Actual",
    timelineSteps: {
      draft: "Solicitud Iniciada",
      submitted: "Solicitud Enviada",
      under_review: "En Revisi\u00f3n",
      approved: "Decisi\u00f3n Tomada",
    },
    signOut: "Cerrar Sesi\u00f3n",
  },

  validation: {
    required: "{field} es obligatorio",
  },
};

const ru: Translations = {
  nav: {
    dashboard: "\u041f\u0430\u043d\u0435\u043b\u044c",
    signOut: "\u0412\u044b\u0439\u0442\u0438",
    signIn: "\u0412\u043e\u0439\u0442\u0438",
    getStarted: "\u041d\u0430\u0447\u0430\u0442\u044c",
  },

  landing: {
    heroTitle: "\u0412\u0430\u0448 \u043f\u0443\u0442\u044c \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u044e, \u0443\u043f\u0440\u043e\u0449\u0451\u043d\u043d\u044b\u0439.",
    heroSubtitle:
      "\u041f\u0440\u043e\u0439\u0434\u0438\u0442\u0435 \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u0441\u0441 \u0418\u0441\u043f\u0430\u043d\u0438\u0438 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043f\u043e\u0448\u0430\u0433\u043e\u0432\u043e\u0433\u043e \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430, \u043a\u043e\u0442\u043e\u0440\u043e\u0435 \u043f\u043e\u043c\u043e\u0436\u0435\u0442 \u043d\u0430 \u043a\u0430\u0436\u0434\u043e\u043c \u044d\u0442\u0430\u043f\u0435.",
    cta: "\u041d\u0430\u0447\u0430\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443",
    howItWorks: "\u041a\u0430\u043a \u044d\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442",
    step1Title: "\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u0430\u043a\u043a\u0430\u0443\u043d\u0442",
    step1Desc:
      "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044c \u0438 \u043d\u0430\u0447\u043d\u0438\u0442\u0435 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u0443\u044e \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u0443\u044e \u0437\u0430\u044f\u0432\u043a\u0443.",
    step2Title: "\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443",
    step2Desc:
      "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u0432\u043e\u0438 \u0434\u0430\u043d\u043d\u044b\u0435 \u0447\u0435\u0440\u0435\u0437 \u043d\u0430\u0448\u0443 \u043f\u043e\u0448\u0430\u0433\u043e\u0432\u0443\u044e \u0444\u043e\u0440\u043c\u0443.",
    step3Title: "\u041e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0438 \u043e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u0439\u0442\u0435",
    step3Desc:
      "\u041e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u044f\u0432\u043a\u0443 \u0438 \u0441\u043b\u0435\u0434\u0438\u0442\u0435 \u0437\u0430 \u0435\u0451 \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441\u043e\u043c.",
    footerRights: "\u0412\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b.",
  },

  auth: {
    signInTitle: "\u0412\u043e\u0439\u0442\u0438",
    signUpTitle: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442",
    noAccount: "\u041d\u0435\u0442 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430?",
    createOne: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c",
    haveAccount: "\u0423\u0436\u0435 \u0435\u0441\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442?",
    signInLink: "\u0412\u043e\u0439\u0442\u0438",
    emailLabel: "\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430\u044f \u043f\u043e\u0447\u0442\u0430",
    emailPlaceholder: "you@example.com",
    passwordLabel: "\u041f\u0430\u0440\u043e\u043b\u044c",
    passwordPlaceholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c",
    passwordPlaceholderNew: "\u041c\u0438\u043d. 8 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
    fullNameLabel: "\u041f\u043e\u043b\u043d\u043e\u0435 \u0438\u043c\u044f",
    fullNamePlaceholder: "\u0418\u0432\u0430\u043d \u0418\u0432\u0430\u043d\u043e\u0432",
    signInButton: "\u0412\u043e\u0439\u0442\u0438",
    createAccountButton: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0410\u043a\u043a\u0430\u0443\u043d\u0442",
    termsText:
      "\u0421\u043e\u0437\u0434\u0430\u0432\u0430\u044f \u0430\u043a\u043a\u0430\u0443\u043d\u0442, \u0432\u044b \u0441\u043e\u0433\u043b\u0430\u0448\u0430\u0435\u0442\u0435\u0441\u044c \u0441 \u043d\u0430\u0448\u0438\u043c\u0438 \u0423\u0441\u043b\u043e\u0432\u0438\u044f\u043c\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u041f\u043e\u043b\u0438\u0442\u0438\u043a\u043e\u0439 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438.",
    errorInvalidCredentials: "\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u0435\u043c\u0435\u0439\u043b \u0438\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c",
    errorGeneric: "\u0427\u0442\u043e-\u0442\u043e \u043f\u043e\u0448\u043b\u043e \u043d\u0435 \u0442\u0430\u043a. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0441\u043d\u043e\u0432\u0430.",
    errorAutoSignIn:
      "\u0410\u043a\u043a\u0430\u0443\u043d\u0442 \u0441\u043e\u0437\u0434\u0430\u043d, \u043d\u043e \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0432\u0445\u043e\u0434 \u043d\u0435 \u0443\u0434\u0430\u043b\u0441\u044f.",
  },

  onboarding: {
    stepTitles: [
      "\u0422\u0438\u043f \u0432\u0438\u0437\u044b",
      "\u041b\u0438\u0447\u043d\u043e\u0435",
      "\u0414\u0435\u0442\u0430\u043b\u0438",
      "\u0424\u0438\u043d\u0430\u043d\u0441\u044b",
      "\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b",
      "\u041e\u0431\u0437\u043e\u0440",
    ],

    step1Title: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043f \u0432\u0438\u0437\u044b",
    step1Subtitle: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044e \u0432\u0438\u0437\u044b, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u0432\u0430\u0448\u0435\u0439 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438.",
    step1Error: "\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043f \u0432\u0438\u0437\u044b \u0434\u043b\u044f \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0435\u043d\u0438\u044f",
    visaTypes: {
      work_visa: {
        title: "\u0420\u0430\u0431\u043e\u0447\u0430\u044f \u0432\u0438\u0437\u0430",
        description:
          "\u0422\u0440\u0443\u0434\u043e\u0432\u0430\u044f \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u044f \u0441 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u043c \u0440\u0430\u0431\u043e\u0442\u044b \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u0438",
      },
      golden_visa: {
        title: "\u0417\u043e\u043b\u043e\u0442\u0430\u044f \u0432\u0438\u0437\u0430",
        description:
          "\u0412\u0438\u0434 \u043d\u0430 \u0436\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e \u0447\u0435\u0440\u0435\u0437 \u0437\u043d\u0430\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0438 \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u044e",
      },
      student_visa: {
        title: "\u0421\u0442\u0443\u0434\u0435\u043d\u0447\u0435\u0441\u043a\u0430\u044f \u0432\u0438\u0437\u0430",
        description: "\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u0432 \u0438\u0441\u043f\u0430\u043d\u0441\u043a\u0438\u0445 \u0443\u0447\u0435\u0431\u043d\u044b\u0445 \u0437\u0430\u0432\u0435\u0434\u0435\u043d\u0438\u044f\u0445",
      },
      digital_nomad: {
        title: "\u0412\u0438\u0437\u0430 \u0446\u0438\u0444\u0440\u043e\u0432\u043e\u0433\u043e \u043a\u043e\u0447\u0435\u0432\u043d\u0438\u043a\u0430",
        description:
          "\u0423\u0434\u0430\u043b\u0451\u043d\u043d\u0430\u044f \u0440\u0430\u0431\u043e\u0442\u0430 \u043d\u0430 \u0438\u043d\u043e\u0441\u0442\u0440\u0430\u043d\u043d\u044b\u0435 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438 \u0438\u0437 \u0418\u0441\u043f\u0430\u043d\u0438\u0438",
      },
      family_reunification: {
        title: "\u0412\u043e\u0441\u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u0441\u0435\u043c\u044c\u0438",
        description:
          "\u041f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c\u0441\u044f \u043a \u0447\u043b\u0435\u043d\u0430\u043c \u0441\u0435\u043c\u044c\u0438 \u2014 \u043b\u0435\u0433\u0430\u043b\u044c\u043d\u044b\u043c \u0440\u0435\u0437\u0438\u0434\u0435\u043d\u0442\u0430\u043c",
      },
      non_lucrative: {
        title: "\u041d\u0435\u043a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u0430\u044f \u0432\u0438\u0437\u0430",
        description:
          "\u0416\u0438\u0437\u043d\u044c \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u0438 \u043d\u0430 \u043f\u0430\u0441\u0441\u0438\u0432\u043d\u044b\u0439 \u0434\u043e\u0445\u043e\u0434 \u0438\u043b\u0438 \u043d\u0430\u043a\u043e\u043f\u043b\u0435\u043d\u0438\u044f",
      },
    },

    step2Title: "\u041b\u0438\u0447\u043d\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
    step2Subtitle:
      "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u043a\u0430\u043a \u0432 \u0432\u0430\u0448\u0435\u043c \u043f\u0430\u0441\u043f\u043e\u0440\u0442\u0435.",
    fields: {
      fullName: { label: "\u041f\u043e\u043b\u043d\u043e\u0435 \u0438\u043c\u044f", placeholder: "\u041a\u0430\u043a \u0432 \u043f\u0430\u0441\u043f\u043e\u0440\u0442\u0435" },
      dateOfBirth: { label: "\u0414\u0430\u0442\u0430 \u0440\u043e\u0436\u0434\u0435\u043d\u0438\u044f", placeholder: "" },
      nationality: {
        label: "\u0413\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u0442\u0432\u043e",
        placeholder: "\u043d\u0430\u043f\u0440. \u0420\u043e\u0441\u0441\u0438\u044f",
      },
      passportNumber: {
        label: "\u041d\u043e\u043c\u0435\u0440 \u043f\u0430\u0441\u043f\u043e\u0440\u0442\u0430",
        placeholder: "\u043d\u0430\u043f\u0440. AB1234567",
      },
      passportExpiry: {
        label: "\u0421\u0440\u043e\u043a \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u043f\u0430\u0441\u043f\u043e\u0440\u0442\u0430",
        placeholder: "",
      },
      phone: {
        label: "\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430",
        placeholder: "+7 999 123 4567",
      },
      email: { label: "\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430\u044f \u043f\u043e\u0447\u0442\u0430", placeholder: "" },
      country: { label: "\u0422\u0435\u043a\u0443\u0449\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0430", placeholder: "\u043d\u0430\u043f\u0440. \u0420\u043e\u0441\u0441\u0438\u044f" },
      city: { label: "\u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u0433\u043e\u0440\u043e\u0434", placeholder: "\u043d\u0430\u043f\u0440. \u041c\u043e\u0441\u043a\u0432\u0430" },
    },

    step3Title: "\u0434\u0435\u0442\u0430\u043b\u0438",
    step3Subtitle:
      "\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e, \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u0443\u044e \u0434\u043b\u044f \u0432\u0430\u0448\u0435\u0433\u043e \u0442\u0438\u043f\u0430 \u0432\u0438\u0437\u044b.",
    visaFields: {
      employerName: {
        label: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0440\u0430\u0431\u043e\u0442\u043e\u0434\u0430\u0442\u0435\u043b\u044f",
        placeholder: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438 \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u0438",
      },
      employerAddress: {
        label: "\u0410\u0434\u0440\u0435\u0441 \u0440\u0430\u0431\u043e\u0442\u043e\u0434\u0430\u0442\u0435\u043b\u044f",
        placeholder: "\u041f\u043e\u043b\u043d\u044b\u0439 \u0430\u0434\u0440\u0435\u0441",
      },
      jobTitle: {
        label: "\u0414\u043e\u043b\u0436\u043d\u043e\u0441\u0442\u044c",
        placeholder: "\u0412\u0430\u0448\u0430 \u043f\u043e\u0437\u0438\u0446\u0438\u044f",
      },
      contractStartDate: {
        label: "\u0414\u0430\u0442\u0430 \u043d\u0430\u0447\u0430\u043b\u0430 \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430",
        placeholder: "",
      },
      contractEndDate: {
        label: "\u0414\u0430\u0442\u0430 \u043e\u043a\u043e\u043d\u0447\u0430\u043d\u0438\u044f \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430",
        placeholder: "",
      },
      annualSalary: {
        label: "\u0413\u043e\u0434\u043e\u0432\u0430\u044f \u0437\u0430\u0440\u043f\u043b\u0430\u0442\u0430 (EUR)",
        placeholder: "\u043d\u0430\u043f\u0440. 45000",
      },
      investmentType: {
        label: "\u0422\u0438\u043f \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0439",
        placeholder: "\u043d\u0430\u043f\u0440. \u041d\u0435\u0434\u0432\u0438\u0436\u0438\u043c\u043e\u0441\u0442\u044c, \u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u044b\u0435 \u0430\u043a\u0442\u0438\u0432\u044b",
      },
      investmentAmount: {
        label: "\u0421\u0443\u043c\u043c\u0430 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0439 (EUR)",
        placeholder: "\u043d\u0430\u043f\u0440. 500000",
      },
      investmentDescription: {
        label: "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0439",
        placeholder: "\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0441\u0442\u0438 \u043e \u0432\u0430\u0448\u0438\u0445 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044f\u0445",
      },
      investmentLocation: {
        label: "\u041c\u0435\u0441\u0442\u043e \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0439",
        placeholder: "\u0413\u043e\u0440\u043e\u0434/\u0440\u0435\u0433\u0438\u043e\u043d \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u0438",
      },
      universityName: {
        label: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0430",
        placeholder: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0443\u0447\u0435\u0431\u043d\u043e\u0433\u043e \u0437\u0430\u0432\u0435\u0434\u0435\u043d\u0438\u044f",
      },
      programName: {
        label: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b",
        placeholder: "\u043d\u0430\u043f\u0440. MBA, \u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0430",
      },
      programDuration: {
        label: "\u0414\u043b\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b",
        placeholder: "\u043d\u0430\u043f\u0440. 2 \u0433\u043e\u0434\u0430",
      },
      programStartDate: {
        label: "\u0414\u0430\u0442\u0430 \u043d\u0430\u0447\u0430\u043b\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b",
        placeholder: "",
      },
      enrollmentStatus: {
        label: "\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u0447\u0438\u0441\u043b\u0435\u043d\u0438\u044f",
        placeholder: "\u043d\u0430\u043f\u0440. \u041f\u0440\u0438\u043d\u044f\u0442, \u0417\u0430\u0447\u0438\u0441\u043b\u0435\u043d",
      },
      workType: {
        label: "\u0422\u0438\u043f \u0440\u0430\u0431\u043e\u0442\u044b",
        placeholder: "\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a \u0438\u043b\u0438 \u0424\u0440\u0438\u043b\u0430\u043d\u0441\u0435\u0440",
      },
      companyName: {
        label: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438/\u043a\u043b\u0438\u0435\u043d\u0442\u0430",
        placeholder: "\u0412\u0430\u0448 \u0440\u0430\u0431\u043e\u0442\u043e\u0434\u0430\u0442\u0435\u043b\u044c \u0438\u043b\u0438 \u043e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u043a\u043b\u0438\u0435\u043d\u0442",
      },
      companyCountry: {
        label: "\u0421\u0442\u0440\u0430\u043d\u0430 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438",
        placeholder: "\u0413\u0434\u0435 \u0431\u0430\u0437\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u044f",
      },
      monthlyIncome: {
        label: "\u0415\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 \u0434\u043e\u0445\u043e\u0434 (EUR)",
        placeholder: "\u043d\u0430\u043f\u0440. 3500",
      },
      remoteWorkDescription: {
        label: "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
        placeholder: "\u041a\u0440\u0430\u0442\u043a\u043e\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0432\u0430\u0448\u0435\u0439 \u0440\u043e\u043b\u0438",
      },
      sponsorName: {
        label: "\u041f\u043e\u043b\u043d\u043e\u0435 \u0438\u043c\u044f \u0441\u043f\u043e\u043d\u0441\u043e\u0440\u0430",
        placeholder: "\u0418\u043c\u044f \u0432\u0430\u0448\u0435\u0433\u043e \u0440\u043e\u0434\u0441\u0442\u0432\u0435\u043d\u043d\u0438\u043a\u0430 \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u0438",
      },
      sponsorRelationship: {
        label: "\u0420\u043e\u0434\u0441\u0442\u0432\u043e \u0441\u043e \u0441\u043f\u043e\u043d\u0441\u043e\u0440\u043e\u043c",
        placeholder: "\u043d\u0430\u043f\u0440. \u0421\u0443\u043f\u0440\u0443\u0433, \u0420\u043e\u0434\u0438\u0442\u0435\u043b\u044c, \u0420\u0435\u0431\u0451\u043d\u043e\u043a",
      },
      sponsorResidencePermit: {
        label: "\u041d\u043e\u043c\u0435\u0440 \u0432\u0438\u0434\u0430 \u043d\u0430 \u0436\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e \u0441\u043f\u043e\u043d\u0441\u043e\u0440\u0430",
        placeholder: "NIE \u0438\u043b\u0438 \u043d\u043e\u043c\u0435\u0440 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u0438\u044f",
      },
      sponsorAddress: {
        label: "\u0410\u0434\u0440\u0435\u0441 \u0441\u043f\u043e\u043d\u0441\u043e\u0440\u0430 \u0432 \u0418\u0441\u043f\u0430\u043d\u0438\u0438",
        placeholder: "\u041f\u043e\u043b\u043d\u044b\u0439 \u0430\u0434\u0440\u0435\u0441",
      },
      incomeSource: {
        label: "\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a \u0434\u043e\u0445\u043e\u0434\u0430",
        placeholder: "\u043d\u0430\u043f\u0440. \u041f\u0435\u043d\u0441\u0438\u044f, \u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0438, \u041d\u0430\u043a\u043e\u043f\u043b\u0435\u043d\u0438\u044f",
      },
      monthlyAmount: {
        label: "\u0415\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 \u0434\u043e\u0445\u043e\u0434/\u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430 (EUR)",
        placeholder: "\u043d\u0430\u043f\u0440. 3000",
      },
      savingsAmount: {
        label: "\u041e\u0431\u0449\u0438\u0435 \u043d\u0430\u043a\u043e\u043f\u043b\u0435\u043d\u0438\u044f (EUR)",
        placeholder: "\u043d\u0430\u043f\u0440. 100000",
      },
      plannedResidence: {
        label: "\u041f\u043b\u0430\u043d\u0438\u0440\u0443\u0435\u043c\u044b\u0439 \u0433\u043e\u0440\u043e\u0434 \u043f\u0440\u043e\u0436\u0438\u0432\u0430\u043d\u0438\u044f",
        placeholder: "\u043d\u0430\u043f\u0440. \u0411\u0430\u0440\u0441\u0435\u043b\u043e\u043d\u0430, \u041c\u0430\u0434\u0440\u0438\u0434",
      },
    },

    step4Title: "\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
    step4Subtitle: "\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0434\u0435\u0442\u0430\u043b\u0438 \u0432\u0430\u0448\u0435\u0433\u043e \u0444\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u043e\u0433\u043e \u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u044f.",
    step4Fields: {
      annualIncome: {
        label: "\u0413\u043e\u0434\u043e\u0432\u043e\u0439 \u0434\u043e\u0445\u043e\u0434 (EUR)",
        placeholder: "\u043d\u0430\u043f\u0440. 60000",
      },
      monthlyIncome: {
        label: "\u0415\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 \u0434\u043e\u0445\u043e\u0434 (EUR)",
        placeholder: "\u043d\u0430\u043f\u0440. 5000",
      },
      bankName: { label: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0431\u0430\u043d\u043a\u0430", placeholder: "\u043d\u0430\u043f\u0440. \u0421\u0431\u0435\u0440\u0431\u0430\u043d\u043a, HSBC" },
      bankAccountCountry: {
        label: "\u0421\u0442\u0440\u0430\u043d\u0430 \u0431\u0430\u043d\u043a\u043e\u0432\u0441\u043a\u043e\u0433\u043e \u0441\u0447\u0451\u0442\u0430",
        placeholder: "\u043d\u0430\u043f\u0440. \u0420\u043e\u0441\u0441\u0438\u044f",
      },
      sourceOfFunds: { label: "\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0441\u0442\u0432", placeholder: "" },
    },
    fundSources: {
      select: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
      employment: "\u0422\u0440\u0443\u0434\u043e\u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e / \u0417\u0430\u0440\u043f\u043b\u0430\u0442\u0430",
      self_employment: "\u0421\u0430\u043c\u043e\u0437\u0430\u043d\u044f\u0442\u043e\u0441\u0442\u044c / \u0411\u0438\u0437\u043d\u0435\u0441",
      investments: "\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0438 / \u0414\u0438\u0432\u0438\u0434\u0435\u043d\u0434\u044b",
      savings: "\u041d\u0430\u043a\u043e\u043f\u043b\u0435\u043d\u0438\u044f",
      pension: "\u041f\u0435\u043d\u0441\u0438\u044f",
      family_support: "\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u0441\u0435\u043c\u044c\u0438",
      other: "\u0414\u0440\u0443\u0433\u043e\u0435",
    },

    step5Title: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432",
    step5Subtitle:
      "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b\u0435 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b. PDF, JPG \u0438\u043b\u0438 PNG \u0434\u043e 10\u041c\u0411 \u043a\u0430\u0436\u0434\u044b\u0439.",
    step5Error:
      "\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430. \u0412\u0435\u0440\u043d\u0438\u0442\u0435\u0441\u044c \u043d\u0430\u0437\u0430\u0434 \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0441\u043d\u043e\u0432\u0430.",
    uploadFailed: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0441\u043d\u043e\u0432\u0430.",
    uploading: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430",
    replace: "\u0417\u0430\u043c\u0435\u043d\u0438\u0442\u044c",
    upload: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c",
    docsUploaded: "\u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043e.",
    docsNote:
      "\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u043f\u043e\u0437\u0436\u0435.",
    docLabels: {
      passport: "\u041a\u043e\u043f\u0438\u044f \u043f\u0430\u0441\u043f\u043e\u0440\u0442\u0430",
      photo: "\u0424\u043e\u0442\u043e \u043d\u0430 \u043f\u0430\u0441\u043f\u043e\u0440\u0442",
      employment_contract: "\u0422\u0440\u0443\u0434\u043e\u0432\u043e\u0439 \u0434\u043e\u0433\u043e\u0432\u043e\u0440",
      criminal_record: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 \u043e \u043d\u0435\u0441\u0443\u0434\u0438\u043c\u043e\u0441\u0442\u0438",
      health_insurance: "\u041c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u0430\u044f \u0441\u0442\u0440\u0430\u0445\u043e\u0432\u043a\u0430",
      proof_of_income: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0434\u043e\u0445\u043e\u0434\u0430",
      bank_statement: "\u0412\u044b\u043f\u0438\u0441\u043a\u0430 \u0438\u0437 \u0431\u0430\u043d\u043a\u0430",
      accommodation_proof: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u043f\u0440\u043e\u0436\u0438\u0432\u0430\u043d\u0438\u044f",
    },

    step6Title: "\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0430",
    step6Subtitle: "\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043f\u0435\u0440\u0435\u0434 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u043e\u0439.",
    step6Error:
      "\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u0440\u0438\u043c\u0438\u0442\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f \u0434\u043b\u044f \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438",
    sectionVisaType: "\u0422\u0438\u043f \u0432\u0438\u0437\u044b",
    sectionPersonal: "\u041b\u0438\u0447\u043d\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
    sectionFinancial: "\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
    sectionDocuments: "\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b",
    selectedVisa: "\u0412\u044b\u0431\u0440\u0430\u043d\u043d\u0430\u044f \u0432\u0438\u0437\u0430",
    noDocuments: "\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u0435\u0449\u0451 \u043d\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u044b.",
    termsConfirm:
      "\u042f \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044e, \u0447\u0442\u043e \u0432\u0441\u044f \u043f\u0440\u0435\u0434\u043e\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u043d\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0442\u043e\u0447\u043d\u0430 \u0438 \u043f\u043e\u043b\u043d\u0430. \u042f \u043f\u043e\u043d\u0438\u043c\u0430\u044e, \u0447\u0442\u043e \u043f\u0440\u0435\u0434\u043e\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043b\u043e\u0436\u043d\u043e\u0439 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u043c\u043e\u0436\u0435\u0442 \u043f\u0440\u0438\u0432\u0435\u0441\u0442\u0438 \u043a \u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u044e \u0437\u0430\u044f\u0432\u043a\u0438. \u042f \u0441\u043e\u0433\u043b\u0430\u0441\u0435\u043d \u0441",
    termsOfService: "\u0423\u0441\u043b\u043e\u0432\u0438\u044f\u043c\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f",
    and: "\u0438",
    privacyPolicy: "\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u043e\u0439 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438",

    back: "\u041d\u0430\u0437\u0430\u0434",
    continue: "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c",
    continueToReview: "\u041a \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0435",
    submitApplication: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443",
  },

  dashboard: {
    title: "\u041f\u0430\u043d\u0435\u043b\u044c",
    welcomeBack: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c,",
    noAppTitle: "\u0417\u0430\u044f\u0432\u043e\u043a \u043f\u043e\u043a\u0430 \u043d\u0435\u0442",
    noAppDesc:
      "\u041d\u0430\u0447\u043d\u0438\u0442\u0435 \u0441\u0432\u043e\u0439 \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u043f\u0443\u0442\u044c, \u0441\u043e\u0437\u0434\u0430\u0432 \u043d\u043e\u0432\u0443\u044e \u0432\u0438\u0437\u043e\u0432\u0443\u044e \u0437\u0430\u044f\u0432\u043a\u0443.",
    startApp: "\u041d\u0430\u0447\u0430\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443",
    continueApp: "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443",
    progress: "\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441",
    stepOf: "\u0428\u0430\u0433 {current} \u0438\u0437 {total}",
    created: "\u0421\u043e\u0437\u0434\u0430\u043d\u043e",
    updated: "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e",
    visaType: "\u0422\u0438\u043f \u0432\u0438\u0437\u044b",
    status: "\u0421\u0442\u0430\u0442\u0443\u0441",
    notSelected: "\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u043e",
    timeline: "\u0425\u0440\u043e\u043d\u043e\u043b\u043e\u0433\u0438\u044f",
    current: "\u0422\u0435\u043a\u0443\u0449\u0438\u0439",
    timelineSteps: {
      draft: "\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430\u0447\u0430\u0442\u0430",
      submitted: "\u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430",
      under_review: "\u041d\u0430 \u0440\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u0438\u0438",
      approved: "\u0420\u0435\u0448\u0435\u043d\u0438\u0435 \u043f\u0440\u0438\u043d\u044f\u0442\u043e",
    },
    signOut: "\u0412\u044b\u0439\u0442\u0438",
  },

  validation: {
    required: "{field} \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e",
  },
};

export const translations: Record<Language, Translations> = { en, es, ru };

export function t(
  translations: Translations,
  key: string,
  replacements?: Record<string, string>
): string {
  const keys = key.split(".");
  let value: unknown = translations;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  if (typeof value !== "string") return key;
  if (replacements) {
    return Object.entries(replacements).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, v),
      value
    );
  }
  return value;
}
