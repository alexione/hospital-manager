-- =============================================
-- SEED DATA - Spital Clinic Municipal
-- =============================================
USE hospital_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Masuratori;
TRUNCATE TABLE Administrari;
TRUNCATE TABLE Tratamente;
TRUNCATE TABLE Internari;
TRUNCATE TABLE Pacienti;
TRUNCATE TABLE Paturi;
TRUNCATE TABLE Saloane;
TRUNCATE TABLE Sectii;
TRUNCATE TABLE Angajati;
SET FOREIGN_KEY_CHECKS = 1;


-- =============================================
-- 1. ANGAJAȚI (20 angajați)
-- Parola pentru toți: "parola123" (bcrypt hash)
-- =============================================
INSERT INTO Angajati (cod_angajat, nume, prenume, email, password, role, createdAt, updatedAt) VALUES
(100001, 'Ionescu',    'Alexandru',  'admin@spital.ro',           '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Admin',        NOW(), NOW()),
(100002, 'Ionescu',    'Maria',      'maria.ionescu@spital.ro',   '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW()),
(100003, 'Georgescu',  'Andrei',     'andrei.georgescu@spital.ro','$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW()),
(100004, 'Dumitrescu', 'Elena',      'elena.dumitrescu@spital.ro','$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW()),
(100005, 'Popa',       'Cristian',   'cristian.popa@spital.ro',   '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW()),
(100006, 'Stan',       'Gabriela',   'gabriela.stan@spital.ro',   '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW()),
(100007, 'Radu',       'Mihai',      'mihai.radu@spital.ro',      '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Asistent',     NOW(), NOW()),
(100008, 'Matei',      'Ioana',      'ioana.matei@spital.ro',     '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Asistent',     NOW(), NOW()),
(100009, 'Stoica',     'Ana',        'ana.stoica@spital.ro',      '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Asistent',     NOW(), NOW()),
(100010, 'Dinu',       'Florin',     'florin.dinu@spital.ro',     '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Asistent',     NOW(), NOW()),
(100011, 'Marin',      'Daniela',    'daniela.marin@spital.ro',   '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Asistent',     NOW(), NOW()),
(100012, 'Constantin', 'Raluca',     'raluca.constantin@spital.ro','$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK','Asistent',     NOW(), NOW()),
(100013, 'Nistor',     'Bogdan',     'bogdan.nistor@spital.ro',   '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Registratură', NOW(), NOW()),
(100014, 'Voicu',      'Simona',     'simona.voicu@spital.ro',    '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Registratură', NOW(), NOW()),
(100015, 'Tudor',      'Vlad',       'vlad.tudor@spital.ro',      '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW()),
(100016, 'Moldovan',   'Alina',      'alina.moldovan@spital.ro',  '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Asistent',     NOW(), NOW()),
(100017, 'Barbu',      'Iulian',     'iulian.barbu@spital.ro',    '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW()),
(100018, 'Sandu',      'Adriana',    'adriana.sandu@spital.ro',   '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Asistent',     NOW(), NOW()),
(100019, 'Enache',     'Dragos',     'dragos.enache@spital.ro',   '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Registratură', NOW(), NOW()),
(100020, 'Neagu',      'Catalina',   'catalina.neagu@spital.ro',  '$2b$10$1hCrKh5GhxtSxpfvMNkCAupASK7..JGW4D3NgIAjQ9IGubKSOBTwK', 'Medic',        NOW(), NOW());

-- =============================================
-- 2. SECȚII (5 secții)
-- =============================================
INSERT INTO Sectii (cod_sectie, nume, createdAt, updatedAt) VALUES
('CARD', 'Cardiologie',          NOW(), NOW()),
('CHIR', 'Chirurgie Generală',   NOW(), NOW()),
('NEUR', 'Neurologie',           NOW(), NOW()),
('ORTO', 'Ortopedie',            NOW(), NOW()),
('PEDI', 'Pediatrie',            NOW(), NOW());

-- =============================================
-- 3. SALOANE (20 saloane, 4 pe secție)
-- =============================================
INSERT INTO Saloane (cod_salon, id_sectie, createdAt, updatedAt) VALUES
-- Cardiologie (secție 1)
('C-101', 1, NOW(), NOW()),
('C-102', 1, NOW(), NOW()),
('C-103', 1, NOW(), NOW()),
('C-104', 1, NOW(), NOW()),
-- Chirurgie (secție 2)
('CH-201', 2, NOW(), NOW()),
('CH-202', 2, NOW(), NOW()),
('CH-203', 2, NOW(), NOW()),
('CH-204', 2, NOW(), NOW()),
-- Neurologie (secție 3)
('N-301', 3, NOW(), NOW()),
('N-302', 3, NOW(), NOW()),
('N-303', 3, NOW(), NOW()),
('N-304', 3, NOW(), NOW()),
-- Ortopedie (secție 4)
('O-401', 4, NOW(), NOW()),
('O-402', 4, NOW(), NOW()),
('O-403', 4, NOW(), NOW()),
('O-404', 4, NOW(), NOW()),
-- Pediatrie (secție 5)
('P-501', 5, NOW(), NOW()),
('P-502', 5, NOW(), NOW()),
('P-503', 5, NOW(), NOW()),
('P-504', 5, NOW(), NOW());

-- =============================================
-- 4. PATURI (60 paturi, 3 per salon)
-- =============================================
INSERT INTO Paturi (cod_pat, id_salon, createdAt, updatedAt) VALUES
-- Cardiologie
('C-101-P1', 1, NOW(), NOW()), ('C-101-P2', 1, NOW(), NOW()), ('C-101-P3', 1, NOW(), NOW()),
('C-102-P1', 2, NOW(), NOW()), ('C-102-P2', 2, NOW(), NOW()), ('C-102-P3', 2, NOW(), NOW()),
('C-103-P1', 3, NOW(), NOW()), ('C-103-P2', 3, NOW(), NOW()), ('C-103-P3', 3, NOW(), NOW()),
('C-104-P1', 4, NOW(), NOW()), ('C-104-P2', 4, NOW(), NOW()), ('C-104-P3', 4, NOW(), NOW()),
-- Chirurgie
('CH-201-P1', 5, NOW(), NOW()), ('CH-201-P2', 5, NOW(), NOW()), ('CH-201-P3', 5, NOW(), NOW()),
('CH-202-P1', 6, NOW(), NOW()), ('CH-202-P2', 6, NOW(), NOW()), ('CH-202-P3', 6, NOW(), NOW()),
('CH-203-P1', 7, NOW(), NOW()), ('CH-203-P2', 7, NOW(), NOW()), ('CH-203-P3', 7, NOW(), NOW()),
('CH-204-P1', 8, NOW(), NOW()), ('CH-204-P2', 8, NOW(), NOW()), ('CH-204-P3', 8, NOW(), NOW()),
-- Neurologie
('N-301-P1', 9, NOW(), NOW()),  ('N-301-P2', 9, NOW(), NOW()),  ('N-301-P3', 9, NOW(), NOW()),
('N-302-P1', 10, NOW(), NOW()), ('N-302-P2', 10, NOW(), NOW()), ('N-302-P3', 10, NOW(), NOW()),
('N-303-P1', 11, NOW(), NOW()), ('N-303-P2', 11, NOW(), NOW()), ('N-303-P3', 11, NOW(), NOW()),
('N-304-P1', 12, NOW(), NOW()), ('N-304-P2', 12, NOW(), NOW()), ('N-304-P3', 12, NOW(), NOW()),
-- Ortopedie
('O-401-P1', 13, NOW(), NOW()), ('O-401-P2', 13, NOW(), NOW()), ('O-401-P3', 13, NOW(), NOW()),
('O-402-P1', 14, NOW(), NOW()), ('O-402-P2', 14, NOW(), NOW()), ('O-402-P3', 14, NOW(), NOW()),
('O-403-P1', 15, NOW(), NOW()), ('O-403-P2', 15, NOW(), NOW()), ('O-403-P3', 15, NOW(), NOW()),
('O-404-P1', 16, NOW(), NOW()), ('O-404-P2', 16, NOW(), NOW()), ('O-404-P3', 16, NOW(), NOW()),
-- Pediatrie
('P-501-P1', 17, NOW(), NOW()), ('P-501-P2', 17, NOW(), NOW()), ('P-501-P3', 17, NOW(), NOW()),
('P-502-P1', 18, NOW(), NOW()), ('P-502-P2', 18, NOW(), NOW()), ('P-502-P3', 18, NOW(), NOW()),
('P-503-P1', 19, NOW(), NOW()), ('P-503-P2', 19, NOW(), NOW()), ('P-503-P3', 19, NOW(), NOW()),
('P-504-P1', 20, NOW(), NOW()), ('P-504-P2', 20, NOW(), NOW()), ('P-504-P3', 20, NOW(), NOW());

-- =============================================
-- 5. PACIENȚI (25 pacienți)
-- =============================================
INSERT INTO Pacienti (cod_pacient, firstName, lastName, cnp, diagnosis, status, createdAt, updatedAt) VALUES
(200001, 'Ion',       'Vasilescu',    '1850312040015', 'Hipertensiune arterială esențială',        'admis', NOW(), NOW()),
(200002, 'Ana',       'Preda',        '2900715130028', 'Infarct miocardic acut',                  'admis', NOW(), NOW()),
(200003, 'Gheorghe',  'Dumitru',      '1780923270031', 'Apendicită acută',                        'admis', NOW(), NOW()),
(200004, 'Mihaela',   'Luca',         '2880104350044', 'Colecistită cronică',                     'admis', NOW(), NOW()),
(200005, 'Vasile',    'Munteanu',     '1920516080057', 'Accident vascular cerebral ischemic',      'admis', NOW(), NOW()),
(200006, 'Elena',     'Toma',         '2750828210060', 'Epilepsie - crize tonico-clonice',         'admis', NOW(), NOW()),
(200007, 'Adrian',    'Ciobanu',      '1830619150073', 'Fractură femur drept',                    'admis', NOW(), NOW()),
(200008, 'Daniela',   'Florea',       '2910702300086', 'Luxație de umăr stâng',                   'admis', NOW(), NOW()),
(200009, 'Marius',    'Iancu',        '1680415110099', 'Pneumonie virală',                        'admis', NOW(), NOW()),
(200010, 'Cristina',  'Pârvu',        '2850930250102', 'Insuficiență cardiacă congestivă',        'admis', NOW(), NOW()),
(200011, 'Sorin',     'Aldea',        '1790207180115', 'Hernie inghinală bilaterală',              'admis', NOW(), NOW()),
(200012, 'Luminița',  'Dobre',        '2940818400128', 'Meningită bacteriană',                    'admis', NOW(), NOW()),
(200013, 'Dragoș',    'Neculai',      '1870123060131', 'Fractură tibie stângă',                   'admis', NOW(), NOW()),
(200014, 'Raluca',    'Mocanu',       '2960411290144', 'Bronșiolită acută',                       'admis', NOW(), NOW()),
(200015, 'Ciprian',   'Ene',          '1810609370157', 'Fibrilație atrială paroxistică',           'admis', NOW(), NOW()),
(200016, 'Alina',     'Cristea',      '2870520430160', 'Ocluzie intestinală',                     'admis', NOW(), NOW()),
(200017, 'Florin',    'Manole',       '1750814090173', 'Neuropatie diabetică',                    'admis', NOW(), NOW()),
(200018, 'Georgiana', 'Niță',         '2930327510186', 'Scolioză severă',                         'admis', NOW(), NOW()),
(200019, 'Robert',    'Grigorescu',   '1880701220199', 'Angină pectorală instabilă',              'admis', NOW(), NOW()),
(200020, 'Simona',    'Vlad',         '2810913160202', 'Ulcer gastroduodenal perforat',           'externat', NOW(), NOW()),
(200021, 'Marcel',    'Oprea',        '1730405280215', 'Accident vascular cerebral hemoragic',     'externat', NOW(), NOW()),
(200022, 'Andreea',   'Sârbu',        '2950218340228', 'Entorse gleznă dreaptă',                  'externat', NOW(), NOW()),
(200023, 'Victor',    'Bădescu',      '1860830470231', 'Otită medie acută',                       'externat', NOW(), NOW()),
(200024, 'Diana',     'Cojocaru',     '2880612050244', 'Cardiomiopatie dilatativă',               'admis', NOW(), NOW()),
(200025, 'Cosmin',    'Drăgan',       '1900126190257', 'Apendicită acută gangrenată',             'externat', NOW(), NOW());

-- =============================================
-- 6. INTERNĂRI (20 internări active + 5 externate)
-- Pacienții 1-20 sunt internați activ, 21-25 au fost externați
-- =============================================
INSERT INTO Internari (cod_internare, id_pacient, id_pat, data_internare, data_externare, diagnostic, status, createdAt, updatedAt) VALUES
-- Internări active (internat) - Cardiologie
('INT-2025-001', 1,  1,  '2025-06-15 08:30:00', NULL, 'Hipertensiune arterială esențială grad III',        'internat', NOW(), NOW()),
('INT-2025-002', 2,  2,  '2025-06-18 14:15:00', NULL, 'Infarct miocardic acut STEMI anterior',             'internat', NOW(), NOW()),
('INT-2025-003', 10, 4,  '2025-06-20 09:00:00', NULL, 'Insuficiență cardiacă congestivă NYHA III',         'internat', NOW(), NOW()),
('INT-2025-004', 15, 7,  '2025-06-22 11:45:00', NULL, 'Fibrilație atrială paroxistică cu răspuns ventricular rapid', 'internat', NOW(), NOW()),
-- Internări active - Chirurgie
('INT-2025-005', 3,  13, '2025-06-17 06:20:00', NULL, 'Apendicită acută - intervenție chirurgicală programată', 'internat', NOW(), NOW()),
('INT-2025-006', 4,  14, '2025-06-19 10:30:00', NULL, 'Colecistită cronică litiazică - colecistectomie laparoscopică', 'internat', NOW(), NOW()),
('INT-2025-007', 11, 16, '2025-06-21 07:00:00', NULL, 'Hernie inghinală bilaterală - herniorafie programată', 'internat', NOW(), NOW()),
('INT-2025-008', 16, 19, '2025-06-23 15:30:00', NULL, 'Ocluzie intestinală mecanică',                       'internat', NOW(), NOW()),
-- Internări active - Neurologie
('INT-2025-009', 5,  25, '2025-06-16 03:45:00', NULL, 'AVC ischemic în teritoriul ACM stângă',              'internat', NOW(), NOW()),
('INT-2025-010', 6,  26, '2025-06-18 22:00:00', NULL, 'Epilepsie - status epilepticus',                     'internat', NOW(), NOW()),
('INT-2025-011', 12, 28, '2025-06-20 16:20:00', NULL, 'Meningită bacteriană cu Neisseria meningitidis',     'internat', NOW(), NOW()),
('INT-2025-012', 17, 31, '2025-06-24 08:15:00', NULL, 'Neuropatie diabetică severă cu ulcerații',            'internat', NOW(), NOW()),
-- Internări active - Ortopedie
('INT-2025-013', 7,  37, '2025-06-17 12:00:00', NULL, 'Fractură femur drept - osteosinteza cu tijă centromedulară', 'internat', NOW(), NOW()),
('INT-2025-014', 8,  38, '2025-06-19 17:30:00', NULL, 'Luxație de umăr stâng recidivantă',                  'internat', NOW(), NOW()),
('INT-2025-015', 13, 40, '2025-06-21 09:15:00', NULL, 'Fractură tibie stângă - fixare externă Ilizarov',    'internat', NOW(), NOW()),
('INT-2025-016', 18, 43, '2025-06-25 10:00:00', NULL, 'Scolioză severă - evaluare preoperatorie',           'internat', NOW(), NOW()),
-- Internări active - Pediatrie
('INT-2025-017', 9,  49, '2025-06-20 05:00:00', NULL, 'Pneumonie virală bilaterală',                        'internat', NOW(), NOW()),
('INT-2025-018', 14, 50, '2025-06-22 13:40:00', NULL, 'Bronșiolită acută cu insuficiență respiratorie',      'internat', NOW(), NOW()),
('INT-2025-019', 19, 52, '2025-06-24 19:00:00', NULL, 'Angină pectorală instabilă - monitorizare',          'internat', NOW(), NOW()),
('INT-2025-020', 24, 55, '2025-06-25 07:30:00', NULL, 'Cardiomiopatie dilatativă - evaluare inițială',      'internat', NOW(), NOW()),
-- Internări externate
('INT-2025-021', 20, NULL, '2025-06-01 08:00:00', '2025-06-10 14:00:00', 'Ulcer gastroduodenal perforat - suturare chirurgicală', 'externat', NOW(), NOW()),
('INT-2025-022', 21, NULL, '2025-06-03 02:30:00', '2025-06-12 10:00:00', 'AVC hemoragic - neurochirurgie evacuare hematom',       'externat', NOW(), NOW()),
('INT-2025-023', 22, NULL, '2025-06-05 16:00:00', '2025-06-08 09:00:00', 'Entorsă gleznă dreaptă grad II',                       'externat', NOW(), NOW()),
('INT-2025-024', 23, NULL, '2025-06-07 10:15:00', '2025-06-11 11:30:00', 'Otită medie acută supurată',                            'externat', NOW(), NOW()),
('INT-2025-025', 25, NULL, '2025-06-02 07:00:00', '2025-06-14 16:00:00', 'Apendicită acută gangrenată - apendicectomie de urgență','externat', NOW(), NOW());

-- =============================================
-- 7. TRATAMENTE (40 tratamente, ~2 per internare activă)
-- =============================================
INSERT INTO Tratamente (id_internare, descriere, data_tratament, createdAt, updatedAt) VALUES
-- Cardiologie
(1,  'Enalapril 10mg 1 comprimat x 2/zi (dimineață și seară)', '2025-06-15 09:00:00', NOW(), NOW()),
(1,  'Amlodipină 5mg 1 comprimat/zi seara', '2025-06-15 09:00:00', NOW(), NOW()),
(2,  'Aspirină 75mg 1 comprimat/zi', '2025-06-18 15:00:00', NOW(), NOW()),
(2,  'Clopidogrel 75mg 1 comprimat/zi', '2025-06-18 15:00:00', NOW(), NOW()),
(2,  'Heparină 5000 UI subcutanat la 12 ore', '2025-06-18 15:00:00', NOW(), NOW()),
(3,  'Furosemid 40mg 1 comprimat dimineața', '2025-06-20 09:30:00', NOW(), NOW()),
(3,  'Spironolactonă 25mg 1 comprimat/zi', '2025-06-20 09:30:00', NOW(), NOW()),
(4,  'Propafenona 150mg 1 comprimat x 3/zi', '2025-06-22 12:00:00', NOW(), NOW()),
-- Chirurgie
(5,  'Ceftriaxonă 1g IV la 12 ore', '2025-06-17 07:00:00', NOW(), NOW()),
(5,  'Metamizol 1g IV la 8 ore (la nevoie pentru durere)', '2025-06-17 07:00:00', NOW(), NOW()),
(6,  'Omeprazol 40mg IV la 12 ore', '2025-06-19 11:00:00', NOW(), NOW()),
(6,  'Ketoprofen 100mg IM la 12 ore', '2025-06-19 11:00:00', NOW(), NOW()),
(7,  'Amoxicilină/Acid clavulanic 1g la 8 ore PO', '2025-06-21 08:00:00', NOW(), NOW()),
(8,  'Metoclopramid 10mg IV la 8 ore', '2025-06-23 16:00:00', NOW(), NOW()),
(8,  'Soluție Ringer 500ml IV perfuzie continuă', '2025-06-23 16:00:00', NOW(), NOW()),
-- Neurologie
(9,  'Alteplază 0.9mg/kg IV (tromboliză)', '2025-06-16 04:00:00', NOW(), NOW()),
(9,  'Aspirină 325mg 1 comprimat/zi', '2025-06-16 08:00:00', NOW(), NOW()),
(10, 'Diazepam 10mg IV bolus (criză acută)', '2025-06-18 22:15:00', NOW(), NOW()),
(10, 'Levetiracetam 500mg IV la 12 ore', '2025-06-19 08:00:00', NOW(), NOW()),
(11, 'Ceftriaxonă 2g IV la 12 ore', '2025-06-20 17:00:00', NOW(), NOW()),
(11, 'Dexametazonă 8mg IV la 6 ore', '2025-06-20 17:00:00', NOW(), NOW()),
(12, 'Gabapentină 300mg 1 comprimat x 3/zi', '2025-06-24 09:00:00', NOW(), NOW()),
-- Ortopedie
(13, 'Tramadol 100mg IM la 8 ore', '2025-06-17 13:00:00', NOW(), NOW()),
(13, 'Enoxaparină 40mg SC 1 dată/zi (profilaxie TVP)', '2025-06-17 20:00:00', NOW(), NOW()),
(14, 'Ibuprofen 400mg 1 comprimat x 3/zi', '2025-06-19 18:00:00', NOW(), NOW()),
(15, 'Cefazolina 1g IV la 8 ore', '2025-06-21 10:00:00', NOW(), NOW()),
(15, 'Paracetamol 1g IV la 6 ore', '2025-06-21 10:00:00', NOW(), NOW()),
(16, 'Diclofenac 75mg IM la 12 ore', '2025-06-25 10:30:00', NOW(), NOW()),
-- Pediatrie
(17, 'Amoxicilină 50mg/kg/zi PO în 3 prize', '2025-06-20 06:00:00', NOW(), NOW()),
(17, 'Paracetamol sirop 15mg/kg la 6 ore (febră)', '2025-06-20 06:00:00', NOW(), NOW()),
(18, 'Salbutamol 0.15mg/kg nebulizare la 4 ore', '2025-06-22 14:00:00', NOW(), NOW()),
(18, 'Oxigen 2L/min pe mască facială', '2025-06-22 14:00:00', NOW(), NOW()),
(19, 'Nitroglicerină 0.4mg sublingual la nevoie', '2025-06-24 19:30:00', NOW(), NOW()),
(19, 'Metoprolol 50mg 1 comprimat x 2/zi', '2025-06-25 08:00:00', NOW(), NOW()),
(20, 'Carvedilol 6.25mg 1 comprimat x 2/zi', '2025-06-25 08:00:00', NOW(), NOW()),
(20, 'Ramipril 2.5mg 1 comprimat/zi', '2025-06-25 08:00:00', NOW(), NOW()),
-- Tratamente pentru pacienți externați
(21, 'Omeprazol 40mg IV la 12 ore', '2025-06-01 09:00:00', NOW(), NOW()),
(22, 'Manitol 20% 250ml IV la 6 ore', '2025-06-03 03:00:00', NOW(), NOW()),
(23, 'Ibuprofen 400mg 1 comprimat x 2/zi', '2025-06-05 17:00:00', NOW(), NOW()),
(25, 'Cefuroxim 1.5g IV la 8 ore', '2025-06-02 08:00:00', NOW(), NOW());

-- =============================================
-- 8. ADMINISTRĂRI TRATAMENTE (30+ administrări)
-- =============================================
INSERT INTO Administrari (id_tratament, nume_asistent, data_administrare, observatii, createdAt, updatedAt) VALUES
-- Administrări Cardiologie
(1, 'Matei Ioana',       '2025-06-15 09:15:00', 'Administrat oral, pacient cooperant', NOW(), NOW()),
(1, 'Matei Ioana',       '2025-06-15 20:00:00', 'Administrat la ora 20:00', NOW(), NOW()),
(1, 'Stoica Ana',        '2025-06-16 08:30:00', 'Dimineața, TA înainte: 155/95', NOW(), NOW()),
(2, 'Stoica Ana',        '2025-06-15 21:00:00', 'Administrat conform prescripție', NOW(), NOW()),
(3, 'Matei Ioana',       '2025-06-19 08:00:00', 'Administrat cu apă, pe stomacul gol', NOW(), NOW()),
(4, 'Dinu Florin',       '2025-06-19 08:00:00', NULL, NOW(), NOW()),
(5, 'Dinu Florin',       '2025-06-18 20:00:00', 'Administrat SC în zona abdominală', NOW(), NOW()),
(5, 'Matei Ioana',       '2025-06-19 08:00:00', 'Verificat zona injectare - fără hematom', NOW(), NOW()),
(6, 'Marin Daniela',     '2025-06-20 10:00:00', NULL, NOW(), NOW()),
(7, 'Marin Daniela',     '2025-06-20 10:00:00', 'Administrat împreună cu Furosemid', NOW(), NOW()),
-- Administrări Chirurgie
(9, 'Constantin Raluca',  '2025-06-17 07:30:00', 'Perfuzie IV în 30 min', NOW(), NOW()),
(9, 'Constantin Raluca',  '2025-06-17 19:30:00', 'A doua doză IV', NOW(), NOW()),
(10, 'Moldovan Alina',   '2025-06-17 08:00:00', 'Pacient acuză durere 7/10', NOW(), NOW()),
(10, 'Moldovan Alina',   '2025-06-17 16:00:00', 'Durere scăzută la 3/10 după administrare', NOW(), NOW()),
(11, 'Constantin Raluca', '2025-06-19 12:00:00', NULL, NOW(), NOW()),
(12, 'Moldovan Alina',    '2025-06-19 12:00:00', 'Administrat IM în cvadriceps stâng', NOW(), NOW()),
-- Administrări Neurologie
(16, 'Stoica Ana',        '2025-06-16 04:15:00', 'Tromboliză administrată în fereastra terapeutică (2h de la debut)', NOW(), NOW()),
(17, 'Stoica Ana',        '2025-06-16 08:30:00', 'Administrat oral', NOW(), NOW()),
(18, 'Dinu Florin',       '2025-06-18 22:20:00', 'Criza cedată în 3 minute', NOW(), NOW()),
(19, 'Dinu Florin',       '2025-06-19 08:30:00', NULL, NOW(), NOW()),
(19, 'Marin Daniela',     '2025-06-19 20:30:00', 'Fără crize în ultimele 12h', NOW(), NOW()),
(20, 'Marin Daniela',     '2025-06-20 17:30:00', 'Perfuzie IV 60 min', NOW(), NOW()),
(21, 'Sandu Adriana',     '2025-06-20 17:30:00', 'Administrat IV bolus', NOW(), NOW()),
-- Administrări Ortopedie
(23, 'Sandu Adriana',     '2025-06-17 13:30:00', 'Pacient cu EVA 8/10 pre-administrare', NOW(), NOW()),
(23, 'Moldovan Alina',    '2025-06-17 21:30:00', 'EVA scăzut la 4/10', NOW(), NOW()),
(24, 'Sandu Adriana',     '2025-06-17 20:30:00', 'Injectare SC zona abdominală, fără incidente', NOW(), NOW()),
(25, 'Moldovan Alina',    '2025-06-19 18:30:00', 'Administrat oral cu mâncare', NOW(), NOW()),
-- Administrări Pediatrie
(29, 'Matei Ioana',       '2025-06-20 06:30:00', 'Copil cooperant, administrat sirop', NOW(), NOW()),
(30, 'Matei Ioana',       '2025-06-20 06:30:00', 'Temp: 38.9°C înainte de administrare', NOW(), NOW()),
(30, 'Stoica Ana',        '2025-06-20 12:30:00', 'Temp: 37.4°C - scădere', NOW(), NOW()),
(31, 'Dinu Florin',       '2025-06-22 14:30:00', 'Nebulizare 10 minute, SpO2 92% înainte', NOW(), NOW()),
(31, 'Dinu Florin',       '2025-06-22 18:30:00', 'SpO2 crescut la 96% după nebulizare', NOW(), NOW());

-- =============================================
-- 9. MĂSURĂTORI SEMNE VITALE (40+ înregistrări)
-- =============================================
INSERT INTO Masuratori (id_internare, temperatura, tensiune, puls, greutate, nume_asistent, data_masurare, createdAt, updatedAt) VALUES
-- Cardiologie - Pacient 1
(1, 36.8, '160/100', 88, 82.5, 'Matei Ioana',       '2025-06-15 09:00:00', NOW(), NOW()),
(1, 36.6, '150/95',  82, NULL,  'Stoica Ana',        '2025-06-15 21:00:00', NOW(), NOW()),
(1, 36.7, '145/90',  78, NULL,  'Matei Ioana',       '2025-06-16 09:00:00', NOW(), NOW()),
(1, 36.5, '138/88',  76, 82.3,  'Stoica Ana',        '2025-06-16 21:00:00', NOW(), NOW()),
-- Cardiologie - Pacient 2
(2, 37.1, '130/80',  96, 75.0,  'Matei Ioana',       '2025-06-18 15:30:00', NOW(), NOW()),
(2, 36.9, '125/78',  90, NULL,  'Dinu Florin',       '2025-06-19 08:00:00', NOW(), NOW()),
(2, 36.8, '128/82',  85, NULL,  'Matei Ioana',       '2025-06-19 20:00:00', NOW(), NOW()),
-- Cardiologie - Pacient 3
(3, 36.4, '140/88',  72, 95.2,  'Marin Daniela',     '2025-06-20 10:00:00', NOW(), NOW()),
(3, 36.6, '135/85',  70, NULL,  'Marin Daniela',     '2025-06-20 22:00:00', NOW(), NOW()),
-- Chirurgie
(5, 37.2, '120/75',  78, 70.5,  'Constantin Raluca', '2025-06-17 07:00:00', NOW(), NOW()),
(5, 37.8, '115/70',  84, NULL,  'Moldovan Alina',    '2025-06-17 19:00:00', NOW(), NOW()),
(5, 37.4, '118/72',  80, NULL,  'Constantin Raluca', '2025-06-18 07:00:00', NOW(), NOW()),
(6, 36.5, '130/85',  68, 65.0,  'Moldovan Alina',    '2025-06-19 11:00:00', NOW(), NOW()),
(6, 36.7, '125/80',  72, NULL,  'Constantin Raluca', '2025-06-19 23:00:00', NOW(), NOW()),
(7, 36.6, '125/80',  74, 88.0,  'Moldovan Alina',    '2025-06-21 08:00:00', NOW(), NOW()),
(8, 37.5, '110/65',  92, 58.3,  'Sandu Adriana',     '2025-06-23 16:00:00', NOW(), NOW()),
(8, 37.9, '105/60',  96, NULL,  'Sandu Adriana',     '2025-06-24 04:00:00', NOW(), NOW()),
-- Neurologie
(9,  37.0, '180/110', 100, 78.0, 'Stoica Ana',       '2025-06-16 04:00:00', NOW(), NOW()),
(9,  36.8, '160/95',   92, NULL, 'Dinu Florin',      '2025-06-16 12:00:00', NOW(), NOW()),
(9,  36.7, '150/90',   88, NULL, 'Stoica Ana',       '2025-06-16 20:00:00', NOW(), NOW()),
(10, 37.3, '140/85',  110, 62.0, 'Dinu Florin',      '2025-06-18 22:30:00', NOW(), NOW()),
(10, 36.9, '130/80',   82, NULL, 'Marin Daniela',    '2025-06-19 08:00:00', NOW(), NOW()),
(11, 38.5, '115/70',   98, 55.0, 'Marin Daniela',    '2025-06-20 17:00:00', NOW(), NOW()),
(11, 38.2, '120/75',   94, NULL, 'Sandu Adriana',    '2025-06-21 05:00:00', NOW(), NOW()),
(11, 37.6, '118/72',   88, NULL, 'Sandu Adriana',    '2025-06-21 17:00:00', NOW(), NOW()),
(12, 36.5, '135/85',   76, 90.5, 'Marin Daniela',    '2025-06-24 09:00:00', NOW(), NOW()),
-- Ortopedie
(13, 36.9, '130/80',  80, 85.0, 'Sandu Adriana',     '2025-06-17 13:00:00', NOW(), NOW()),
(13, 37.1, '125/78',  76, NULL, 'Moldovan Alina',     '2025-06-18 07:00:00', NOW(), NOW()),
(14, 36.7, '120/75',  70, 63.0, 'Moldovan Alina',     '2025-06-19 18:00:00', NOW(), NOW()),
(15, 36.8, '128/82',  78, 72.5, 'Sandu Adriana',      '2025-06-21 10:00:00', NOW(), NOW()),
(16, 36.5, '115/70',  72, 48.0, 'Sandu Adriana',      '2025-06-25 10:00:00', NOW(), NOW()),
-- Pediatrie
(17, 38.9, '100/60',  120, 28.5, 'Matei Ioana',      '2025-06-20 05:30:00', NOW(), NOW()),
(17, 38.2, '105/65',  110, NULL,  'Stoica Ana',       '2025-06-20 13:00:00', NOW(), NOW()),
(17, 37.4, '108/68',  100, NULL,  'Matei Ioana',      '2025-06-20 21:00:00', NOW(), NOW()),
(18, 37.8, '95/58',   130, 12.0,  'Dinu Florin',      '2025-06-22 14:00:00', NOW(), NOW()),
(18, 37.2, '98/60',   118, NULL,  'Dinu Florin',      '2025-06-22 22:00:00', NOW(), NOW()),
(19, 36.6, '145/92',   82, 80.0,  'Matei Ioana',     '2025-06-24 19:30:00', NOW(), NOW()),
(19, 36.5, '138/88',   76, NULL,  'Stoica Ana',       '2025-06-25 07:30:00', NOW(), NOW()),
(20, 36.8, '120/78',   88, 70.0,  'Matei Ioana',     '2025-06-25 08:00:00', NOW(), NOW()),
(20, 36.7, '118/75',   84, NULL,  'Stoica Ana',       '2025-06-25 20:00:00', NOW(), NOW());
