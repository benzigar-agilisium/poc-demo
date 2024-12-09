-- Create the directories table
CREATE TABLE directories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Create the contents table
CREATE TABLE contents (
    id SERIAL PRIMARY KEY,
    directory_id INT NOT NULL REFERENCES directories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    header VARCHAR(255),
    sub_header VARCHAR(255),
    document_number VARCHAR(100) NOT NULL,
    active_from DATE,
    active_to DATE,
    show_landing_page BOOLEAN DEFAULT FALSE,
    created_at DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Create the files table
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    content_id INT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    link VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);


-- 4 December 2024 9:13:57 AM
INSERT INTO "public"."directories" ("name", "status") VALUES ('Congress', 'ACTIVE');
INSERT INTO "public"."directories" ("name", "status") VALUES ('Journal', 'ACTIVE');
INSERT INTO "public"."directories" ("name", "status") VALUES ('Other', 'ACTIVE');