// Casos Positivos (Happy Path) - Registro Ticketazo 

describe('Registro Ticketazo - Happy Path', () => {
  beforeEach(() => {
    cy.goToRegister(); // abre /https://ticketazo.com.ar/auth/registerUser -> usando baseUrl
  });

  it('Registro exitoso: muestra alert de éxito y redirige a Login', () => {
    const uniqueEmail = `qa_${Date.now()}@example.com`;

    // completamos el formulario con datos válidos
    cy.fillValidRegisterForm({ email: uniqueEmail });

    // Tomamos el alert del navegador y validamos si el mensaje es el correcto
    cy.expectAlertContains([
      'Usuario registrado con éxito',
      'verifica tu correo electrónico'
    ]);

    // enviar - click en boton registrarse
    cy.get('[data-cy="btn-registrarse"]').click();

    // después del alert, la app redirige a login
    cy.url().should('include', '/auth/login');
    cy.contains('Login').should('be.visible'); // verifica si estamos en la pantalla correcta
  });

  // Validacion campo Telefono y DNI caracteres

  it('Validación de maxlength en Teléfono (10) y DNI (8)', () => {
    cy.assertMaxLength('[data-cy="input-telefono"]', '123456789012345', 10);
    cy.assertMaxLength('[data-cy="input-dni"]', '1234567890', 8);
  });

  // Validacion de enmascarado de la contraseña 
  it('Enmascaramiento de contraseñas', () => {
    cy.get('[data-cy="input-password"]').should('have.attr', 'type', 'password');
    cy.get('[data-cy="input-repetir-password"]').should('have.attr', 'type', 'password');

    // también verificamos que acepta escritura (aunque se vea enmascarado)
    cy.get('[data-cy="input-password"]').type('Secret123!');
    cy.get('[data-cy="input-password"]').should('have.value', 'Secret123!');
  });


  // Validacion del submit y redireccion al login

  it('Navegación a Login desde el link', () => {
    cy.get('[data-cy="btn-login-link"]').click();
    cy.url().should('include', '/auth/login');
  });
});
