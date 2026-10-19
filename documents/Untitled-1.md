cura-playwright-framework/
├── .github/
│   └── workflows/
│       ├── e2e-tests.yml
│       └── nightly-regression.yml
├── config/
│   ├── environments.ts
│   └── env.schema.ts
├── src/
│   ├── pages/
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── MakeAppointmentPage.ts
│   │   └── SummaryPage.ts
│   ├── fixtures/
│   │   └── test-fixtures.ts
│   ├── data/
│   │   ├── csv-reader.ts
│   │   ├── json-reader.ts
│   │   └── excel-reader.ts
│   └── utils/
│       ├── date-utils.ts
│       └── test-data-factory.ts
├── tests/
│   ├── auth/
│   │   └── login.spec.ts
│   └── appointments/
│       ├── create-appointment.spec.ts
│       └── appointment-validation.spec.ts
├── test-data/
│   ├── login.json
│   ├── appointments.json
│   ├── appointments.csv
│   └── appointments.xlsx
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
