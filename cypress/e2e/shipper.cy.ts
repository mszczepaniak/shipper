describe('Shipper Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show initial state correctly', () => {
    cy.get('#e2e-route-selector').should('have.value', '');
    cy.get('#map').should('be.visible');
    cy.get('.mapboxgl-marker').should('not.exist');
    cy.get('app-speed-chart').should('exist');
    cy.get('app-legend').should('not.be.visible');
  });

  it('should update UI when a route is selected', () => {
    cy.get('ng-select').first().as('routeSelector');
    cy.get('@routeSelector').click();
    cy.get('ng-dropdown-panel').should('be.visible');
    cy.wait(2000);
    cy.get('ng-dropdown-panel .ng-option').first().click();
    cy.wait(1000);
    cy.get('#map').should('be.visible');
    cy.get('.mapboxgl-marker').should('have.length', 2);
    cy.get('app-speed-chart').should('not.be.empty');
    cy.get('app-legend').should('be.visible');
  });

  it('should reset UI when reset button is clicked', () => {
    cy.get('ng-select').first().as('routeSelector');
    cy.get('@routeSelector').click();
    cy.get('ng-dropdown-panel').should('be.visible');
    cy.wait(2000);
    cy.get('ng-dropdown-panel .ng-option').first().click();
    cy.wait(1000);
    cy.get('app-speed-chart .chart-container').should('not.be.empty');
    cy.get('#e2e-reset-button').click();
    cy.wait(1000);

    cy.get('ng-select').should('have.value', '');
    cy.get('#map').should('be.visible');
    cy.get('.mapboxgl-marker').should('not.exist');
    cy.get('app-legend').should('not.be.visible');
  });
});

