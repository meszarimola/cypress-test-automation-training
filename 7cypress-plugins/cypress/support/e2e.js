//ez a fájl automatikusan lefut minden teszt előtt
// itt tudod garantálni, hogy a közös beállítások minden tesztre érvényesek lesznek
// például itt tudod importálni a parancsokat, amiket a parancsok.js fájlban definiáltál
// import './commands'
require('cypress-xpath');
import 'cypress-mochawesome-reporter/register';
import 'cypress-axe';

const { addMatchImageSnapshotCommand } = require("cypress-image-snapshot/command");

addMatchImageSnapshotCommand({
  // opcionális defaultok:
  failureThreshold: 0.02,            // 2% hiba esetén bukjon
  failureThresholdType: 'percent',   // 'percent' | 'pixel'
  capture: 'viewport',               // vagy 'viewport'
});

Cypress.Commands.add('loginWithGoogle', () => {
  const options = {
    username: Cypress.env('GOOGLE_USER'), //cseréld ki a saját useredre a json fáljban - az érték a cypress/env.json fájlban van
    password: Cypress.env('GOOGLE_PW'),  //cseréld k i a saját jelszavadra
    loginUrl: 'https://deals.androidauthority.com/login',           
    loginSelector: 'button[data-provider="google"]',                 
    postLoginSelector: 'a[href*="account"], .user-menu, .profile',  
    headless: true,
    logs: true,
    // isPopup: false, // ha új ablakban nyílik a provider, állítsd true-ra
  };

  return cy.task('GoogleSocialLogin', options).then(({ cookies, lsd }) => {
    // sütik visszatöltése a tesztelt domainre
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value, {
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expiry: cookie.expires,
      });
    });

    // (opcionális) localStorage / sessionStorage visszatöltés, ha a provider adta
    if (lsd) {
      Object.keys(lsd).forEach((key) => {
        cy.window().then((win) => win.localStorage.setItem(key, lsd[key]));
      });
    }
  });
});
