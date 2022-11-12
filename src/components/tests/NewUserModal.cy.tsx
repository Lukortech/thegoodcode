import NewUserModal from "../NewUserModal";

const today = new Date();
const initialValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: today,
  isAdmin: false,
};

describe("NewUserModal.cy.ts", () => {
  it("Opens and closes", () => {
    let isOpen = true;
    cy.mount(
      <NewUserModal
        newUserForm={initialValues}
        setNewUserForm={() => {}}
        handleClose={() => {
          isOpen = !isOpen;
        }}
        handleSubmit={() => {}}
        isOpen={isOpen}
      />
    );
    cy.get('[data-test-id="new-user-modal"]').should("be.visible");
    // cy.get('[data-test-id="new-user-modal-close-button"]').click()
    // cy.get('[data-test-id="new-user-modal"]').should('not.be.visible')
  });

  it("Has all the fields with initial values", () => {
    cy.mount(
      <NewUserModal
        newUserForm={initialValues}
        setNewUserForm={() => {}}
        handleClose={() => {}}
        handleSubmit={() => {}}
        isOpen={true}
      />
    );
    cy.get("h2").should("have.text", "Add new user");
    cy.get('input[type="text"]').eq(0).should("have.value", "");
    cy.get('input[type="text"]').eq(1).should("have.value", "");
    cy.get('input[type="text"]')
      .eq(2)
      .should(
        "have.value",
        today.toLocaleDateString("en", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })
      );
    cy.get('input[type="radio"]').eq(1).should("have.value", "false");
  });

  it("Allows for value change for each input", () => {
    cy.mount(
      <NewUserModal
        newUserForm={initialValues}
        setNewUserForm={() => {}}
        handleClose={() => {}}
        handleSubmit={() => {}}
        isOpen={true}
      />
    );

    const values = ["Adam", "Sandler", "11/11/2022", "false"];

    cy.get("h2").should("have.text", "Add new user");
    cy.get('input[type="text"]').eq(0).type(values[0]);
    cy.get('input[type="text"]').eq(1).type(values[1]);
    cy.get('input[type="text"]').eq(2).clear().type(values[2]).type("{esc}");
    cy.get('input[type="radio"]').eq(0).click();
    cy.get('input[type="radio"]').eq(1).should("have.value", values[3]);
  });
});
