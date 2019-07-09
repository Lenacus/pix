when('je vais sur la page de démarrage des certifications', () => {
  cy.visit(`/certifications`);
});

then(`je vois la page de lancement du test de certification`, () => {
  cy.get('button').contains('Lancer le test').should('be.visible');
});

when('je tape le code {string} et je clique sur "Lancer le test"' , (accessCode) => {
  cy.get('input#session-code').type(accessCode)
  cy.get('button').contains('Lancer le test').click();
});

then(`je vois que mon profil n'est pas encore certifiable`, () => {
  cy.contains('pas encore certifiable').should('be.visible');
});
