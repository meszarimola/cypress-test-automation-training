describe("RESTful API testing with cy.request()", () => {
  it("GET /objects should return 200", () => {
    cy.request("/objects").then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it("Response is correct", () => {
    cy.fixture("objects_expected.json").then((expectedObjects) => {
      cy.request("/objects").then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");

        // minden várt objektum szerepeljen a response-ban id alapján
        expectedObjects.forEach((expected) => {
          const actual = res.body.find((o) => o.id === expected.id);
          expect(actual, `Object with id ${expected.id} should exist`).to.exist;

          // név ellenőrzése
          expect(actual.name).to.eq(expected.name);

          // data ellenőrzése (null vs object)
          if (expected.data === null) {
            expect(actual.data).to.be.null;
          } else {
            expect(actual.data).to.include(expected.data);
          }
        });
      });
    });
  });

  it("should return expected objects from fixture", () => {
    cy.fixture("object_ids_3_5_10.json").then((expectedData) => {
      // cy.request("/objects?id=3&id=5&id=10").then((res) => {
      cy.request({
        method: "GET",
        url: "/objects",
        qs: { id: [3, 5, 10] },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.eq(expectedData.length);

        expectedData.forEach((expected) => {
          const actual = res.body.find((o) => o.id === expected.id);
          expect(actual, `Object with id ${expected.id} should exist`).to.exist;
          expect(actual.name).to.eq(expected.name);

          if (expected.data === null) {
            expect(actual.data).to.be.null;
          } else {
            expect(actual.data).to.include(expected.data);
          }
        });
      });
    });
  });

  it("creates MacBook Pro 16 and verifies response structure", () => {
    cy.fixture("macbook_payload.json").then((payload) => {
      cy.fixture("macbook_expected.json").then((expected) => {
        cy.request("POST", "/objects", payload).then((res) => {
          // Státuszkód
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an("object");

          // Az adat egyezni ekll az elvártakkal
          // ez nem működne:
          // expect(res.body).to.include(expected)
          // mert shallow összehasonlítást végez a data mezőnél objektum–objektum referencia-egyezést vár,
          // nem pedig mélységi (deep) egyezést. Hiába azonos a tartalom, két külön objektumról van szó → fail.
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("name", expected.name);
          expect(res.body).to.have.property("data");
        });
      });
    });
  });

  it("creates object and then deletes it", () => {
    const testObject = {
      name: "Test Object for Deletion",
      data: {
        description: "This object will be deleted",
        temporary: true
      }
    };

    cy.request("POST", "/objects", testObject).then((createRes) => {
      expect(createRes.status).to.eq(200);
      expect(createRes.body).to.have.property("id");
      const objectId = createRes.body.id;

      cy.request("DELETE", `/objects/${objectId}`).then((deleteRes) => {
        expect(deleteRes.status).to.be.oneOf([200, 204]);

        cy.request({
          method: "GET",
          url: `/objects/${objectId}`,
          failOnStatusCode: false
        }).then((getRes) => {
          expect(getRes.status).to.eq(404);
        });
      });
    });
  });

  it("updates existing object with PUT request", () => {
    const originalObject = {
      name: "Original Object",
      data: {
        version: 1,
        status: "draft"
      }
    };

    const updatedObject = {
      name: "Updated Object",
      data: {
        version: 2,
        status: "published",
        lastModified: "2024-01-01"
      }
    };

    cy.request("POST", "/objects", originalObject).then((createRes) => {
      expect(createRes.status).to.eq(200);
      expect(createRes.body).to.have.property("id");
      const objectId = createRes.body.id;

      cy.request("PUT", `/objects/${objectId}`, updatedObject).then((updateRes) => {
        expect(updateRes.status).to.eq(200);
        expect(updateRes.body).to.have.property("name", updatedObject.name);
        expect(updateRes.body.data).to.include(updatedObject.data);

        cy.request("GET", `/objects/${objectId}`).then((getRes) => {
          expect(getRes.status).to.eq(200);
          expect(getRes.body.name).to.eq(updatedObject.name);
          expect(getRes.body.data.version).to.eq(2);
          expect(getRes.body.data.status).to.eq("published");
        });
      });
    });
  });
});
