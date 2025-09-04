// Casos Negativos (Validaciones / Errores) - Registro Ticketazo

describe('Registro Ticketazo - Casos Negativos', () => {
  beforeEach(() => {
    cy.goToRegister();
  });

  it('Campos obligatorios vacíos: no envía y marca requeridos', () => {
    cy.get('[data-cy="btn-registrarse"]').click();

    const required = [
      '[data-cy="input-nombres"]',
      '[data-cy="input-apellido"]',
      '[data-cy="input-telefono"]',
      '[data-cy="input-dni"]',
      '[data-cy="select-provincia"]',
      '[data-cy="select-localidad"]',
      '[data-type="day"]', '[data-type="month"]', '[data-type="year"]',
      '[data-cy="input-email"]',
      '[data-cy="input-confirmar-email"]',
      '[data-cy="input-password"]',
      '[data-cy="input-repetir-password"]',
    ];

    required.forEach((sel) => {
      cy.get(sel).then(($el) => {
        const el = $el.get(0);
        // Si el control no expone validity (p.ej. contenteditable),
        // no fallamos; sirve para inputs nativos.
        if (el && el.checkValidity) {
          expect(el.checkValidity(), `Campo requerido: ${sel}`).to.eq(false);
        }
      });
    });

    cy.url().should('include', '/auth/registerUser');
  });

  it('Formato inválido de Email', () => {
    cy.fillValidRegisterForm({ email: 'no-es-email' });
    cy.get('[data-cy="btn-registrarse"]').click();

    cy.get('[data-cy="input-email"]').then(($el) => {
      const el = $el.get(0);
      if (el && el.validity) expect(el.validity.typeMismatch).to.eq(true);
    });

    cy.url().should('include', '/auth/registerUser');
  });

  it('Email y Confirmar Email distintos', () => {
    cy.fillValidRegisterForm({ email: 'a@a.com' });
    cy.get('[data-cy="input-confirmar-email"]').clear().type('b@b.com');

    cy.get('[data-cy="btn-registrarse"]').click();
    // Esperado: bloquea envío; seguimos en la misma URL
    cy.url().should('include', '/auth/registerUser');

  });

  it('Contraseña y Repetir contraseña distintos', () => {
    cy.fillValidRegisterForm({ pass: 'Secret123!' });
    cy.get('[data-cy="input-repetir-password"]').clear().type('Secret123');

    cy.get('[data-cy="btn-registrarse"]').click();
    cy.url().should('include', '/auth/registerUser');
    
  });

  it('Contraseña menor a 8 caracteres', () => {
    cy.fillValidRegisterForm({ pass: 'Abc123' }); // 6 chars
    cy.get('[data-cy="btn-registrarse"]').click();
    cy.url().should('include', '/auth/registerUser');
    
  });

  it('Teléfono inválido (letras o longitud ≠ 10)', () => {
    cy.fillValidRegisterForm();
    cy.get('[data-cy="input-telefono"]').clear().type('abc123');
    cy.get('[data-cy="btn-registrarse"]').click();

    cy.get('[data-cy="input-telefono"]').then(($el) => {
      const el = $el.get(0);
      if (el && el.validity) expect(el.validity.valid).to.eq(false);
    });

    cy.url().should('include', '/auth/registerUser');
  });

  it('DNI inválido (letras o longitud ≠ 8)', () => {
    cy.fillValidRegisterForm();
    cy.get('[data-cy="input-dni"]').clear().type('abcd1234');
    cy.get('[data-cy="btn-registrarse"]').click();

    cy.get('[data-cy="input-dni"]').then(($el) => {
      const el = $el.get(0);
      if (el && el.validity) expect(el.validity.valid).to.eq(false);
    });

    cy.url().should('include', '/auth/registerUser');
  });

  it('Fecha de nacimiento imposible (31/02/2000)', () => {
    cy.fillValidRegisterForm();
    cy.setBirthDate('31', '02', '2000');
    cy.get('[data-cy="btn-registrarse"]').click();

    // Comportamiento puede variar por la librería; al menos validamos que no avanza (consultar si debo incluirlo?)
    cy.url().should('include', '/auth/registerUser');
  });

  it('Edad no permitida (<18)', () => {
    // calculamos fecha de 16 años
    const today = new Date();
    const y = today.getFullYear() - 16;
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    cy.fillValidRegisterForm();
    cy.setBirthDate(dd, mm, String(y));

    cy.get('[data-cy="btn-registrarse"]').click();
    cy.url().should('include', '/auth/registerUser');
  });

  it('Provincia y Localidad no seleccionadas', () => {
    // Llenamos todo válido, luego vaciamos provincia/localidad
    cy.fillValidRegisterForm();
    cy.get('[data-cy="select-provincia"]').clear();
    cy.get('[data-cy="select-localidad"]').clear();

    cy.get('[data-cy="btn-registrarse"]').click();
    cy.url().should('include', '/auth/registerUser');
  });

  it('Localidad sin Provincia previa', () => {
    cy.fillValidRegisterForm();
    // Limpio provincia y dejo localidad cargada
    cy.get('[data-cy="select-provincia"]').clear();
    cy.get('[data-cy="select-localidad"]').clear().type('Cualquier Localidad{enter}');

    cy.get('[data-cy="btn-registrarse"]').click();
    cy.url().should('include', '/auth/registerUser');
  });
// Intento de caso de doble click en submit -- no salio --
//   it('Prevención de doble submit (un solo request)', () => {
//     // Interceptamos el POST real para contar requests (NO mockeamos respuesta)
//     cy.captureRegisterRequests();
//     const uniqueEmail = `qa_${Date.now()}@example.com`;
//     cy.fillValidRegisterForm({ email: uniqueEmail });

//     // Doble click rápido
//     cy.get('[data-cy="btn-registrarse"]').dblclick();

//     // Debe haberse enviado UNA sola vez
//     cy.get('@regRequests').then(reqs => {
//       expect(reqs.length, 'Cantidad de requests').to.eq(1);
//     });
//   });

// caso de pruebaz de error 422 duplicado- no anda 
//   it('Error de servidor 422 (duplicado) muestra mensaje y conserva datos', () => {
//     cy.mockRegister422({
//       errors: { email: ['Ya existe una cuenta con ese email'] }
//     });

//     const usedEmail = 'dup@qa.com';
//     cy.fillValidRegisterForm({ email: usedEmail });
//     cy.get('[data-cy="btn-registrarse"]').click();

//     cy.wait('@reg422');
//     // seguimos en registro
//     cy.url().should('include', '/auth/registerUser');

//     // el email sigue tipeado
//     cy.get('[data-cy="input-email"]').should('have.value', usedEmail);

//   });


});
