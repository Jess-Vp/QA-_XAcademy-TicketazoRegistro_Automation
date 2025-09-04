// cypress/support/commands.js
// 🔧 Comandos reutilizables para specs

// Navegar a la pantalla de registro (usa baseUrl del config)
Cypress.Commands.add('goToRegister', () => {
  cy.visit('https://ticketazo.com.ar/auth/registerUser');
});


// Seleccion de (Provincia / Localidad): tipear y confirmar con Enter
Cypress.Commands.add('comboSelect', (selector, text) => {
  cy.get(selector).clear().type(`${text}{enter}`);
});

// Fecha segmentada: dd/mm/aaaa (tus 3 segments content editable)
Cypress.Commands.add('setBirthDate', (dd, mm, yyyy) => {
  cy.get('[data-type="day"]').clear().type(dd);
  cy.get('[data-type="month"]').clear().type(mm);
  cy.get('[data-type="year"]').clear().type(yyyy);
});

// Relleno de formularios
Cypress.Commands.add('fillValidRegisterForm', (overrides = {}) => {
  const data = {
    nombres: 'Jessica',
    apellido: 'Puricelli',
    telefono: '1155512345',  // 10 dígitos
    dni: Math.floor(10000000 + Math.random() * 90000000),          // 8 dígitos
    provincia: 'Buenos Aires',
    localidad: 'La Plata',
    day: '10', month: '10', year: '1995', // mayor de edad
    email: 'jess@qa.com',
    pass: 'Secret123!',
    ...overrides
  };

  cy.get('[data-cy="input-nombres"]').clear().type(data.nombres);
  cy.get('[data-cy="input-apellido"]').clear().type(data.apellido);
  cy.get('[data-cy="input-telefono"]').clear().type(data.telefono);
  cy.get('[data-cy="input-dni"]').clear().type(data.dni);

  cy.comboSelect('[data-cy="select-provincia"]', data.provincia);
  cy.comboSelect('[data-cy="select-localidad"]', data.localidad);

  cy.setBirthDate(data.day, data.month, data.year);

  cy.get('[data-cy="input-email"]').clear().type(data.email);
  cy.get('[data-cy="input-confirmar-email"]').clear().type(data.email);

  cy.get('[data-cy="input-password"]').clear().type(data.pass);
  cy.get('[data-cy="input-repetir-password"]').clear().type(data.pass);
});

//Check campos maxlength: el campo no debe aceptar más de N chars
Cypress.Commands.add('assertMaxLength', (selector, attemptValue, expectedLen) => {
  cy.get(selector).clear().type(attemptValue);
  cy.get(selector).invoke('val').then(v => {
    expect(String(v).length, `${selector} maxlength`).to.eq(expectedLen);
  });
});


// Esperar/validar el texto del alert nativo del navegador
Cypress.Commands.add('expectAlertContains', (expectedTexts) => {
  cy.on('window:alert', (text) => {
    (Array.isArray(expectedTexts) ? expectedTexts : [expectedTexts]).forEach(t => {
      expect(text).to.contain(t);
    });
  });
});


// Contar cantidad de requests de registro (para doble submit)
Cypress.Commands.add('captureRegisterRequests', () => {
  const requests = [];
  cy.intercept('POST', '**/auth/register**', (req) => {
    requests.push(req);
  }).as('regAny');
  cy.wrap(requests).as('regRequests'); // alias con el array de reqs
});

// 422: duplicado u otros errores de validación
Cypress.Commands.add('mockRegister422', (body = { errors: { email: ['Duplicado'] } }) => {
  cy.intercept('POST', '**/auth/register**', {
    statusCode: 422,
    body
  }).as('reg422');
});


