# Hospital Manager - Proiect de Licență

## 📌 Descriere
Această aplicație este o platformă completă pentru managementul activităților dintr-o unitate spitalicească. Sistemul asigură gestiunea pacienților, urmărirea statusului internărilor, alocarea paturilor în saloane și gestionarea personalului medical (autentificare și autorizare bazată pe roluri).

Proiectul a fost dezvoltat ca lucrare de licență, având o arhitectură modernă de tip client-server unificată.

## 🛠 Tehnologii Utilizate

### Frontend (Client-side)
* **Vue.js 3** (Composition API) - Framework principal pentru interfața utilizator
* **Vuetify 3** - Bibliotecă de componente UI (Material Design)
* **Pinia** - Managementul stării (State Management) pentru sesiunile utilizatorilor

### Backend (Server-side)
* **Nuxt 3 (Nitro Engine)** - Framework full-stack care servește atât frontend-ul cât și rutele de API
* **Node.js** - Mediu de execuție
* **Sequelize (ORM)** - Mapează obiectual baza de date relațională
* **JWT (JSON Web Tokens)** - Securizarea rutelor API
* **Bcrypt** - Hash-uirea și securizarea parolelor în baza de date

### Bază de date & DevOps
* **MySQL** - Sistemul de gestiune a bazelor de date relaționale
* **Docker & Docker Compose** - Containerizare pentru o portabilitate și o instalare ușoară

---

## 🚀 Instalare și Rulare

### Metoda 1: Folosind Docker (Recomandat)
Proiectul folosește Docker pentru a porni instantaneu atât baza de date MySQL, cât și aplicația web, fără a fi nevoie de instalări suplimentare.

1. Asigură-te că ai [Docker Desktop](https://www.docker.com/products/docker-desktop) instalat și pornit.
2. Deschide terminalul în folderul rădăcină al proiectului.
3. Rulează comanda:
   ```bash
   docker-compose up -d --build
   ```
4. Aplicația va fi accesibilă la adresa: `http://localhost:3000`

### Metoda 2: Rulare Locală (Pentru Dezvoltare)

**Cerințe:** Node.js (v18+) și un server local de MySQL (ex: XAMPP, Workbench).

1. Deschide folderul `client/` în terminal:
   ```bash
   cd client
   ```
2. Instalează pachetele necesare:
   ```bash
   npm install
   ```
3. (Important) Redenumește fișierul `.env.example` în `.env` și completează credențialele tale de MySQL:
   ```env
   DB_HOST=localhost
   DB_PORT=3307
   DB_NAME=hospital_db
   DB_USER=root
   DB_PASS=rootpassword
   JWT_SECRET=o_cheie_secreta_lunga
   ```
4. Pornește serverul de dezvoltare:
   ```bash
   npm run dev
   ```
5. Aplicația poate fi accesată la: `http://localhost:3000`

---

## 📂 Structura Arhitecturală

* `/client/pages` - Paginile Vue care alcătuiesc interfața (Rute frontend generate automat).
* `/client/server/api` - Rutele de backend (Controller-ele) care procesează datele.
* `/client/server/models` - Definiția tabelelor din baza de date (Modelele Sequelize).
* `/client/server/middleware` - Protejarea rutelor (verificare JWT).
* `/client/stores` - Gestiunea stării aplicației pe frontend (Autentificare, Notificări).

---
*Acest proiect respectă standardele academice de redactare a codului și este structurat pentru claritate, mentenabilitate și scalabilitate.*
