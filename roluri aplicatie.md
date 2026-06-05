# Role-Based Access Control & Clinical Features (Treatments & Vitals)

This plan defines and implements specific functionalities for each of the four roles in the system (`Admin`, `Medic`, `Asistent`, `Recepție`).

---

## Roles & Permissions Matrix

| Menu / Action                           | Admin          | Medic          | Asistent (Nurse) | Recepție (Receptionist) |
| :--- | :---: | :---: | :---: | :---: |
| **Sidebar Menu: Personal Medical**      | ✅ Full Access | ❌ Hidden      | ❌ Hidden        | ❌ Hidden |
| **Sidebar Menu: Structură**             | ✅ Full Access | 👁️ Read-Only   | 👁️ Read-Only     | ❌ Hidden |
| **Gestiune Pacienți (Add/Edit)**        | ✅ Yes         | ✅ Yes         | ✅ Yes (Basic info) | ✅ Yes (Full info) |
| **Gestiune Pacienți (Delete)**          | ✅ Yes         | ❌ No          | ❌ No           | ❌ No |
| **Internări / Externări: Adăugare**     | ✅ Yes         | ❌ No          | ❌ No           | ✅ Yes |
| **Internări / Externări: Externare**    | ✅ Yes         | ✅ Yes         | ❌ No           | ❌ No |
| **Fișă Medicală (Admissions Panel)**    | ✅ View-Only   | ✅ View & Prescribe | ✅ View & Log Admin/Vitals | ❌ Hidden |
| **Prescriere Tratamente**               | ✅ View-Only   | ✅ Yes | ❌ Read-Only | ❌ Hidden |
| **Administrare Tratamente**             | ✅ View-Only   | ✅ View-Only | ✅ Yes | ❌ Hidden |
| **Măsurători Semne Vitale**             | ✅ View-Only   | ✅ View-Only | ✅ Yes | ❌ Hidden |

---

## User Review Required

> [!IMPORTANT]
> The database schema will be extended with two new tables (`Masuratoris` and `Administrares`) to track patient vitals and nurse administration logs. Since we disabled `alter: true` to prevent MySQL key-limit bugs, the database will automatically create these two tables on the next startup.

---

## Proposed Changes

### Database Layer (Models)

#### [NEW] [Administrare.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/models/Administrare.ts)
Create a new Sequelize model for treatment administration logs:
- `id` (PK)
- `id_tratament` (FK reference to Tratament)
- `nume_asistent` (String, name of the nurse who gave it)
- `data_administrare` (Date, defaults to NOW)
- `observatii` (Text, optional)

#### [NEW] [Masuratori.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/models/Masuratori.ts)
Create a new Sequelize model for logging patient vital signs:
- `id` (PK)
- `id_internare` (FK reference to Internare)
- `temperatura` (Float)
- `tensiune` (String, e.g. "120/80")
- `puls` (Integer)
- `greutate` (Float)
- `nume_asistent` (String, name of the nurse who measured)
- `data_masurare` (Date, defaults to NOW)

#### [MODIFY] [index.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/models/index.ts)
Import and define relationships:
- `Tratament.hasMany(Administrare)` & `Administrare.belongsTo(Tratament)`
- `Internare.hasMany(Masuratori)` & `Masuratori.belongsTo(Internare)`

---

### Backend API Layer (Routes)

#### [NEW] [treatments.get.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/api/admissions/%5Bid%5D/treatments.get.ts)
Return all treatments (with their administrations logs) for a given admission ID.

#### [NEW] [treatments.post.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/api/admissions/%5Bid%5D/treatments.post.ts)
Allow `Medic` or `Admin` to prescribe a treatment for a given admission ID.

#### [NEW] [administer.post.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/api/treatments/administer.post.ts)
Allow `Asistent`, `Medic`, or `Admin` to log a treatment administration.

#### [NEW] [vitals.get.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/api/admissions/%5Bid%5D/vitals.get.ts)
Return all logged vital signs for a given admission ID.

#### [NEW] [vitals.post.ts](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/server/api/admissions/%5Bid%5D/vitals.post.ts)
Allow `Asistent`, `Medic`, or `Admin` to add a vital signs log for a given admission ID.

---

### Frontend UI Layer (Vue Components & Pages)

#### [MODIFY] [Sidebar.vue](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/components/Sidebar.vue)
- Show "Personal Medical" page link only if user is `Admin`.
- Show "Structură" page link if user is `Admin`, `Medic`, or `Asistent`. Hide it for `Recepție`.

#### [MODIFY] [employees/index.vue](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/pages/employees/index.vue)
- Add a check on mounted setup. If role is not `Admin`, redirect to `/dashboard`.

#### [MODIFY] [structure/index.vue](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/pages/structure/index.vue)
- If role is not `Admin`, hide/disable buttons for adding/editing/deleting sections, saloons, or beds.

#### [MODIFY] [patients.vue](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/pages/patients.vue)
- Hide/disable the Delete action button for non-Admin users.

#### [MODIFY] [admissions/index.vue](file:///c:/Users/alexa/Desktop/LICENTAAAAAA/hospital-manager/client/pages/admissions/index.vue)
- Hide "Internare Nouă" button for `Medic` and `Asistent` (only `Recepție` and `Admin` can register admissions).
- Hide "Externează" button for `Asistent` and `Recepție` (only `Medic` and `Admin` can discharge patients).
- Add a "Fișă Medicală" (Medical File) button for each active admission.
- Create a dialog for **Fișă Medicală**:
  - **Recepție**: Cannot see or open this file (violates patient confidentiality).
  - **Medic & Asistent**: Can open it and view:
    - **Tratamente**: List of treatments. Doctors see an "Adaugă Tratament" form. Nurses see an "Administrează" button next to treatments to log administration notes.
    - **Măsurători Semne Vitale**: List of recorded temperature, pulse, blood pressure, weight. Nurses and Doctors see an "Adaugă Măsurători" form to log vital signs.

---

## Verification Plan

### Manual Verification
1. Log in as an **Admin**:
   - Verify all menus are visible.
   - Verify you can delete patients, manage employees, and manage the hospital structure.
2. Log in as a **Recepție**:
   - Verify you cannot see "Personal Medical" or "Structură".
   - Verify you can add patients and admissions, but cannot see/open "Fișă Medicală".
   - Verify "Externează" and "Delete Patient" actions are hidden or disabled.
3. Log in as a **Medic**:
   - Verify you cannot see "Personal Medical".
   - Verify "Structură" is read-only.
   - Verify you can perform "Externează" and add new prescriptions in the "Fișă Medicală" dialog.
4. Log in as an **Asistent**:
   - Verify you cannot see "Personal Medical".
   - Verify you cannot discharge patients.
   - Verify you can open "Fișă Medicală" to add vital measurements and log treatment administrations.
