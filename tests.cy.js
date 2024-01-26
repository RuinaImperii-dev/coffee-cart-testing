describe("Тестирование сайта https://coffee-cart.app/", () => {
  beforeEach(() => {
    cy.visit("https://coffee-cart.app/");
  });

  it("Добавить кофе в корзину", () => {
    cy.get(".cup").eq(1).click().get("[aria-label='Cart page']").click().get("ul:not([class='cart-preview'])>.list-item").should("have.length", 1);
  });

  it("Перевод названия на китайский", () => {
    cy.get("h4[data-v-a9662a08]").eq(1).should("have.text", "Espresso Macchiato $12.00").dblclick().should("have.text", "浓缩玛奇朵 $12.00");
  });

  it("Проверка кол-ва товаров на странице", () => {
    cy.get(".cup").should("have.length", 9);
  });

  it("Проверка счетчиков", () => {
    cy.get(".cup")
      .last()
      .click()
      .get("[aria-label='Cart page']")
      .click()
      .then(() => {
        cy.get("ul:not([class='cart-preview'])>.list-item")
          .first()
          .each(($item) => {
            cy.wrap($item).find(".unit-desc").should("have.text", "$15.00 x 1");

            cy.get("button[aria-label='Proceed to checkout']").should("have.text", "Total: $15.00");

            cy.wrap($item).find("button[aria-label='Add one Cafe Breve']").click();

            cy.get("button[aria-label='Proceed to checkout']").should("have.text", "Total: $30.00");

            cy.wrap($item).find(".unit-desc").should("have.text", "$15.00 x 2");

            cy.wrap($item).find("[aria-label='Remove one Cafe Breve']").click();

            cy.get("button[aria-label='Proceed to checkout']").should("have.text", "Total: $15.00");

            cy.wrap($item).find(".unit-desc").should("have.text", "$15.00 x 1");
          });
      });
  });

  it("Проверка работы акции", () => {
    cy.get(".cup").first().click();
    cy.get(".cup").last().click();
    cy.get(".cup").eq(5).click();

    cy.get("button[class='yes']").click();

    cy.get("[aria-label='Cart page']").click().get("ul:not([class='cart-preview'])>.list-item").should("have.length", 4);
  });

  it("Проверка оплаты товаров", () => {
    cy.get(".cup").eq(4).click();

    cy.get(".pay").click();

    cy.get("#name").type("John");
    cy.get("#email").type("example@email.com");
    cy.get("#submit-payment").click();

    cy.get("[class='snackbar success fade-enter-active fade-enter-to']").should("have.text", "Thanks for your purchase. Please check your email for payment.");
  });
});
